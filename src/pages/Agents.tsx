
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Play, Pause } from "lucide-react";

const Agents = () => {
  const agents = [
    { id: 1, name: "Defender-Alpha", type: "Defensive", status: "Active", lastActive: "2 min ago" },
    { id: 2, name: "Attacker-Beta", type: "Adversarial", status: "Active", lastActive: "5 min ago" },
    { id: 3, name: "Monitor-Gamma", type: "Observer", status: "Standby", lastActive: "1 hour ago" },
    { id: 4, name: "Analyzer-Delta", type: "Analytical", status: "Active", lastActive: "30 sec ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-600 mt-2">Manage your AI agents and their configurations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge 
                  variant={agent.status === "Active" ? "default" : "secondary"}
                  className={agent.status === "Active" ? "bg-green-100 text-green-800" : ""}
                >
                  {agent.status}
                </Badge>
              </div>
              <CardDescription>{agent.type} Agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-500">
                Last active: {agent.lastActive}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Pause className="h-3 w-3 mr-1" />
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Agent Statistics
          </CardTitle>
          <CardDescription>Overview of agent performance and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-500">Total Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-500">Standby</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agents;
