// BFF Layer - Calls backend courses endpoint
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const url = new URL(`${backendUrl}/api/courses`);
    if (query) url.searchParams.set("query", query);

    const response = await fetch(url);
    const data = await response.json();

    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: "Failed to fetch courses", message: e.message },
      { status: 500 }
    );
  }
}
