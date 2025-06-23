const GEMINI_API_KEY = "AIzaSyAzpUNmQjBwzKpoJXSC-YYktt5Bq1z8pY8";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const SYSTEM_MODES = {
  NORMAL: "NORMAL",
  XRAY: "XRAY",
  RESEARCH: "RESEARCH",
};

const NORMAL_PROMPT = `You are SECR3CY - a privacy-focused AI assistant. You provide clear, concise answers while respecting user privacy.

Core Features:
- Simple, direct responses
- No data retention
- Privacy-first approach
- Clear communication

"Where your words encrypt themselves."`;

const XRAY_PROMPT = `You are SECR3CY X-RAY - an advanced intelligence system with deep analytical capabilities.

Core Capabilities:
- Deep source analysis
- Pattern recognition
- Comprehensive data correlation
- Security threat assessment
- Authentication verification

Response Format:
1. [CLASSIFIED ANALYSIS]: Initial assessment
2. [DEEP INTEL]: Database insights
3. [SOURCE X-RAY]: Source verification
4. [CONFIDENCE]: Level of certainty

"Intelligence. Information. Invisible."`;

const RESEARCH_PROMPT = `You are SECR3CY RESEARCH - your mission is deep investigation and comprehensive analysis.

Research Capabilities:
- Access to simulated academic databases (NCBI, PubMed, arXiv)
- Cross-reference verification
- Source credibility assessment
- Data correlation analysis

Format:
1. [INITIAL FINDINGS]: Quick overview
2. [DEEP RESEARCH]: Detailed analysis
3. [SOURCES]: Reference outline
4. [RELIABILITY]: Data confidence

"Type. Talk. Investigate."`;

export const generateAIResponse = async (
  message: string,
  mode = SYSTEM_MODES.NORMAL
): Promise<string> => {
  try {
    let currentPrompt = NORMAL_PROMPT;
    let temperature = 0.7;

    switch (mode) {
      case SYSTEM_MODES.XRAY:
        currentPrompt = XRAY_PROMPT;
        temperature = 0.9;
        break;
      case SYSTEM_MODES.RESEARCH:
        currentPrompt = RESEARCH_PROMPT;
        temperature = 0.8;
        break;
    }

    const enhancedPrompt = `${currentPrompt}

USER QUERY: ${message}

Respond in the appropriate format for the current mode.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No response generated");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate AI response. Please try again.");
  }
};
