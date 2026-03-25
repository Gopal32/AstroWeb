export async function POST(request) {
  try {
    let { token, password } = await request.json();

    // Clean input
    token = token?.trim();
    password = password?.trim();

    // Validation
    if (!token || !password) {
      return Response.json(
        {
          statusCode: 400,
          message: "Token and new password are required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Call external API
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/resetPasswordWeb",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "INTERNAL_AUTH", 
        },
        body: JSON.stringify({
          token: token,
          newPassword: password, 
        }),
      }
    );

    const data = await response.json();
    console.log("Reset password API response:", data);

    // Handle API error
    if (data?.statusCode !== 200) {
      return Response.json(
        {
          statusCode: data?.statusCode || 400,
          message: data?.message || "Reset password failed",
          data: null,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        statusCode: 200,
        message: "Password reset successful",
        data: data?.data || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}