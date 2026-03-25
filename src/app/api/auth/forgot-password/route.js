
export async function POST(request) {
    try {
        const { emailId } = await request.json();
        console.log("Received email for forgot password:", emailId);
        // Validate input
        if (!emailId) {
            return Response.json({
                statusCode: 400,
                message: "Email is required",
                data: null,
            }, { status: 400 });
        }
        console.log("Received forgot password request for email:", emailId);
        const response = await fetch("https://api-users.astrosway.com/Onboarding/forgotPasswordWeb", {
            method: "POST",
            headers: {
                Authorization: "INTERNAL_AUTH",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailId: emailId })
        });

        const data = await response.json();

        if (data.statusCode == 400) {
            return Response.json(
                {
                    message: data.message,
                }
            );
        }

        if (response.ok) {
            return Response.json({
                statusCode: 200,
                message: data.message || "Password reset link sent successfully",
                data: null,
            });
        } else {
            return Response.json({
                statusCode: response.status,
                message: data.message || "Failed to send password reset link",
                data: null,
            }, { status: response.status });
        }
    } catch (err) {
        console.error("Error in forget-password route:", err);
        return Response.json(
            {
                statusCode: 500,
                message: "Internal Server Error",
                data: null,
            },
            { status: 500 }
        );
    }
}