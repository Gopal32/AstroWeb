import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { statusCode: 400, message: "Token is required" },
                { status: 400 }
            );
        }

        const response = NextResponse.json({
            statusCode: 200,
            message: "Token set successfully",
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 2, // 2 days in seconds
        });

        const res = response;
        return res;
    } catch (error) {
        return NextResponse.json(
            { statusCode: 500, message: "Failed to set token" },
            { status: 500 }
        );
    }
}