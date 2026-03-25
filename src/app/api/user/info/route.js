export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Call external user info API
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/info",
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "Failed to fetch user info",
          data: data,
        },
        { status: response.status }
      );
    }

    return Response.json({
      statusCode: 200,
      message: "User info fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("User info error:", error);
    return Response.json(
      { statusCode: 500, message: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}
