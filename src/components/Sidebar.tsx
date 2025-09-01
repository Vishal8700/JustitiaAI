
import { Home, Compass, Library, History, Plus, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useChatStore } from "@/store/chatStore";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface GoogleUser {
  name: string;
  picture: string;
  email: string;
  sub: string;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chats, deleteChat, setCurrentChat, setUser, user } = useChatStore(); // Use store for user

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: History, label: "History", path: "/history" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleChatClick = (chatId) => {
    setCurrentChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = (e, chatId) => {
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

    chats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt);
      if (chatDate >= today) groups.today.push(chat);
      else if (chatDate >= yesterday) groups.yesterday.push(chat);
      else if (chatDate >= weekAgo) groups.thisWeek.push(chat);
      else groups.older.push(chat);
    });

    return groups;
  };

  const chatGroups = groupChatsByTime();

  // Sync local user state with store
  useEffect(() => {
    const storedUser = useChatStore.getState().user;
    if (storedUser && !user) {
      setUser(storedUser); // Ensure user is set if stored but not in state
    }
  }, [user, setUser]);

  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential!);
      const newUser = {
        name: decoded.name,
        picture: decoded.picture,
        email: decoded.email,
        sub: decoded.sub,
      };
      setUser(newUser); // Update store
      // Redirect to current route or default to home
      const redirectPath = location.pathname === "/" ? "/" : location.pathname;
      navigate(redirectPath || "/");
      console.log("Login successful:", newUser);
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  const handleLogout = () => {
    setUser(null); // Clear store
    navigate("/"); // Redirect to home on logout
    console.log("Logged out");
  };

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center ">
            {/* Replace SVG with Lottie animation */}
            <DotLottieReact
              src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
              loop
              autoplay
              className="w-6 h-6"
            />
          </div>
          <span className="font-bold text-lg text-foreground">Justitia.ai</span>
        </div>

        {/* Theme Toggle */}
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
            older: "Older",
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
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={user.picture}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-foreground">{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10"
            >
              Logout
            </Button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              alert("Google Sign-In failed");
            }}
            useOneTap
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;