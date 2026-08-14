"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import PoemCard from "./components/PoemCard";

type PoemData = {
  title: string;
  lines: string[];
  colors: string[];
  motif: string;
};

const EXAMPLES_JA = ["雨上がりの朝", "遠くの祭りの音", "初めての一人暮らし", "夏の終わり"];
const EXAMPLES_EN = ["a rainy morning", "distant festival sounds", "first night alone", "end of summer"];

export default function Home() {
  const [theme, setTheme] = useState("");
  const [lang, setLang] = useState<"ja" | "en">("ja");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [poem, setPoem] = useState<PoemData | null>(null);

  const examples = lang === "ja" ? EXAMPLES_JA : EXAMPLES_EN;

  async function generate(t?: string) {
    const value = (t ?? theme).trim();
    if (!value) return;
    setLoading(true);
    setError("");
    setPoem(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: value, lang }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setPoem(data);
    } catch {
      setError(lang === "ja" ? "生成に失敗した。もう一度試すこと。" : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    const el = document.getElementById("poem-card-svg");
    if (!el) return;
    const dataUrl = await toPng(el, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `mood-poem-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 16px",
        gap: 24,
        background: "#0f0f14",
        color: "#eee",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center" }}>Mood Poem Card</h1>
        <p style={{ textAlign: "center", opacity: 0.7, fontSize: 14 }}>
          {lang === "ja"
            ? "今の気分やお題をひとことで。AIが詩と、その世界観のカードを作る。"
            : "Type a mood or theme. AI writes a poem and designs a card around it."}
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={() => setLang("ja")}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: "1px solid #444",
              background: lang === "ja" ? "#fff" : "transparent",
              color: lang === "ja" ? "#000" : "#eee",
            }}
          >
            日本語
          </button>
          <button
            onClick={() => setLang("en")}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: "1px solid #444",
              background: lang === "en" ? "#fff" : "transparent",
              color: lang === "en" ? "#000" : "#eee",
            }}
          >
            English
          </button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={lang === "ja" ? "例: 雨上がりの朝" : "e.g. a rainy morning"}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #444",
              background: "#1a1a22",
              color: "#eee",
            }}
          />
          <button
            onClick={() => generate()}
            disabled={loading || !theme.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#fff",
              color: "#000",
              fontWeight: 600,
              opacity: loading || !theme.trim() ? 0.5 : 1,
            }}
          >
            {loading ? "..." : lang === "ja" ? "生成" : "Generate"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setTheme(ex);
                generate(ex);
              }}
              style={{
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid #333",
                opacity: 0.7,
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        {error && <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>}
      </div>

      {poem && (
        <div style={{ maxWidth: 400, width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div id="poem-card-svg">
            <PoemCard data={poem} id="poem-card-svg-inner" />
          </div>
          <button
            onClick={download}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #444",
              alignSelf: "center",
            }}
          >
            {lang === "ja" ? "画像を保存" : "Download PNG"}
          </button>
        </div>
      )}
    </main>
  );
}
