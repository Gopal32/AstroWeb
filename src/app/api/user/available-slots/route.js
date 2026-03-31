import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { astroId, sessionType, serviceType, userId } =
      await request.json();

     const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 
    if (!token) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate input
    if (!astroId || !sessionType || !serviceType || !userId) {
      return Response.json(
        {
          statusCode: 400,
          message: "astroId, sessionType, serviceType, userId are required",
        },
        { status: 400 }
      );
    }

    // Build URL with query params
    const url = `https://api-users.astrosway.com/user/timeAccess?astroId=${astroId}&sessionType=${sessionType}&serviceType=${serviceType}`;

    // Call external API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        userId: userId,
      },
    });

    const data = await response.json();

    // Handle API error
    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data?.message || "Request failed",
          data: null,
        },
        { status: response.status }
      );
    }

    // Success
    return Response.json(
      {
        statusCode: 200,
        message: "Time access fetched successfully",
        data: data?.data || data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("TimeAccess API error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}