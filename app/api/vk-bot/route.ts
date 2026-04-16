import Redis from 'ioredis';

// Подключаемся через ту самую одну строку, которая у тебя в Vercel уже есть
const redis = new Redis(process.env.REDIS_URL || '');

const VK_TOKEN = process.env.VK_TOKEN;
const VK_CONFIRMATION = process.env.VK_CONFIRMATION;
const VK_SECRET_KEY = process.env.VK_SECRET_KEY;
const ADMIN_ID = Number(process.env.ADMIN_ID);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Проверка секретного ключа (чтобы не спамили)
    if (VK_SECRET_KEY && data.secret !== VK_SECRET_KEY) {
      return new Response('bad secret', { status: 403 });
    }

    // 1. Подтверждение для ВК (одноразовое)
    if (data.type === 'confirmation') {
      return new Response(VK_CONFIRMATION, { headers: { 'Content-Type': 'text/plain' } });
    }

    // 2. Обработка новых сообщений
    if (data.type === 'message_new') {
      const { from_id, text } = data.object.message;

      // Команда /link для админа (тебя или Ирины)
      if (from_id === ADMIN_ID && text.toLowerCase().startsWith('/link')) {
        const newLink = text.split(' ')[1];
        if (newLink?.startsWith('http')) {
          await redis.set('current_chat_link', newLink);
          await sendVkMessage(from_id, `✅ Ссылка обновлена!`);
          return new Response('ok');
        }
      }

      // Получаем ссылку из базы или берем стандартную
      const savedLink = await redis.get('current_chat_link');
      const finalLink = savedLink || "https://vk.me/schoolmarketplace";

      const welcomeMsg = `Здравствуйте! Рады вашему отклику! 👋\n\nВот актуальная ссылка на чат с Ириной:\n${finalLink}`;
      
      await sendVkMessage(from_id, welcomeMsg);
      return new Response('ok');
    }

    return new Response('ok');
  } catch (error) {
    console.error('Bot error:', error);
    return new Response('ok');
  }
}

export async function GET() {
  return new Response(`Бот активен. Код: ${VK_CONFIRMATION}`, {
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

  await fetch(`https://api.vk.com/method/messages.send?${params.toString()}`, { method: 'POST' });
}