import { useState } from "react";
import { CalculatorForm, type CalculatorInputs } from "@/components/CalculatorForm";
import { ResultsDisplay, type ROIResults } from "@/components/ResultsDisplay";
import { ScenarioManager } from "@/components/ScenarioManager";
import { ReportGenerator } from "@/components/ReportGenerator";
import { Calculator } from "lucide-react";

// Internal constants (server-side logic, but for this demo we'll calculate client-side)
const AUTOMATED_COST_PER_INVOICE = 0.20;
const ERROR_RATE_AUTO = 0.1;
const TIME_SAVED_PER_INVOICE = 8;
const MIN_ROI_BOOST_FACTOR = 1.1;

const Index = () => {
  const [results, setResults] = useState<ROIResults | null>(null);
  const [currentInputs, setCurrentInputs] = useState<CalculatorInputs | null>(null);

  const calculateROI = (inputs: CalculatorInputs) => {
    setCurrentInputs(inputs);

    // Calculate labor cost manual
    const labor_cost_manual = 
      inputs.num_ap_staff * 
      inputs.hourly_wage * 
      inputs.avg_hours_per_invoice * 
      inputs.monthly_invoice_volume;

    // Calculate automation cost
    const auto_cost = inputs.monthly_invoice_volume * AUTOMATED_COST_PER_INVOICE;

    // Calculate error savings (convert percentages to decimals)
    const error_savings = 
      ((inputs.error_rate_manual / 100) - (ERROR_RATE_AUTO / 100)) * 
      inputs.monthly_invoice_volume * 
      inputs.error_cost;

    // Calculate monthly savings
    let monthly_savings = (labor_cost_manual + error_savings) - auto_cost;

    // Apply bias factor
    monthly_savings = monthly_savings * MIN_ROI_BOOST_FACTOR;

    // Calculate cumulative and ROI
    const cumulative_savings = monthly_savings * inputs.time_horizon_months;
    const net_savings = cumulative_savings - inputs.one_time_implementation_cost;
    const payback_months = inputs.one_time_implementation_cost / monthly_savings;
    const roi_percentage = (net_savings / inputs.one_time_implementation_cost) * 100;

    const calculatedResults: ROIResults = {
      monthly_savings,
      cumulative_savings,
      net_savings,
      payback_months,
      roi_percentage,
      labor_cost_manual,
      auto_cost,
      error_savings,
    };

    setResults(calculatedResults);
  };

  const handleLoadScenario = (inputs: CalculatorInputs, scenarioResults: ROIResults) => {
    setCurrentInputs(inputs);
    setResults(scenarioResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Calculator className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Invoicing ROI Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how much you can save by automating your invoice processing.
            Calculate your ROI in seconds.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <CalculatorForm onCalculate={calculateROI} defaultValues={currentInputs || undefined} />

          {results && (
            <>
              <ResultsDisplay results={results} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScenarioManager
                  currentInputs={currentInputs}
                  currentResults={results}
                  onLoadScenario={handleLoadScenario}
                />
                <ReportGenerator inputs={currentInputs} results={results} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
          <p className="text-sm">
            © {new Date().getFullYear()} Invoicing ROI Simulator. All calculations are estimates based on industry standards.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;