export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const HF_API_TOKEN = process.env.HF_API_TOKEN;

    if (!HF_API_TOKEN) {
      return Response.json(
        { error: "API token not configured" },
        { status: 500 }
      );
    }

    // NEW ENDPOINT - Updated URL
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text.substring(0, 10000),
          parameters: { 
            max_length: 1024, 
            min_length: 100,
            do_sample: false
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Hugging Face API error:", errorData);
      
      // If model is loading, return a helpful message
      if (response.status === 503) {
        return Response.json(
          { error: "Model is loading, please try again in a moment", loading: true },
          { status: 503 }
        );
      }
      
      return Response.json(
        { error: "Failed to enhance text" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data) && data[0]?.summary_text) {
      return Response.json({ summary: data[0].summary_text });
    } else if (data.summary_text) {
      return Response.json({ summary: data.summary_text });
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      return Response.json({ summary: data[0].generated_text });
    } else {
      console.error("Unexpected response format:", data);
      return Response.json({ summary: text });
    }
  } catch (error) {
    console.error("API route error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}