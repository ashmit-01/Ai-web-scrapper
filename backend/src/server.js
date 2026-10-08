import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function extractText(html) {
  const $ = cheerio.load(html);

  $("script, style, noscript, nav, footer, header").remove();

  const text = $("body").text();

  return text.replace(/\s+/g, " ").trim();
}

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/summarize", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ message: "Please provide a valid URL" });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({ message: "Only HTTP and HTTPS URLs are supported" });
    }

    const response = await axios.get(parsedUrl.toString(), {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-Web-Scraper/1.0)"
      }
    });

    const text = extractText(response.data);

    if (!text) {
      return res.status(422).json({ message: "Could not extract readable text from this page" });
    }

    const content = text.slice(0, 50000);

    const prompt = `Summarize the following webpage content in 5 concise bullet points. Focus only on the important information. Do not mention that you are an AI.\n\nWEBPAGE CONTENT:\n${content}`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    return res.json({
      summary: result.text,
      sourceUrl: parsedUrl.toString()
    });
  } catch (error) {
    console.error("Summarization error:", error.message);

    return res.status(500).json({
      message: "Failed to scrape or summarize the webpage"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
