import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  picture: string;
  email?: string; // Optional fields from Google OAuth
  sub?: string;   // Subject (unique ID from Google)
}

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  user: User | null;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  setCurrentChat: (id: string | null) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  getCurrentChat: () => Chat | null; // Updated to match Chat.tsx usage
  setUser: (user: User | null) => void; // Method to set user
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      user: null,

      addChat: (chat) => {
        console.log("Adding chat:", chat);
        set((state) => {
          const updatedChats = [chat, ...state.chats];
          return {
            chats: updatedChats,
            currentChatId: state.currentChatId || chat.id, // Set only if not already set
          };
        });
      },

      updateChat: (id, updates) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, ...updates, updatedAt: new Date().toISOString() } : chat
          ),
        })),

      deleteChat: (id) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          currentChatId: state.currentChatId === id ? null : state.currentChatId,
        })),

      setCurrentChat: (id) => set({ currentChatId: id }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  updatedAt: new Date().toISOString(),
                  title:
                    chat.messages.length === 0
                      ? message.text.includes("📄 Uploaded content")
                        ? `Analysis: ${message.text.split(": ")[1]?.split("\n")[0] || "Document"}`
                        : message.text.slice(0, 50) + "..."
                      : chat.title,
                }
              : chat
          ),
        })),

      getCurrentChat: () => {
        const state = get();
        return state.chats.find((chat) => chat.id === state.currentChatId) || null;
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'chat-storage', // Persists both chats and user
    }
  )
);