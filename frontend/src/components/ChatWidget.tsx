import {useState, useRef, useEffect} from "react";
import type {FormEvent, KeyboardEvent} from "react";
import {sendChatMessage, submitLead} from "../lib/api";
import type {ChatLeadUpdates, LeadPayload} from "../lib/api";

type Message = {role: "user" | "assistant"; content: string};
type ChatState = "faq" | "guided-intake" | "review" | "complete";

const EMPTY_LEAD: ChatLeadUpdates = {source: "chatbot"};
const REQUIRED_FIELDS: Array<keyof LeadPayload> = [
  "name",
  "email",
  "phone",
  "projectType",
  "budget",
  "location",
  "timeline",
  "description",
];

const FAQ_PROMPTS = [
  "What types of projects do you handle?",
  "How long does a typical kitchen renovation take?",
  "What is the average cost of a bathroom remodel?",
  "Do you provide free consultations?",
];

function isComplete(lead: ChatLeadUpdates): lead is LeadPayload {
  return REQUIRED_FIELDS.every(
    (field) => typeof lead[field] === "string" && lead[field].trim(),
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can answer renovation questions or help plan your project. What are you working on?",
    },
  ]);
  const [lead, setLead] = useState<ChatLeadUpdates>(EMPTY_LEAD);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatState, setChatState] = useState<ChatState>("faq");
  const [error, setError] = useState<string | null>(null);
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 5 * 24;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const handleSend = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isSending) return;

    setError(null);
    const nextHistory = [
      ...messages,
      {role: "user" as const, content: message},
    ];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        message,
        lead,
        history: nextHistory,
      });
      const nextLead = {
        ...lead,
        ...response.leadUpdates,
        source: "chatbot" as const,
      };
      setLead(nextLead);

      if (response.nextAction) {
        setChatState(response.nextAction);
      }

      setMessages((current) => [
        ...current,
        {role: "assistant", content: response.reply},
      ]);

      if (
        chatState === "review" &&
        response.isLeadComplete &&
        isComplete(nextLead) &&
        !hasSubmittedLead
      ) {
        await submitLead(nextLead);
        setHasSubmittedLead(true);
        setChatState("complete");
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content:
              "Your project details are with our team. We'll be in touch soon.",
          },
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !isSending) {
        const form = event.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const retryLastMessage = async (): Promise<void> => {
    if (messages.length < 2 || isSending) return;
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMessage) return;

    setError(null);
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        message: lastUserMessage.content,
        lead,
        history: messages,
      });
      const nextLead = {
        ...lead,
        ...response.leadUpdates,
        source: "chatbot" as const,
      };
      setLead(nextLead);

      if (response.nextAction) {
        setChatState(response.nextAction);
      }

      setMessages((current) => [
        ...current,
        {role: "assistant", content: response.reply},
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const sendFaqPrompt = (prompt: string): void => {
    if (isSending) return;
    setInput(prompt);
    setTimeout(() => {
      if (textareaRef.current?.form) {
        textareaRef.current.form.requestSubmit();
      }
    }, 0);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm">
      {isOpen && (
        <div
          className="mb-3 flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-stone-900 shadow-2xl"
          style={{maxHeight: "calc(100vh - 140px)"}}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-amber-300 px-4 py-3">
            <span className="text-sm font-bold text-stone-950">
              RenovateAI Assistant
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-stone-950 transition hover:bg-stone-950/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
              aria-label="Close chat"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === "user"
                      ? "bg-amber-300 text-stone-950"
                      : "bg-white/10 text-stone-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <div className="flex gap-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-stone-400"
                      style={{animationDelay: "0ms"}}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-stone-400"
                      style={{animationDelay: "150ms"}}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-stone-400"
                      style={{animationDelay: "300ms"}}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-300/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-300">{error}</p>
                <button
                  type="button"
                  onClick={retryLastMessage}
                  disabled={isSending}
                  className="mt-2 text-sm font-semibold text-red-300 underline hover:text-red-200 disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
            )}

            {messages.length === 1 && !isSending && (
              <div className="space-y-2">
                <p className="text-xs text-stone-400">Quick questions:</p>
                {FAQ_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => sendFaqPrompt(prompt)}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-stone-300 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {chatState === "review" && !hasSubmittedLead && (
              <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-4">
                <p className="text-sm font-semibold text-amber-300">
                  Review Your Details
                </p>
                <p className="mt-2 text-xs text-stone-400">
                  Please confirm your information is correct before submitting.
                  Type "confirm" or "looks good" to proceed.
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending || chatState === "complete"}
                placeholder={
                  chatState === "complete"
                    ? "Chat ended"
                    : "Type your message..."
                }
                rows={1}
                className="min-h-[40px] max-h-[120px] min-w-0 flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-stone-400 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={
                  isSending || !input.trim() || chatState === "complete"
                }
                className="rounded-xl bg-amber-300 px-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto block rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-stone-950 shadow-lg transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "Close Chat" : "Ask RenovateAI"}
      </button>
    </aside>
  );
}
