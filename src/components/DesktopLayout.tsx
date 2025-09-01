import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";

const DesktopLayout = () => {
  const [chatCount, setChatCount] = useState(0);

  const handleNewChat = () => {
    setChatCount(prev => prev + 1);
    // Here you would typically navigate to a new chat or reset the current chat
    console.log("Starting new chat...");
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      <MainContent onNewChat={handleNewChat} />
    </div>
  );
};

export default DesktopLayout;