export async function POST(request) {
  try {
    const { fullName, email, password, whatsappPhone, code = "91" } = await request.json();

    // Validate required fields
    if (!fullName || !email || !password || !whatsappPhone) {
      return Response.json(
        { statusCode: 400, message: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("Signup request received with data:", {
      fullName,
      email,
      whatsappPhone,
      password,
      code
    });
    // Call external signup API
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/signupWeb",
      {
        method: "POST",
        headers: {
          Authorization: "INTERNAL_AUTH",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: email,
          password: password,
          fullName: fullName,
          code: code,
          number: whatsappPhone,
        }),
      }
    );

    const data = await response.json();
    console.log("External API response:", data);

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "Signup failed",
          data: data,
        },
        { status: response.status }
      );
    }

    return Response.json({
      statusCode: 200,
      message: "Signup successful",
      data: data,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { statusCode: 500, message: "Signup request failed" },
      { status: 500 }
    );
  }
}
