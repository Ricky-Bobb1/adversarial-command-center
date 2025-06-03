
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A³</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Adversarial Agentic AI System
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced simulation platform for testing and analyzing adversarial AI agent interactions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Simulate</CardTitle>
              <CardDescription>Run complex adversarial scenarios</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-purple-600">Analyze</CardTitle>
              <CardDescription>Deep insights into agent behavior</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600">Optimize</CardTitle>
              <CardDescription>Improve AI safety and robustness</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Enter Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
