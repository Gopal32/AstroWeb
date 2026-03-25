export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { valid: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Call external API to check if email exists
    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/emailChecker",
      {
        method: "POST",
        headers: {
          Authorization: "INTERNAL_AUTH",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: email,
        }),
      }
    );

    const data = await response.json();

    // Return response based on external API response
    return Response.json({
      valid: response.ok,
      exists: data.exists || data.message?.includes("already"),
      message: data.message || "Email checked successfully",
      ...data,
    });
  } catch (error) {
    console.error("Email check error:", error);
    return Response.json(
      { valid: false, message: "Email verification failed" },
      { status: 500 }
    );
  }
}
