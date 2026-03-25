export async function POST(request) {
  try {
    const { token, platform } = await request.json();

    if (!token || !platform) {
      return Response.json(
        { statusCode: 400, message: "Token and platform are required" },
        { status: 400 }
      );
    }

    // Call external FCM token update API
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/fcmToken",
      {
        method: "POST",
        headers: {
          Authorization: "INTERNAL_AUTH",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          platform: platform,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "FCM token update failed",
          data: data,
        },
        { status: response.status }
      );
    }

    return Response.json({
      statusCode: 200,
      message: "FCM token updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("FCM token update error:", error);
    return Response.json(
      { statusCode: 500, message: "FCM token update failed" },
      { status: 500 }
    );
  }
}
