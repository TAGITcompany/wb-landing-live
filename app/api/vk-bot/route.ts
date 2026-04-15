import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const VK_TOKEN = process.env.VK_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. ЛОГИКА ПОДТВЕРЖДЕНИЯ (Берем код из базы данных)
    if (data.type === 'confirmation') {
      // Ищем код в Redis, если его там нет — берем из переменной (на всякий случай)
      const dynamicConfirmation = await kv.get('vk_confirmation_code') as string;
      const fallbackConfirmation = process.env.VK_CONFIRMATION;
      
      return new Response(dynamicConfirmation || fallbackConfirmation, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // 2. ОБРАБОТКА СООБЩЕНИЙ
    if (data.type === 'message_new') {
      const { from_id, text } = data.object.message;

      // СЕКРЕТНАЯ КОМАНДА ДЛЯ ТЕБЯ И ИРИНЫ
      // Пишешь боту в ЛС: /set_code b96f109a
      if (from_id === ADMIN_ID && text.toLowerCase().startsWith('/set_code')) {
        const newCode = text.split(' ')[1];
        if (newCode) {
          await kv.set('vk_confirmation_code', newCode);
          await sendVkMessage(from_id, `✅ Код подтверждения обновлен на: ${newCode}\nТеперь жми кнопку "Подтвердить" в ВК!`);
        }
        return new Response('ok');
      }

      // ОБЫЧНАЯ ЛОГИКА (Обновление ссылки на чат)
      if (from_id === ADMIN_ID && text.toLowerCase().startsWith('/link')) {
        const newLink = text.split(' ')[1];
        if (newLink && newLink.startsWith('http')) {
          await kv.set('current_chat_link', newLink);
          await sendVkMessage(from_id, `✅ Ссылка на чат обновлена!`);
        }
        return new Response('ok');
      }

      // ОТВЕТ ПОЛЬЗОВАТЕЛЮ
      const savedLink = await kv.get('current_chat_link') as string;
      const finalLink = savedLink || "https://vk.me/schoolmarketplace";
      await sendVkMessage(from_id, `Здравствуйте! Вот ссылка на чат с Ириной:\n${finalLink}`);
      
      return new Response('ok');
    }

    return new Response('ok');
  } catch (e) {
    return new Response('ok');
  }
}

async function sendVkMessage(peer_id: number, message: string) {
  await fetch(`https://api.vk.com/method/messages.send?v=5.131`, {
    method: 'POST',
    body: new URLSearchParams({
      access_token: VK_TOKEN!,
      peer_id: peer_id.toString(),
      message: message,
      random_id: Math.random().toString()
    })
  });
}