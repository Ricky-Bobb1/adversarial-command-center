import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Mail, Lock, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGuestLogin = () => {
    // Set guest user in localStorage for now
    localStorage.setItem("user", JSON.stringify({ type: "guest", name: "Guest User" }));
    navigate("/dashboard");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic later
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient Background */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-md w-full relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">A³</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                Adversa Agentic AI
              </h1>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              Access the AI Security Testing Platform
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-white text-2xl font-semibold">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              {/* Guest Access */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGuestLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group h-12"
                >
                  <User className="mr-3 h-5 w-5" />
                  Continue as Guest
                  <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Quick access to all simulation features
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-purple-900 px-3 text-gray-400 font-medium">Or sign in with account</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl h-12"
                      placeholder="Enter your email"
                      autoComplete="email"
                      tabIndex={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl h-12"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      tabIndex={2}
                    />
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="submit"
                        disabled
                        className="w-full bg-gray-600/50 hover:bg-gray-600/50 text-gray-400 cursor-not-allowed py-4 rounded-xl h-12 opacity-50 flex items-center justify-center gap-2"
                        tabIndex={3}
                      >
                        Sign In (Coming Soon)
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This feature is under development</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>

              <div className="text-center pt-2">
                <Link 
                  to="/"
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors font-medium"
                  tabIndex={4}
                >
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Light background for future content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A³</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Adversa
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Advanced AI security testing platform designed to evaluate and strengthen your AI systems against potential threats.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;