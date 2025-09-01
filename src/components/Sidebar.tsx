import { Home, Compass, Library, History, Plus, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useChatStore } from "@/store/chatStore";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chats, deleteChat, setCurrentChat } = useChatStore();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: History, label: "History", path: "/history" },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleChatClick = (chatId: string) => {
    setCurrentChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const groupChatsByTime = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as typeof chats,
      yesterday: [] as typeof chats,
      thisWeek: [] as typeof chats,
      older: [] as typeof chats,
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= weekAgo) {
        groups.thisWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const chatGroups = groupChatsByTime();

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">🤖</span>
            </div>
            <span className="font-semibold text-foreground">BeeBot</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-item-hover hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {Object.entries(chatGroups).map(([groupName, groupChats]) => {
          if (groupChats.length === 0) return null;
          
          const groupLabel = {
            today: "Today",
            yesterday: "Yesterday", 
            thisWeek: "This Week",
            older: "Older"
          }[groupName] || groupName;

          return (
            <div key={groupName} className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{groupLabel}</h3>
              <div className="space-y-1">
                {groupChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="group flex items-center justify-between hover:bg-sidebar-item-hover rounded p-2 transition-colors"
                  >
                    <button
                      onClick={() => handleChatClick(chat.id)}
                      className="flex-1 text-left text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                    >
                      {chat.title || "New Chat"}
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Judha Marpaostya</p>
            <p className="text-xs text-muted-foreground truncate">judha.marpa@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;