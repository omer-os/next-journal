import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "No text received" }, { status: 400 });
    }

    const prompt = `Summarize this journal entry in 2-3 short sentences. Focus only on the key points and main emotions. Be concise and direct:

${text}`;

    const response = await generateText({
      model: anthropic("claude-3-sonnet-20240229"),
      prompt,
      maxTokens: 100,
      temperature: 0.7,
    });

    return Response.json({ summary: response.text });
  } catch (error) {
    console.error("Error in summarize API:", error);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
