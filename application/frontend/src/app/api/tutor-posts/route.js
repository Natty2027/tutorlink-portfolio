// BFF Layer - Calls backend tutor-posts endpoint
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const course = searchParams.get("course") || "";
    const name = searchParams.get("name") || "";
    
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const url = new URL(`${backendUrl}/api/tutor-posts`);
    if (course) url.searchParams.set("course", course);
    if (name) url.searchParams.set("name", name);
    
    const response = await fetch(url);
    const data = await response.json();
    
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: "Failed to fetch tutor posts", message: e.message },
      { status: 500 }
    );
  }
}
