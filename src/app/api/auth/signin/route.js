export async function POST(request) {
  try {
    let { emailId, password } = await request.json();

    emailId = emailId?.trim();
    password = password?.trim();

    if (!emailId || !password) {
      return Response.json(
        {
          statusCode: 400,
          message: "Email and password are required",
          data: null,
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/signinWeb",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "INTERNAL_AUTH",
        },
        body: JSON.stringify({ emailId, password }),
      }
    );

    const data = await response.json();
    console.log("External API response:", data);

    if (data.statusCode == 400) {
      return Response.json(
        {
          message: data.message,
        }
      );
    }

    // ✅ FIX: return actual inner data
    return Response.json(
      {
        statusCode: 200,
        message: "Sign in successful",
        data: data.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign in error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}