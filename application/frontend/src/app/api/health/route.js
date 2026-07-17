// BFF Layer - Calls backend health endpoint
export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/health`);
    const data = await response.json();
    
    return Response.json({
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return Response.json(
      {
        status: "error",
        message: "Failed to connect to backend",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
