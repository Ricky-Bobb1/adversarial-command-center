
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Logo and branding */}
        <div className="inline-flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-3xl">A³</span>
          </div>
          <div className="text-left">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent mb-2">
              Adversarial Agentic AI System
            </h1>
            <div className="h-1 w-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Welcome to the next generation of AI security testing. Our advanced platform enables researchers and organizations 
          to simulate complex adversarial scenarios, analyze AI agent behaviors under attack conditions, and develop robust 
          defenses against emerging threats. Test the limits of artificial intelligence in a controlled, secure environment.
        </p>

        {/* Call to action */}
        <div className="space-y-6">
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-12 py-4 text-lg rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
            >
              Enter the Simulation Console
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          {/* Secondary info */}
          <p className="text-gray-400 text-sm">
            Secure • Advanced • Research-Grade Platform
          </p>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
      </div>
    </div>
  );
};

export default Index;
