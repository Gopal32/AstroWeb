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

    //  call external API
    const response = await fetch(
      "https://api-users.astrosway.com/user/web/recommended/astro",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    console.error("Recommended astro error:", error);

    return Response.json(
      { message: "Failed to fetch astrologers" },
      { status: 500 }
    );
  }
}