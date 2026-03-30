import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://api-users.astrosway.com/user/firstTimeFreeAstroList?limit=10&page=1&serviceType=chat",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    console.error("Free astro error:", error);

    return Response.json(
      { message: "Failed to fetch free astrologers" },
      { status: 500 }
    );
  }
}