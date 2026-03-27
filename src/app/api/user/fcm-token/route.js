import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = cookies(); 
    const UserToken = cookieStore.get("token")?.value;

    if (!UserToken) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { token } = await request.json();

    if (!token) {
      return Response.json(
        { statusCode: 400, message: "Token is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/fcmToken",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UserToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          platform: "web",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "FCM token update failed",
          data,
        },
        { status: response.status }
      );
    }

    return Response.json({
      statusCode: 200,
      message: "FCM token updated successfully",
      data,
    });
  } catch (error) {
    console.error("FCM token update error:", error);
    return Response.json(
      { statusCode: 500, message: "FCM token update failed" },
      { status: 500 }
    );
  }
}