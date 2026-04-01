import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const response = await fetch(
      `https://api-users.astrosway.com/payment/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: "Failed to fetch payment history",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    console.error("Payment History Error:", error);

    return Response.json(
      { statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}