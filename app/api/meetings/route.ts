import { getMeetings, getMeetingsByDate } from "@/lib/meetings-db";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get("date");
  if (date) return Response.json(await getMeetingsByDate(date));

  const query = params.get("query") ?? "";
  const pageParam = params.get("page") ?? "1";
  const page = Number(pageParam);
  if (!/^\d+$/.test(pageParam) || !Number.isSafeInteger(page) || page < 1) {
    return Response.json({ error: "Invalid page" }, { status: 400 });
  }
  return Response.json(await getMeetings(query, page));
}
