import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 
    if (!token) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/info",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // ✅ IMPORTANT (avoid stale data)
      }
    );

    // ✅ Handle non-200 responses
    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: "Failed to fetch user info",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching user info:", error);

    return Response.json(
      { statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}