import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { JournalEntry } from "./types";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

interface AIResponse {
  response: string;
  references: string[];
}

export async function processJournalChat(
  entries: JournalEntry[],
  question: string,
  isBriefMode: boolean
): Promise<AIResponse> {
  try {
    // Combine all entries into a single context
    const context = entries
      .map(
        (entry) =>
          `Entry ID: ${entry.id}\nDate: ${new Date(
            entry.createdAt
          ).toLocaleDateString()}\nContent: ${entry.text}`
      )
      .join("\n\n");

    const prompt = `You are a helpful AI assistant that helps users understand and reflect on their journal entries. 
    You have access to the user's journal entries and should use them to provide meaningful insights and answers to their questions.
    ${
      isBriefMode
        ? "Keep your responses extremely concise and direct. Only provide the essential information without any additional context or explanation. Maximum 1-2 sentences."
        : "Provide detailed responses with specific references to their journal entries."
    }

    IMPORTANT RULES:
    1. NEVER include the word "REFERENCES" or entry IDs in your response text
    2. NEVER mention "in these entries" or similar phrases
    3. In brief mode, ONLY provide the direct answer to the question
    4. For personal questions, always base your response on the user's actual experiences and preferences from their journal entries
    5. At the end of your response, include a list of Entry IDs that you referenced in your response, separated by commas.
    Format: [REFERENCES: id1, id2, id3]

    CONTEXT:
    - You have access to the user's journal entries which contain their personal experiences, preferences, and daily life
    - For personal questions, always look for patterns, preferences, and past experiences in their entries
    - If you can't find relevant information in their entries, say "I don't have enough information from your journal to provide a personalized suggestion"

    Here are the user's journal entries:
    ${context}

    User's question: ${question}`;

    const response = await generateText({
      model: anthropic("claude-3-sonnet-20240229"),
      prompt,
      maxTokens: isBriefMode ? 150 : 500,
      temperature: 0.7,
    });

    // Extract references from the response
    const referencesMatch = response.text.match(/\[REFERENCES: (.*?)\]/);
    const references = referencesMatch
      ? referencesMatch[1].split(",").map((id) => id.trim())
      : [];

    // Remove the references part from the response
    const cleanResponse = response.text
      .replace(/\[REFERENCES: .*?\]/, "")
      .trim();

    return {
      response: cleanResponse,
      references,
    };
  } catch (error) {
    console.error("Error processing AI request:", error);
    throw new Error("Failed to process AI request");
  }
}
