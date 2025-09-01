import ChatWindow from "@/components/ChatWindow";

const Index = () => {
  return (
    <div className="min-h-screen bg-chat-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Index;
