export async function POST(request) {
  try {
    let { ques1, ques2, ques3, token } = await request.json();

    // Validate input
    if (!ques1 || !ques2 || !ques3) {
      return Response.json(
        {
          statusCode: 400,
          message: "All questions are required",
          data: null,
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api-users.astrosway.com/Onboarding/questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
          astroreqid: "test-request-id-123",
        },
        body: JSON.stringify({
          ques1,
          ques2,
          ques3,
        }),
      }
    );

    const data = await response.json();
    console.log("External API response:", data);

    // Handle error from external API
    if (!response.ok || data.statusCode === 400) {
      return Response.json(
        {
          statusCode: response.status,
          message: data.message || "Request failed",
          data: null,
        },
        { status: response.status }
      );
    }

    return Response.json(
      {
        statusCode: 200,
        message: "Questions submitted successfully",
        data: data.data || data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Questions API error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}