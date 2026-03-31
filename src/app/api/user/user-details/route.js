import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Parse request body
    const {
      sessionType,
      serviceType,
      astroId,
      message,
      category,
      timeSlot,
    } = await request.json();

    // Get token from cookies
    const token = cookies().get("token")?.value;
    
    // Authentication check
    if (!token) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (
      !sessionType ||
      !serviceType ||
      !astroId ||
      !message ||
      !timeSlot
    ) {
      return Response.json(
        {
          statusCode: 400,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate message object
    const {
      fullName,
      gender,
      placeOfBirth,
      dateOfBirth,
      timeOfBirth,
    } = message;

    if (
      !fullName ||
      !gender ||
      !placeOfBirth ||
      !dateOfBirth ||
      !timeOfBirth
    ) {
      return Response.json(
        {
          statusCode: 400,
          message: "All user details are required",
        },
        { status: 400 }
      );
    }

    // External API call
    const response = await fetch("https://api-users.astrosway.com/user/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // same as your curl
      },
      body: JSON.stringify({
        sessionType,
        serviceType,
        astroId,
        message,
        category: category || "none",
        timeSlot,
      }),
    });

    const data = await response.json();
    console.log("Service API Response:", data);


    // Handle external API errors
    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data?.message || "Service request failed",
          data: null,
        },
        { status: response.status }
      );
    }

    // Success response
    return Response.json(
      {
        statusCode: 200,
        message: "Service request created successfully",
        data: data?.data || data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Service API error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}