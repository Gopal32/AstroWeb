import { cookies } from "next/headers";

export async function GET(request, { params }) {
  try {
    const { astroId } = params;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 
    
    // Auth check
    if (!token) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate astroId
    if (!astroId) {
      return Response.json(
        { statusCode: 400, message: "astroId is required" },
        { status: 400 }
      );
    }

    // External API call
    const response = await fetch(
      `https://api-users.astrosway.com/user/queueTime/${astroId}`,
      {
        method: "GET",
        headers: {
          Authorization: token, // same as your curl
        },
      }
    );

    const data = await response.json();
    console.log("QueueTime API Response:", data);

    // Handle external API error
    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data?.message || "Queue API failed",
          data: null,
        },
        { status: response.status }
      );
    }

    // Success response
    return Response.json(
      {
        statusCode: 200,
        message: "Queue time fetched successfully",
        data: data?.data || data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("QueueTime API error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}