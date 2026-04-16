import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const VK_TOKEN = process.env.VK_TOKEN;
const VK_CONFIRMATION = process.env.VK_CONFIRMATION; // Сюда впиши 42f85074 в Vercel
const VK_SECRET_KEY = process.env.VK_SECRET_KEY; // Твой тот самый "длинный ключ"
const ADMIN_ID = Number(process.env.ADMIN_ID);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ПРОВЕРКА СЕКРЕТНОГО КЛЮЧА (Тот самый, что не меняется)
    // Если ты его задал в ВК и в Vercel, бот будет слушать только запросы с этим ключом
    if (VK_SECRET_KEY && data.secret !== VK_SECRET_KEY) {
      return new Response('bad secret', { status: 403 });
    }

    // 1. ПОДТВЕРЖДЕНИЕ СЕРВЕРА (Нужно только один раз для кнопки в ВК)
    if (data.type === 'confirmation') {
      return new Response(VK_CONFIRMATION, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // 2. ОБРАБОТКА СООБЩЕНИЙ
    if (data.type === 'message_new') {
      const { from_id, text } = data.object.message;

      // Команда для обновления ссылки (для тебя или Ирины)
      if (from_id === ADMIN_ID && text.toLowerCase().startsWith('/link')) {
        const newLink = text.split(' ')[1];
        if (newLink && newLink.startsWith('http')) {
          await kv.set('current_chat_link', newLink);
          await sendVkMessage(from_id, `✅ Ссылка на чат успешно обновлена!`);
        }
        return new Response('ok');
      }

      // Ответ обычному пользователю
      const savedLink = await kv.get('current_chat_link') as string;
      const finalLink = savedLink || "https://vk.me/schoolmarketplace"; // Заглушка, если в базе пусто

      const welcomeMessage = `Здравствуйте! Рады вашему отклику! 👋\n\nВот актуальная ссылка на чат с Ириной:\n${finalLink}`;
      
      await sendVkMessage(from_id, welcomeMessage);
      return new Response('ok');
    }

    return new Response('ok');
  } catch (error) {
    console.error('VK Bot Error:', error);
    return new Response('ok');
  }
}

// Для проверки в браузере (чтобы ты видел, какой код сейчас активен)
export async function GET() {
  return new Response(`Код подтверждения: ${VK_CONFIRMATION}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

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