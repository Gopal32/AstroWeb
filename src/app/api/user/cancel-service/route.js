import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { serviceType, roomId } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      "https://api-users.astrosway.com/user/cancelService",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceType, roomId }),
      }
    );

    const data = await response.json();
    console.log("Cancel Service Response:", data);

    return Response.json(data, { status: response.status });
  } catch (err) {
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}