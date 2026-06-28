"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ThreeDots } from "react-loader-spinner";

const ReactJson = dynamic(
  () =>
    import("@microlink/react-json-view").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThreeDots
          visible
          height={60}
          width={60}
          color="#2ba394"
        />
      </div>
    ),
  }
);

const pageOptions = [
  {
    value: "/products/home-loan",
    label: "🏠 Home Loan for First-Time Buyers",
  },
  {
    value: "/products/life-insurance",
    label: "❤️ Life Insurance",
  },
  {
    value: "/products/ev-service-plan",
    label: "⚡ EV Service Plan",
  },
];

export default function ContentTwinClient() {
  const [selectedPage, setSelectedPage] = useState(
    pageOptions[0].value
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  async function copyJson() {
    if (!result) return;

    await navigator.clipboard.writeText(
      JSON.stringify(result, null, 2)
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function generateContentTwin() {
    setLoading(true);
    setResult(null);

    try {
    //   const response = await fetch(
    //     "http://localhost:3000/api/content-twin/generate",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "x-content-twin-admin-key":
    //           "ahkdslkjfpokpokfyiy",
    //       },
    //       body: JSON.stringify({
    //         path: selectedPage,
    //         forceRegenerate: true,
    //       }),
    //     }
    //   );

      
      // Environment variable version

    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_CONTENT_TWIN_BASE_URL}/api/content-twin/generate`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "x-content-twin-admin-key":
    //           process.env.NEXT_PUBLIC_CONTENT_TWIN_ADMIN_KEY!,
    //       },
    //       body: JSON.stringify({
    //         path: selectedPage,
    //         forceRegenerate: true,
    //       }),
    //     }
    //   );

    //api route version

    const response = await fetch("/api/content-twin/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-content-twin-admin-key":
      process.env.NEXT_PUBLIC_CONTENT_TWIN_ADMIN_KEY!,
  },
  body: JSON.stringify({
    path: selectedPage,
    forceRegenerate: true,
  }),
});

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      setResult(json);
    } catch (err: any) {
      setResult({
        error: err.message ?? "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 1050,
        margin: "48px auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        fontFamily:
          'Inter, Arial, Helvetica, sans-serif',
      }}
    >
      {/* Controls */}

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          padding: 28,
          boxShadow:
            "0 4px 12px rgba(0,0,0,.06)",
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: 8,
            color: "#6b7280",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Select Sitecore Page
        </h3>

        <p
          style={{
            marginTop: 0,
            marginBottom: 18,
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          Choose a page to generate its normalized
          Content Twin.
        </p>

        <div
          style={{
            position: "relative",
            marginBottom: 20,
          }}
        >
          <select
            value={selectedPage}
            disabled={loading}
            onChange={(e) =>
              setSelectedPage(e.target.value)
            }
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",

              width: "100%",
              padding: "16px 52px 16px 18px",

              borderRadius: 10,
              border: "2px solid #d7dde5",

              background: "#fff",

              fontSize: 16,
              fontWeight: 600,

              cursor: "pointer",

              outline: "none",

              transition: ".2s",
            }}
          >
            {pageOptions.map((page) => (
              <option
                key={page.value}
                value={page.value}
              >
                {page.label}
              </option>
            ))}
          </select>

          <div
            style={{
              position: "absolute",
              right: 18,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#666",
              fontSize: 18,
            }}
          >
            ▼
          </div>
        </div>

        <button
          onClick={generateContentTwin}
          disabled={loading}
          style={{
            width: "100%",
            padding: 18,
            border: "none",
            borderRadius: 10,
            background: "#2ba394",
            color: "white",
            fontSize: 18,
            fontWeight: 700,
            cursor: loading
              ? "not-allowed"
              : "pointer",
            transition: ".2s",
            boxShadow: loading
              ? "none"
              : "0 8px 24px rgba(43,163,148,.30)",
          }}
        >
          Generate Content Twin
        </button>
      </div>

      {/* Result */}

      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          background: "#1e1e1e",
          border: "1px solid #2d2d2d",
          boxShadow:
            "0 8px 24px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            background: "#252526",
            padding: "16px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #3c3c3c",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#d4d4d4",
              fontFamily:
                '"JetBrains Mono", Consolas, monospace',
            }}
          >
            📄 content-twin.json
          </h3>

          {result && (
            <button
              onClick={copyJson}
              style={{
                background: copied
                  ? "#16a34a"
                  : "#007acc",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
          )}
        </div>

        <div
          style={{
            minHeight: 500,
            maxHeight: 700,
            overflow: "auto",
            padding: 24,
          }}
        >
                      {loading ? (
            <div
              style={{
                minHeight: 450,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              <ThreeDots
                visible
                height={90}
                width={90}
                color="#2ba394"
                ariaLabel="Generating"
              />

              <h2
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: 28,
                  fontWeight: 600,
                }}
              >
                Generating Content Twin
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#9ca3af",
                  textAlign: "center",
                  maxWidth: 450,
                  lineHeight: 1.7,
                }}
              >
                Reading the Sitecore page, extracting metadata
                and generating the Content Twin...
              </p>
            </div>
          ) : result ? (
            <ReactJson
              src={result}
              theme="monokai"
              name={false}
              collapsed={1}
              collapseStringsAfterLength={80}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={false}
              quotesOnKeys={false}
              indentWidth={2}
              iconStyle="triangle"
              style={{
                background: "#1e1e1e",
                padding: "8px",
                fontSize: "15px",
                fontFamily:
                  '"JetBrains Mono", "Fira Code", Consolas, monospace',
                lineHeight: "1.7",
              }}
            />
          ) : (
            <div
              style={{
                minHeight: 450,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 16,
                color: "#9ca3af",
              }}
            >
              <div
                style={{
                  fontSize: 72,
                }}
              >
                📄
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                No Content Twin Generated
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                }}
              >
                Select a page above and click
                <strong> Generate Content Twin</strong>.
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            height: 34,
            background: "#007acc",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 14px",
            fontSize: 13,
            fontFamily:
              '"JetBrains Mono", Consolas, monospace',
          }}
        >
          <span>content-twin.json</span>

          <span>
            {loading
              ? "Generating..."
              : result
              ? "✓ Generated"
              : "Ready"}
          </span>
        </div>
      </div>
    </div>
  );
}