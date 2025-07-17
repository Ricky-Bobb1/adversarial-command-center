import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockData, postToMockApi, mockApiEndpoints } from "@/utils/mockApi";

interface Node {
  id: string;
  name: string;
  type: string;
  services: string[];
  vulnerabilities: string;
  capabilities: string;
}

interface NodesData {
  nodes: Node[];
}

const Setup = () => {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    services: "",
    vulnerabilities: "",
    capabilities: ""
  });

  const nodeTypes = ["Human", "Software", "Hardware"];

  // Load initial data from mock API
  useEffect(() => {
    const loadNodes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMockData<NodesData>('nodes');
        setNodes(data.nodes);
      } catch (error) {
        toast({
          title: "Failed to Load Data",
          description: "Could not load existing node configurations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNodes();
  }, [toast]);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      services: "",
      vulnerabilities: "",
      capabilities: ""
    });
    setEditingNode(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Node name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.type) {
      toast({
        title: "Validation Error",
        description: "Node type is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const addNode = () => {
    if (!validateForm()) return;

    const newNode: Node = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      services: formData.services ? formData.services.split(',').map(s => s.trim()) : [],
      vulnerabilities: formData.vulnerabilities,
      capabilities: formData.capabilities
    };

    if (editingNode) {
      setNodes(nodes.map(node => node.id === editingNode.id ? { ...newNode, id: editingNode.id } : node));
      toast({
        title: "Node Updated",
        description: `Node "${formData.name}" has been updated successfully`,
      });
    } else {
      setNodes([...nodes, newNode]);
      toast({
        title: "Node Added",
        description: `Node "${formData.name}" has been added successfully`,
      });
    }

    resetForm();
  };

  const editNode = (node: Node) => {
    setFormData({
      name: node.name,
      type: node.type,
      services: node.services.join(', '),
      vulnerabilities: node.vulnerabilities,
      capabilities: node.capabilities
    });
    setEditingNode(node);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    toast({
      title: "Node Removed",
      description: "Node has been removed from configuration",
    });
  };

  const saveConfiguration = async () => {
    if (nodes.length === 0) {
      toast({
        title: "Configuration Error",
        description: "Please add at least one node before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Save to localStorage for use in simulation
      const nodeData = { nodes };
      localStorage.setItem('hospital-nodes', JSON.stringify(nodeData));
      console.log('[DEBUG] Saved nodes to localStorage:', nodeData);
      
      // Also save to mock API for backwards compatibility
      await postToMockApi(mockApiEndpoints.nodes, nodeData);
      
      toast({
        title: "Configuration Saved",
        description: `Successfully saved configuration with ${nodes.length} nodes. These will be used in simulations.`,
      });
    } catch (error) {
      console.warn('[DEBUG] Mock API save failed, but localStorage saved:', error);
      toast({
        title: "Configuration Saved",
        description: `Successfully saved configuration with ${nodes.length} nodes. These will be used in simulations.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setup - Hospital Infrastructure</h1>
        <p className="text-gray-600 mt-2">Model your hospital's infrastructure by defining nodes and their configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingNode ? "Edit Node" : "Add New Node"}
            </CardTitle>
            <CardDescription>
              Define the characteristics and vulnerabilities of hospital infrastructure components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nodeName">Node Name</Label>
              <Input
                id="nodeName"
                placeholder="e.g., Main Server, MRI Machine, Dr. Smith"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nodeType">Node Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  {nodeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services Running</Label>
              <Input
                id="services"
                placeholder="e.g., PACS, EMR, Database (comma-separated)"
                value={formData.services}
                onChange={(e) => setFormData({...formData, services: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vulnerabilities">Known Vulnerabilities</Label>
              <Input
                id="vulnerabilities"
                placeholder="e.g., CVE-2024-1234, CVE-2023-5678"
                value={formData.vulnerabilities}
                onChange={(e) => setFormData({...formData, vulnerabilities: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capabilities">Capabilities / Role</Label>
              <Textarea
                id="capabilities"
                placeholder="Describe the node's role, access levels, and capabilities in the hospital network"
                value={formData.capabilities}
                onChange={(e) => setFormData({...formData, capabilities: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={addNode} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {editingNode ? "Update Node" : "Add Node"}
              </Button>
              {editingNode && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* JSON Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Preview</CardTitle>
            <CardDescription>JSON representation of your hospital infrastructure model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify({ nodes }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nodes Table */}
      {nodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configured Nodes</CardTitle>
            <CardDescription>Overview of all defined hospital infrastructure nodes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Vulnerabilities</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell className="font-medium">{node.name}</TableCell>
                    <TableCell>{node.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {node.services.map((service, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-red-600">{node.vulnerabilities || "None"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editNode(node)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => removeNode(node.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Save Configuration */}
      <div className="flex justify-end">
        <Button 
          onClick={saveConfiguration} 
          size="lg" 
          disabled={nodes.length === 0 || isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
};

export default Setup;
