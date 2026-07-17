// BFF Layer - Calls backend requests endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return Response.json(data, { status: response.status });
  } catch (e) {
    return Response.json(
      { error: "Failed to create request", message: e.message },
      { status: 500 }
    );
  }
}
