export async function GET() {
  return new Response("БОТ ЖИВ", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}