import { NextResponse } from "next/server";
import { processJournalChat } from "@/utils/ai";
import { JournalEntry } from "@/utils/types";
import {
  generateCacheKey,
  getCachedResponse,
  saveToCache,
} from "@/utils/cache";

export async function POST(request: Request) {
  try {
    const { question, isBriefMode, entries } = await request.json();

    if (!entries || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: "Invalid journal entries data" },
        { status: 400 }
      );
    }

    // Generate cache key and check for cached response
    const cacheKey = generateCacheKey(
      entries as JournalEntry[],
      question,
      isBriefMode
    );
    const cachedResponse = getCachedResponse(cacheKey);

    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    const { response } = await processJournalChat(
      entries as JournalEntry[],
      question,
      isBriefMode
    );

    // Cache the response
    const responseToCache = {
      response,
      timestamp: Date.now(),
    };
    saveToCache(cacheKey, responseToCache);

    return NextResponse.json(responseToCache);
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
