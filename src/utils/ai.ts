import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { JournalEntry } from "./types";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

interface AIResponse {
  response: string;
}

export async function processJournalChat(
  entries: JournalEntry[],
  question: string,
  isBriefMode: boolean
): Promise<AIResponse> {
  try {
    // Combine all entries into a single context with better formatting
    const context = entries.map((entry) => `${entry.text}`).join("\n\n");

    const prompt = `You are a helpful AI assistant analyzing a user's journal entries. Your task is to provide accurate, personalized responses based on the journal content.

    ${
      isBriefMode
        ? "Provide a concise, direct answer (1-2 sentences max)."
        : "Provide a detailed response with specific insights from their entries."
    }

    RULES:
    1. Base all answers on the actual journal content
    2. For personal questions, look for patterns and specific mentions
    3. If information isn't in the entries, say "I don't have enough information in your journal to answer that"
    4. Never mention "in your entries" or similar phrases
    5. Keep responses natural and conversational

    Journal Entries:
    ${context}

    Question: ${question}`;

    const response = await generateText({
      model: anthropic("claude-3-7-sonnet-20250219"),
      prompt,
      maxTokens: isBriefMode ? 150 : 500,
      temperature: 0.7,
    });

    return {
      response: response.text.trim(),
    };
  } catch (error) {
    console.error("Error processing AI request:", error);
    throw new Error("Failed to process AI request");
  }
}
