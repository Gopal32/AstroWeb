export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");

    if (!input) {
      return Response.json(
        { statusCode: 400, message: "Input is required" },
        { status: 400 }
      );
    } 

    const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${GOOGLE_PLACES_API_KEY}&language=en`
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          statusCode: response.status,
          message: data?.error_message || "Google API error",
        },
        { status: response.status }
      );
    }

    return Response.json(
      {
        statusCode: 200,
        data: data?.predictions || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Places API error:", error);

    return Response.json(
      {
        statusCode: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}