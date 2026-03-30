import { cookies } from "next/headers";

export async function GET(req, { params }) {
    try {
        const token = cookies().get("token")?.value;

        const { id } = params;

        if (!id) {
            return Response.json(
                { message: "Astro ID is required" },
                { status: 400 }
            );
        }

        const authorization = token ? token : "INTERNAL_AUTH";

        const response = await fetch(
            `https://api-users.astrosway.com/user/astro/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: authorization,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return Response.json(
                { message: "Failed to fetch astro details" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return Response.json(data);

    } catch (error) {
        console.error("Astro API error:", error);

        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}