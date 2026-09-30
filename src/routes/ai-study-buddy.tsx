import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { askEdSyncAI } from "@/lib/ai";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/ai-study-buddy")({
  head: () => ({
    meta: [
      { title: "AI Study Buddy — EdSync" },
      {
        name: "description",
        content:
          "EdSync's AI Study Buddy explains concepts, summarizes lessons and helps students practise.",
      },
      { property: "og:title", content: "AI Study Buddy — EdSync" },
      {
        property: "og:description",
        content:
          "Contextual study help powered by EdSync's secure AI Study Buddy.",
      },
    ],
  }),
  component: AIStudyBuddy,
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

function AIStudyBuddy() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) return;

    setInput("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const result = await askEdSyncAI({
        data: {
          message: userMessage,
          context:
            "Student is using EdSync AI Study Buddy. Provide clear, student-friendly academic help.",
        },
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      console.error("AI Study Buddy request failed:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I couldn't connect to EdSync AI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="AI Study Buddy"
      description="Ask questions, simplify concepts and practise with AI"
    >
      <div className="mx-auto max-w-4xl">
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-semibold">EdSync AI Study Buddy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask about a concept, lesson, chapter or study problem.
            </p>
          </div>

          <div className="min-h-[420px] space-y-4 p-5">
            {messages.length === 0 ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    ✦
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    How can I help you study?
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Try asking something like:
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        setInput(
                          "Explain photosynthesis in simple language.",
                        )
                      }
                      className="w-full rounded-lg border border-border px-4 py-3 text-left transition hover:bg-muted"
                    >
                      Explain photosynthesis in simple language.
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setInput(
                          "Give me five practice questions on cell biology.",
                        )
                      }
                      className="w-full rounded-lg border border-border px-4 py-3 text-left transition hover:bg-muted"
                    >
                      Give me five practice questions on cell biology.
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setInput(
                          "Summarize the important points of the fluid mosaic model.",
                        )
                      }
                      className="w-full rounded-lg border border-border px-4 py-3 text-left transition hover:bg-muted"
                    >
                      Summarize the fluid mosaic model.
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {message.role === "assistant" ? (
  <Markdown
    remarkPlugins={[remarkGfm]}
    components={{
      strong: ({ children }) => (
        <strong className="font-bold">{children}</strong>
      ),
      p: ({ children }) => (
        <p className="mb-3 last:mb-0">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
      ),
      li: ({ children }) => <li>{children}</li>,
      h1: ({ children }) => (
        <h1 className="mb-3 text-xl font-bold">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-2 text-lg font-bold">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-2 text-base font-bold">{children}</h3>
      ),
      table: ({ children }) => (
        <div className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-border px-3 py-2 align-top">
          {children}
        </td>
      ),
      code: ({ children }) => (
        <code className="rounded bg-background px-1.5 py-0.5 text-xs">
          {children}
        </code>
      ),
    }}
  >
    {message.content}
  </Markdown>
) : (
  message.content
)}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  EdSync AI is thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border p-4"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask EdSync AI anything about your studies..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Ask"}
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              AI-generated answers may contain mistakes. Verify important
              academic information with your study material.
            </p>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
useEffect(() => {
  function handleAskAI(
    event: Event,
  ) {
    const customEvent =
      event as CustomEvent<{
        text: string;
      }>;

    const text =
      customEvent.detail?.text;

    if (!text) return;

    setMessage(
      `Explain this selected text:\n\n${text}`,
    );
  }

  window.addEventListener(
    "edsync:ask-ai",
    handleAskAI,
  );

  return () => {
    window.removeEventListener(
      "edsync:ask-ai",
      handleAskAI,
    );
  };
}, []);