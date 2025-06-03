
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockData } from "@/utils/mockApi";

interface ScenariosData {
  scenarios: string[];
}

export const useScenarios = () => {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMockData<ScenariosData>('scenarios');
        setScenarios(data.scenarios);
      } catch (error) {
        toast({
          title: "Failed to Load Scenarios",
          description: "Could not load available scenarios",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadScenarios();
  }, [toast]);

  return { scenarios, isLoading };
};
