import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    const authorization = token ? token : "null";

    const response = await fetch(
      "https://api-users.astrosway.com/user/offerAstroList?limit=10&page=1&serviceType=chat",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorization,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    console.error("Offer astro error:", error);

    return Response.json(
      { message: "Failed to fetch offer astrologers" },
      { status: 500 }
    );
  }
}