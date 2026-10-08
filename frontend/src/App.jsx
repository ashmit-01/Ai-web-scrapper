import { useState } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSummarize(event) {
    event.preventDefault();

    setSummary("");
    setError("");

    if (!url.trim()) {
      setError("Please enter a webpage URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSummary(data.summary);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">AI WEB SCRAPER</p>
        <h1>Turn any webpage into a quick summary.</h1>
        <p className="description">
          Paste a public webpage URL and let the backend scrape its text and
          Gemini summarize the important points.
        </p>

        <form onSubmit={handleSummarize} className="form">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/article"
            aria-label="Webpage URL"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Summarize"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {summary && (
          <section className="result">
            <h2>Summary</h2>
            <div className="summary">{summary}</div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
