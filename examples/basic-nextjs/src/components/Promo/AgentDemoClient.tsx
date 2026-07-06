"use client";

import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

interface AgentResponse {
  answer: string;
  sourceUrl: string | null;
  usedTwin: string | null;
  confidence: "High" | "Medium" | "Low" | string;
}

const suggestionPool = [
  "Who is this product suitable for?",
  "What are the key benefits?",
  "Summarize this product.",
  "What are the eligibility requirements?",
  "What documents are required?",
  "What is the repayment period?",
  "What are the important facts?",
  "Who should buy this product?",
  "What are the exclusions?",
  "Can you explain this product simply?",
];

export default function AgentDemoClient() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // NEW
  const [useContentTwin, setUseContentTwin] = useState(true);

  const suggestions = [
    "Who is this product suitable for?",
    "What are the key benefits of the home loan plan?",
    "What documents are required for the home loan plan?",
    "Summarize this product.",
  ];

  async function askAgent(customQuestion?: string) {
    const finalQuestion = customQuestion ?? question;

    if (!finalQuestion.trim()) return;

    setQuestion(finalQuestion);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/agent/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: finalQuestion,
          "use-content-twin": useContentTwin,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response.");
      }

      const json = await response.json();

      setResult(json);
    } catch (err: any) {
      setResult({
        answer:
          err.message ??
          "Something went wrong while contacting the AI Agent.",
        sourceUrl: null,
        usedTwin: null,
        confidence: "Low",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer() {
    if (!result) return;

    await navigator.clipboard.writeText(result.answer);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function confidenceStyle(level: string) {
    switch (level.toLowerCase()) {
      case "high":
        return {
          background: "#dcfce7",
          color: "#15803d",
        };

      case "medium":
        return {
          background: "#fef3c7",
          color: "#b45309",
        };

      default:
        return {
          background: "#fee2e2",
          color: "#b91c1c",
        };
    }
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "60px auto",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 800,
            color: "#1f2937",
          }}
        >
          Ask an AI agent a question
        </h2>

        <span
          style={{
            background: "#d9467c",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".5px",
          }}
        >
          AGENT
        </span>
      </div>

      <p
        style={{
          color: "#6b7280",
          marginTop: 0,
          marginBottom: 20,
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        {useContentTwin
          ? "The agent answers using the generated Content Twin."
          : "The agent answers directly from the Sitecore page."}
      </p>

      {/* NEW SEGMENTED TOGGLE */}

      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  }}
>
  <span
    style={{
      fontWeight: 600,
      color: "#374151",
    }}
  >
    Answer Using
  </span>

  <button
    onClick={() => setUseContentTwin((prev) => !prev)}
    style={{
      position: "relative",
      width: 62,
      height: 34,
      borderRadius: 999,
      border: "none",
      background: useContentTwin ? "#d9467c" : "#2563eb",
      cursor: "pointer",
      transition: "background .25s ease",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 3,
        left: useContentTwin ? 31 : 3,
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "#fff",
        transition: "left .25s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,.25)",
      }}
    />
  </button>

  <span
    style={{
      fontWeight: 600,
      color: useContentTwin ? "#d9467c" : "#2563eb",
      minWidth: 120,
    }}
  >
    {useContentTwin ? "Content Twin" : "Original Page"}
  </span>
</div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ececec",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <input
            value={question}
            placeholder="Who is this product suitable for?"
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAgent();
              }
            }}
            style={{
              flex: 1,
              minWidth: 260,
              padding: "18px 20px",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              fontSize: 18,
              outline: "none",
            }}
          />

          <button
            disabled={loading}
            onClick={() => askAgent()}
            style={{
              background: "#d9467c",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0 30px",
              fontSize: 18,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              minHeight: 60,
              boxShadow:
                "0 8px 20px rgba(217,70,124,.25)",
            }}
          >
            Ask →
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => askAgent(suggestion)}
              style={{
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: 999,
                padding: "10px 16px",
                cursor: "pointer",
                color: "#64748b",
                fontSize: 14,
                transition: ".2s",
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <ThreeDots
              visible
              height={80}
              width={80}
              color="#d9467c"
            />

            <h3
              style={{
                margin: 0,
                color: "#374151",
                fontSize: 24,
              }}
            >
              Thinking...
            </h3>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              {useContentTwin
                ? "Searching the Content Twin..."
                : "Reading the original Sitecore page..."}
            </p>
          </div>
        ) : result ? (
          <div
            style={{
              background: "#fff4f8",
              border: "1px solid #ffd6e4",
              borderLeft: "6px solid #d9467c",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 20,
                fontSize: 26,
                lineHeight: 1.6,
                color: "#1f2937",
              }}
            >
              {result.answer}
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 18,
                rowGap: 14,
              }}
            >
              <div>
                <strong>Source:</strong>{" "}
                {result.sourceUrl ? (
                  <a
                    href={result.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    {result.sourceUrl.replace(
                      "http://localhost:3000",
                      ""
                    )}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>

              <div>
                <strong>
                  {useContentTwin ? "Twin Used:" : "Page:"}
                </strong>{" "}
                {result.usedTwin ? (
                  <a
                    href={result.usedTwin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    {result.usedTwin.split("/").pop()}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>

              <span
                style={{
                  ...confidenceStyle(result.confidence),
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {result.confidence} Confidence
              </span>

              <button
                onClick={copyAnswer}
                style={{
                  marginLeft: "auto",
                  background: copied
                    ? "#16a34a"
                    : "#d9467c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {copied
                  ? "✓ Copied!"
                  : "📋 Copy Answer"}
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <div
              style={{
                fontSize: 72,
                marginBottom: 14,
              }}
            >
              🤖
            </div>

            <h2
              style={{
                margin: 0,
                color: "#374151",
              }}
            >
              Ask me anything
            </h2>

            <p
              style={{
                maxWidth: 520,
                lineHeight: 1.7,
              }}
            >
              {useContentTwin
                ? "Ask a question and the AI will answer using the generated Content Twin."
                : "Ask a question and the AI will answer directly from the web page."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}