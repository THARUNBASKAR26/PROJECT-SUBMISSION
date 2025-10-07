import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, FolderOpen, Trash2 } from "lucide-react";
import type { CalculatorInputs } from "./CalculatorForm";
import type { ROIResults } from "./ResultsDisplay";

interface ScenarioManagerProps {
  currentInputs: CalculatorInputs | null;
  currentResults: ROIResults | null;
  onLoadScenario: (inputs: CalculatorInputs, results: ROIResults) => void;
}

interface SavedScenario {
  id: string;
  scenario_name: string;
  created_at: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost: number;
  results: ROIResults;
}

export const ScenarioManager = ({ currentInputs, currentResults, onLoadScenario }: ScenarioManagerProps) => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [showScenarios, setShowScenarios] = useState(false);

  const saveScenario = async () => {
    if (!currentInputs || !currentResults) {
      toast.error("Please calculate ROI first");
      return;
    }

    try {
      const { error } = await supabase.from("scenarios").insert([
        {
          scenario_name: currentInputs.scenario_name,
          monthly_invoice_volume: currentInputs.monthly_invoice_volume,
          num_ap_staff: currentInputs.num_ap_staff,
          avg_hours_per_invoice: currentInputs.avg_hours_per_invoice,
          hourly_wage: currentInputs.hourly_wage,
          error_rate_manual: currentInputs.error_rate_manual,
          error_cost: currentInputs.error_cost,
          time_horizon_months: currentInputs.time_horizon_months,
          one_time_implementation_cost: currentInputs.one_time_implementation_cost,
          results: currentResults as any,
        },
      ]);

      if (error) throw error;

      toast.success("Scenario saved successfully!");
      loadScenarios();
    } catch (error: any) {
      toast.error("Failed to save scenario: " + error.message);
    }
  };

  const loadScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setScenarios(data.map(d => ({
        ...d,
        results: d.results as unknown as ROIResults
      })));
      setShowScenarios(true);
    } catch (error: any) {
      toast.error("Failed to load scenarios: " + error.message);
    }
  };

  const deleteScenario = async (id: string) => {
    try {
      const { error } = await supabase.from("scenarios").delete().eq("id", id);

      if (error) throw error;

      toast.success("Scenario deleted");
      loadScenarios();
    } catch (error: any) {
      toast.error("Failed to delete scenario: " + error.message);
    }
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    const inputs: CalculatorInputs = {
      scenario_name: scenario.scenario_name,
      monthly_invoice_volume: scenario.monthly_invoice_volume,
      num_ap_staff: scenario.num_ap_staff,
      avg_hours_per_invoice: scenario.avg_hours_per_invoice,
      hourly_wage: scenario.hourly_wage,
      error_rate_manual: scenario.error_rate_manual,
      error_cost: scenario.error_cost,
      time_horizon_months: scenario.time_horizon_months,
      one_time_implementation_cost: scenario.one_time_implementation_cost,
    };
    onLoadScenario(inputs, scenario.results);
    setShowScenarios(false);
  };

  return (
    <Card className="p-6">
      <div className="flex gap-3">
        <Button onClick={saveScenario} variant="outline" className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Save Scenario
        </Button>
        <Button onClick={loadScenarios} variant="outline" className="flex-1">
          <FolderOpen className="mr-2 h-4 w-4" />
          Load Scenario
        </Button>
      </div>

      {showScenarios && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-foreground">Saved Scenarios</h3>
          {scenarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved scenarios yet</p>
          ) : (
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{scenario.scenario_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(scenario.created_at).toLocaleDateString()} - {scenario.monthly_invoice_volume} invoices/mo
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadScenario(scenario)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteScenario(scenario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};