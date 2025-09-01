import beeAvatar from "@/assets/bee-avatar.png";

const ChatHeader = () => {
  return (
    <div className="flex items-center gap-3 p-4 bg-card border-b border-border">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
        <img src={beeAvatar} alt="BeeBot" className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <h2 className="font-semibold text-foreground text-lg">BeeBot</h2>
        <p className="text-sm text-muted-foreground">AI Assistant</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-muted-foreground">Online</span>
      </div>
    </div>
  );
};

export default ChatHeader;