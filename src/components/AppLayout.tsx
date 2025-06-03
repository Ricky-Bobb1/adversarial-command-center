
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A³</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Adversarial Agentic AI System</h1>
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </>
  );
};

export default AppLayout;
