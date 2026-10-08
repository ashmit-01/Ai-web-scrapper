# AI Web Scraper

A simple full-stack application that accepts a public webpage URL, extracts readable HTML text, and uses Google Gemini to generate a concise summary.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Scraping: Axios + Cheerio
- AI: Google Gemini API using `@google/genai`

## Project Structure

```text
ai-web-scraper/
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## 1. Get a Gemini API key

Create a Gemini API key in Google AI Studio and keep it private.

## 2. Run the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_real_key_here
PORT=5000
```

Start the server:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

## 3. Run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## API

### POST `/api/summarize`

Request:

```json
{
  "url": "https://example.com"
}
```

Response:

```json
{
  "summary": "...",
  "sourceUrl": "https://example.com/"
}
```

## Notes

This scraper intentionally handles basic HTML pages. It does not attempt to bypass bot protection or render JavaScript-heavy applications.

Do not commit `.env` or expose your Gemini API key in the frontend.
