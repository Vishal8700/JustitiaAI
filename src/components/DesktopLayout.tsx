import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface DesktopLayoutProps {
  children?: ReactNode;
}

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      {children}
    </div>
  );
};

export default DesktopLayout;