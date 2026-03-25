export async function POST(request) {
  try {
    const { userId, otp } = await request.json();

    if (!userId || !otp) {
      return Response.json(
        { statusCode: 400, message: "User ID and OTP are required" },
        { status: 400 }
      );
    }

    // Call external OTP verification API
  console.log("Verifying OTP for userId:", userId, "with OTP:", otp);
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/otpVerify",
      {
        method: "POST",
        headers: {
          Authorization: "INTERNAL_AUTH",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          code: otp,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "OTP verification failed",
          data: data,
        },
        { status: response.status }
      );
    }

    return Response.json({
      statusCode: 200,
      message: "OTP verified successfully",
      data: data,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return Response.json(
      { statusCode: 500, message: "OTP verification request failed" },
      { status: 500 }
    );
  }
}
