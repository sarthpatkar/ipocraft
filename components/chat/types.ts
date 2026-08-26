export type MessageRole = "user" | "assistant";

export interface ChartBar {
  key: string;
  label: string;
  color: string;
}

export interface ChartSpec {
  type: "bar";
  title: string;
  xKey: string;
  bars: ChartBar[];
  data: Record<string, unknown>[];
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface PromptSuggestion {
  title: string;
  description: string;
  query: string;
  badge?: string;
  category?: "gmp" | "subscription" | "allotment" | "compare" | "timeline";
}

export interface ResearchPreset {
  id: string;
  label: string;
  query: string;
  badge?: string;
}
