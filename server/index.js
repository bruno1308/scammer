import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env from the parent directory (project root)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });

// Import prompt configs for each level
import { getPromptConfig as getLevel1Config } from "./prompts/level1.js";
import { getPromptConfig as getLevel2Config } from "./prompts/level2.js";
import { getPromptConfig as getLevel3Config } from "./prompts/level3.js";
import { getPromptConfig as getLevel4Config } from "./prompts/level4.js";
import { getPromptConfig as getLevel5Config } from "./prompts/level5.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Map level numbers to prompt config functions
const levelConfigs = {
  1: getLevel1Config,
  2: getLevel2Config,
  3: getLevel3Config,
  4: getLevel4Config,
  5: getLevel5Config,
};

// Random victim data generators per level
const victimData = {
  1: {
    names: ["Dorothy Miller", "Margaret Thompson", "Betty Johnson", "Harold Patterson", "Eugene Wilkins"],
    ages: [68, 72, 75, 79, 82],
    locations: ["Topeka, Kansas", "Boca Raton, Florida", "Sun City, Arizona", "Duluth, Minnesota", "Savannah, Georgia"],
  },
  2: {
    names: ["Michael Reeves", "Sandra Collins", "David Hernandez", "Karen Mitchell", "James O'Brien"],
    ages: [38, 42, 45, 47, 51],
    locations: ["Columbus, Ohio", "Sacramento, California", "Charlotte, North Carolina", "Portland, Oregon", "Milwaukee, Wisconsin"],
  },
  3: {
    names: ["Jennifer Walsh", "Brian Kowalski", "Angela Davis", "Chris Patel", "Nicole Bergstrom"],
    ages: [33, 38, 42, 46, 52],
    locations: ["Denver, Colorado", "Austin, Texas", "Nashville, Tennessee", "Minneapolis, Minnesota", "Raleigh, North Carolina"],
  },
  4: {
    names: ["Linda Harrison", "Diane Morales", "Robert Jennings", "Susan Weaver", "Patricia Kim"],
    ages: [45, 52, 55, 48, 61],
    locations: ["Scottsdale, Arizona", "Charleston, South Carolina", "Omaha, Nebraska", "Tampa, Florida", "Albuquerque, New Mexico"],
  },
  5: {
    names: ["Catherine Shaw", "Andrew Mercer", "Victoria Chen", "Thomas Blackwell", "Rachel Goldstein"],
    ages: [38, 42, 45, 48, 52],
    locations: ["San Francisco, California", "Boston, Massachusetts", "Chicago, Illinois", "Seattle, Washington", "New York, New York"],
  },
};

function getRandomVictim(level) {
  const data = victimData[level];
  const index = Math.floor(Math.random() * data.names.length);
  return {
    name: data.names[index],
    age: data.ages[index],
    location: data.locations[index],
  };
}

// POST /api/session - Create an ephemeral OpenAI Realtime session
app.post("/api/session", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Server configuration error: OPENAI_API_KEY is not set.",
    });
  }

  const { level = 1 } = req.body;

  // Validate level
  if (!Number.isInteger(level) || level < 1 || level > 5) {
    return res.status(400).json({
      error: "Invalid level. Must be an integer between 1 and 5.",
    });
  }

  // Get the prompt config for this level
  const getConfig = levelConfigs[level];
  const victim = getRandomVictim(level);
  const config = getConfig(victim.name, victim.age, victim.location);

  try {
    // Call OpenAI's Realtime sessions endpoint to create an ephemeral key
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-realtime",
          voice: config.voice,
          instructions: config.instructions,
          tools: config.tools,
          input_audio_transcription: {
            model: "whisper-1",
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `OpenAI API error (${response.status}):`,
        errorBody
      );
      return res.status(response.status).json({
        error: `OpenAI API error: ${response.status}`,
        details: errorBody,
      });
    }

    const sessionData = await response.json();

    // Return the session data along with victim info for the game UI
    res.json({
      ...sessionData,
      victim: {
        name: victim.name,
        age: victim.age,
        location: victim.location,
        level,
      },
    });
  } catch (error) {
    console.error("Error creating realtime session:", error);
    res.status(500).json({
      error: "Failed to create realtime session.",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Scammer Simulator server running on http://localhost:${PORT}`);
  console.log(`OpenAI API key: ${process.env.OPENAI_API_KEY ? "configured" : "MISSING"}`);
});
