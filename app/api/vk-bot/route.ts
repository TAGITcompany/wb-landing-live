// app/api/vk-bot/route.ts
export async function POST() {
  // Вставь сюда актуальный код из ВК (сейчас это b96f109a)
  return new Response("b96f109a", {
    headers: { "Content-Type": "text/plain" },
  });
}

export async function GET() {
  // Чтобы ты мог проверить это в браузере
  return new Response("b96f109a", {
    headers: { "Content-Type": "text/plain" },
  });
}