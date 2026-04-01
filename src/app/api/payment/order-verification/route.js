import { cookies } from "next/headers";

export async function POST(req) {
  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const response = await fetch(
      "https://api-users.astrosway.com/payment/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: body.orderId,
          paymentId: body.paymentId,
          signature: body.signature,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: "Payment verification failed",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
  
    return Response.json(data);

  } catch (error) {
    console.error("Verify Payment Error:", error);

    return Response.json(
      { statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}