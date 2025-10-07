import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

export interface ROIResults {
  monthly_savings: number;
  cumulative_savings: number;
  net_savings: number;
  payback_months: number;
  roi_percentage: number;
  labor_cost_manual: number;
  auto_cost: number;
  error_savings: number;
}

interface ResultsDisplayProps {
  results: ROIResults;
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Your ROI Analysis</h2>
        <p className="text-muted-foreground">See how automation transforms your invoicing process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-success to-success/80 text-success-foreground border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-90">Monthly Savings</p>
              <p className="text-3xl font-bold">{formatCurrency(results.monthly_savings)}</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-90">ROI</p>
              <p className="text-3xl font-bold">{formatPercent(results.roi_percentage)}</p>
            </div>
            <Percent className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-90">Payback Period</p>
              <p className="text-3xl font-bold">{results.payback_months.toFixed(1)} mo</p>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success to-success/80 text-success-foreground border-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-90">Net Savings</p>
              <p className="text-3xl font-bold">{formatCurrency(results.net_savings)}</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Cost Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Current Manual Labor Cost (Monthly)</span>
            <span className="font-semibold text-foreground">{formatCurrency(results.labor_cost_manual)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Automation Cost (Monthly)</span>
            <span className="font-semibold text-foreground">{formatCurrency(results.auto_cost)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Error Reduction Savings (Monthly)</span>
            <span className="font-semibold text-success">{formatCurrency(results.error_savings)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold text-foreground">Total Cumulative Savings</span>
            <span className="text-2xl font-bold text-success">{formatCurrency(results.cumulative_savings)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};