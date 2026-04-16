import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || '');
const VK_TOKEN = process.env.VK_TOKEN;
const VK_CONFIRMATION = process.env.VK_CONFIRMATION;
const VK_SECRET_KEY = process.env.VK_SECRET_KEY;
const ADMIN_ID = Number(process.env.ADMIN_ID);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (VK_SECRET_KEY && data.secret !== VK_SECRET_KEY) {
      return new Response('bad secret', { status: 403 });
    }

    if (data.type === 'confirmation') {
      return new Response(VK_CONFIRMATION, { headers: { 'Content-Type': 'text/plain' } });
    }

    if (data.type === 'message_new') {
      const from_id = data.object.message.from_id;
      const text = data.object.message.text || '';

      let finalLink = "https://vk.me/schoolmarketplace"; 
      try {
        const savedLink = await redis.get('current_chat_link');
        if (savedLink) finalLink = savedLink;
      } catch (e) {}

      // Команда /link для админа
      if (from_id === ADMIN_ID && text.toLowerCase().startsWith('/link')) {
        const newLink = text.split(' ')[1];
        if (newLink?.startsWith('http')) {
          await redis.set('current_chat_link', newLink);
          const res = await sendVkMessage(from_id, "✅ Ссылка обновлена!");
          await redis.set('last_vk_error', JSON.stringify(res));
          return new Response('ok');
        }
      }

      const welcomeMsg = `Здравствуйте! 👋\n\nВот актуальная ссылка на чат с Ириной:\n${finalLink}`;
      
      // Отправляем сообщение и сохраняем ответ ВК в базу для отладки
      const vkResponse = await sendVkMessage(from_id, welcomeMsg);
      await redis.set('last_vk_error', JSON.stringify(vkResponse));

      return new Response('ok');
    }

    return new Response('ok');
  } catch (error) {
    return new Response('ok');
  }
}

// ЭТА СТРАНИЦА ТЕПЕРЬ ПОКАЖЕТ ОШИБКУ
export async function GET() {
  const savedLink = await redis.get('current_chat_link');
  const finalLink = savedLink || "https://vk.me/schoolmarketplace";
  
  // Отдаем JSON, который легко прочитать в мини-приложении
  return new Response(JSON.stringify({ link: finalLink }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Чтобы мини-приложение могло достучаться
    }
  });
}

async function sendVkMessage(peer_id: number, message: string) {
  if (!VK_TOKEN) return { error: "VK_TOKEN is missing in Vercel" };

  const params = new URLSearchParams({
    access_token: VK_TOKEN,
    peer_id: peer_id.toString(),
    message: message,
    random_id: Math.floor(Math.random() * 2147483647).toString(),
    v: '5.131'
  });

  const response = await fetch(`https://api.vk.com/method/messages.send`, {
    method: 'POST',
    body: params
  });
  
  return await response.json();
}