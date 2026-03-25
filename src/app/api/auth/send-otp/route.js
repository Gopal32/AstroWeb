export async function POST(request) {
  try {
    const { phone } = await request.json();

    // Validate input
    if (!phone) {
      return Response.json(
        {
          statusCode: 400,
          message: "Phone number is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Clean phone (remove non-digits)
    const cleanPhone = phone.replace(/\D/g, "");

    // Validate phone length (10–15 digits)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return Response.json(
        {
          statusCode: 400,
          message: "Invalid phone number",
          data: null,
        },
        { status: 400 }
      );
    }

    // Call external API
    console.log("Sending OTP to phone:", cleanPhone);
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/signIn",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "INTERNAL_AUTH",
        },
        body: JSON.stringify({
          number: cleanPhone,
          code: "91", // ✅ default country code
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "Failed to send OTP",
          data: null,
        },
        { status: response.status }
      );
    }

    return Response.json(
      {
        statusCode: 200,
        message: "OTP sent successfully",
        data: {
          number: cleanPhone,
          code: "91",
          ...data.data,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP API error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error. Please try again.",
        data: null,
      },
      { status: 500 }
    );
  }
}