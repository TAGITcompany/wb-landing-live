import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Эти переменные мы пропишем в настройках Vercel позже
const VK_TOKEN = process.env.VK_TOKEN; 
const VK_CONFIRMATION = process.env.VK_CONFIRMATION;
const ADMIN_ID = Number(process.env.ADMIN_ID); 

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Подтверждение сервера для Callback API в ВК
    if (data.type === 'confirmation') {
      return new Response(VK_CONFIRMATION);
    }

    // 2. Обработка новых сообщений в группе
    if (data.type === 'message_new') {
      const { from_id, text } = data.object.message;

      // ЛОГИКА АДМИН-ПАНЕЛИ (ДЛЯ ИРИНЫ)
      // Если пишет Ирина и сообщение начинается с команды /link
      if (from_id === ADMIN_ID && text.toLowerCase().startsWith('/link')) {
        const parts = text.split(' ');
        const newLink = parts[1]; // Берем саму ссылку после пробела
        
        if (!newLink || !newLink.startsWith('http')) {
          await sendVkMessage(from_id, "❌ Ошибка! Введите корректную ссылку. Пример: /link https://vk.me/join/...");
          return new Response('ok');
        }

        // Сохраняем новую ссылку в базу данных Redis (Vercel KV)
        await kv.set('current_chat_link', newLink);
        await sendVkMessage(from_id, `✅ Ссылка успешно обновлена на:\n${newLink}`);
        return new Response('ok');
      }

      // ЛОГИКА ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
      // Достаем актуальную ссылку из базы данных
      const savedLink = await kv.get('current_chat_link') as string;
      const finalLink = savedLink || "https://vk.me/schoolmarketplace"; // Ссылка по умолчанию

      const messageText = `Здравствуйте! Рады вашему отклику! 👋\n\nВот актуальная ссылка на чат с Ириной:\n${finalLink}`;
      
      await sendVkMessage(from_id, messageText);
      return new Response('ok');
    }

    return new Response('ok');
  } catch (error) {
    console.error('Bot error:', error);
    return new Response('ok');
  }
}

// Вспомогательная функция для отправки сообщений в ВК через API
async function sendVkMessage(peer_id: number, message: string) {
  const params = new URLSearchParams({
    access_token: VK_TOKEN!,
    peer_id: peer_id.toString(),
    message: message,
    random_id: Math.random().toString(),
    v: '5.131'
  });

  await fetch(`https://api.vk.com/method/messages.send?${params.toString()}`, {
    method: 'POST'
  });
}