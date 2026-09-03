import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }
    const isItineraryRequest =
        message.toLowerCase().includes("itinerary") ||
        message.toLowerCase().includes("plan a trip") ||
        message.toLowerCase().includes("trip plan") ||
        message.toLowerCase().includes("plan my trip");

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
    try {
        response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
          contents: `
            You are WANDER, a friendly and helpful AI travel assistant.

            Your job is to help users plan trips and discover destinations.

            Give practical, clear, and concise travel advice.

            You can help with:
            - Destination recommendations
            - Places to visit
            - Things to do
            - Trip itineraries
            - Food recommendations
            - Travel tips
            - Budget-friendly suggestions
            - Best time to visit
            - Packing suggestions

            If the user asks for an itinerary or asks you to plan a trip,
            return ONLY valid JSON in exactly this format:

            {
            "type": "itinerary",
            "destination": "Bali",
            "days": [
                {
                "day": 1,
                "title": "Explore Ubud",
                "morning": "Visit Tegallalang Rice Terraces",
                "afternoon": "Explore Ubud Market and have lunch",
                "evening": "Walk along Campuhan Ridge"
                }
            ]
            }

            Create one object inside "days" for each day requested by the user.

            If the user does NOT ask for an itinerary,
            return normal helpful text.

            If the user asks something unrelated to travel,
            politely bring the conversation back to travel.

            User's question:
            ${message}
            `,
        });

        break;
    } catch (error) {
        console.log(`Gemini attempt ${attempt} failed`);

        if (error.status !== 503 || attempt === 3) {
        throw error;
        }

        await new Promise((resolve) =>
        setTimeout(resolve, attempt * 5000)
        );
    }
    }

    if (isItineraryRequest) {
        try {
            const itinerary = JSON.parse(response.text);

            return res.json({
            itinerary,
            });
        } catch (error) {
            console.error("Invalid itinerary JSON:", response.text);

            return res.status(500).json({
            error: "Unable to create itinerary",
            });
        }
        }

        res.json({
        reply: response.text,
        });
  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      error: "Failed to get response from Gemini",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});