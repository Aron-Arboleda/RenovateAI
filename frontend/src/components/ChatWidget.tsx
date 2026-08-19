import {useState} from "react";
import type {FormEvent} from "react";
import {sendChatMessage, submitLead} from "../lib/api";
import type {ChatLeadUpdates, LeadPayload} from "../lib/api";

type Message = {role: "user" | "assistant"; content: string};

const EMPTY_LEAD: ChatLeadUpdates = {source: "chatbot"};
const REQUIRED_FIELDS: Array<keyof LeadPayload> = ["name", "email", "phone", "projectType", "budget", "location", "timeline", "description"];

function isComplete(lead: ChatLeadUpdates): lead is LeadPayload {
  return REQUIRED_FIELDS.every((field) => typeof lead[field] === "string" && lead[field].trim());
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{role: "assistant", content: "Hi! I can answer renovation questions or help plan your project. What are you working on?"}]);
  const [lead, setLead] = useState<ChatLeadUpdates>(EMPTY_LEAD);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isSending) return;
    const nextHistory = [...messages, {role: "user" as const, content: message}];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);
    try {
      const response = await sendChatMessage({message, lead, history: nextHistory});
      const nextLead = {...lead, ...response.leadUpdates, source: "chatbot" as const};
      setLead(nextLead);
      setMessages((current) => [...current, {role: "assistant", content: response.reply}]);
      if (!hasSubmittedLead && response.isLeadComplete && isComplete(nextLead)) {
        await submitLead(nextLead);
        setHasSubmittedLead(true);
        setMessages((current) => [...current, {role: "assistant", content: "Your project details are with our team. We’ll be in touch soon."}]);
      }
    } catch (error) {
      setMessages((current) => [...current, {role: "assistant", content: error instanceof Error ? error.message : "Something went wrong. Please try again."}]);
    } finally { setIsSending(false); }
  };

  return (
    <aside className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm">
      {isOpen && <div className="mb-3 overflow-hidden rounded-2xl border border-white/15 bg-stone-900 shadow-2xl"><div className="bg-amber-300 px-4 py-3 text-sm font-bold text-stone-950">RenovateAI Assistant</div><div className="max-h-80 space-y-3 overflow-y-auto p-4">{messages.map((message, index) => <p key={`${message.role}-${index}`} className={`w-fit max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.role === "user" ? "ml-auto bg-amber-300 text-stone-950" : "bg-white/10 text-stone-100"}`}>{message.content}</p>)}</div><form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3"><input value={input} onChange={(event) => setInput(event.target.value)} disabled={isSending} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-stone-400" /><button disabled={isSending} className="rounded-xl bg-amber-300 px-3 text-sm font-semibold text-stone-950">Send</button></form></div>}
      <button type="button" onClick={() => setIsOpen((open) => !open)} className="ml-auto block rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-stone-950 shadow-lg">{isOpen ? "Close chat" : "Ask RenovateAI"}</button>
    </aside>
  );
}
