import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import type { CalculatorInputs } from "./CalculatorForm";
import type { ROIResults } from "./ResultsDisplay";

interface ReportGeneratorProps {
  inputs: CalculatorInputs | null;
  results: ROIResults | null;
}

export const ReportGenerator = ({ inputs, results }: ReportGeneratorProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!inputs || !results) {
      toast.error("Please calculate ROI first");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate HTML report
      const reportHTML = generateHTMLReport(inputs, results, email);
      
      // Create blob and download
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roi-report-${inputs.scenario_name}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Report downloaded! A copy has been sent to ${email}`);
      setShowEmailDialog(false);
      setEmail("");
    } catch (error: any) {
      toast.error("Failed to generate report: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHTMLReport = (inputs: CalculatorInputs, results: ROIResults, email: string): string => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    const formatPercent = (value: number) => `${value.toFixed(1)}%`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ROI Report - ${inputs.scenario_name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #3b82f6;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    h2 {
      color: #1e40af;
      margin-top: 30px;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .metric-card {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-card.success {
      background: linear-gradient(135deg, #059669, #047857);
    }
    .metric-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ROI Analysis Report</h1>
    <p><strong>Scenario:</strong> ${inputs.scenario_name}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Contact:</strong> ${email}</p>

    <h2>Executive Summary</h2>
    <div class="metric-grid">
      <div class="metric-card success">
        <div class="metric-label">Monthly Savings</div>
        <div class="metric-value">${formatCurrency(results.monthly_savings)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">ROI</div>
        <div class="metric-value">${formatPercent(results.roi_percentage)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Payback Period</div>
        <div class="metric-value">${results.payback_months.toFixed(1)} mo</div>
      </div>
      <div class="metric-card success">
        <div class="metric-label">Net Savings</div>
        <div class="metric-value">${formatCurrency(results.net_savings)}</div>
      </div>
    </div>

    <h2>Input Parameters</h2>
    <table>
      <tr>
        <th>Parameter</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Monthly Invoice Volume</td>
        <td>${inputs.monthly_invoice_volume.toLocaleString()}</td>
      </tr>
      <tr>
        <td>AP Staff Count</td>
        <td>${inputs.num_ap_staff}</td>
      </tr>
      <tr>
        <td>Hours Per Invoice</td>
        <td>${inputs.avg_hours_per_invoice}</td>
      </tr>
      <tr>
        <td>Hourly Wage</td>
        <td>${formatCurrency(inputs.hourly_wage)}</td>
      </tr>
      <tr>
        <td>Manual Error Rate</td>
        <td>${inputs.error_rate_manual}%</td>
      </tr>
      <tr>
        <td>Error Cost</td>
        <td>${formatCurrency(inputs.error_cost)}</td>
      </tr>
      <tr>
        <td>Time Horizon</td>
        <td>${inputs.time_horizon_months} months</td>
      </tr>
      <tr>
        <td>Implementation Cost</td>
        <td>${formatCurrency(inputs.one_time_implementation_cost)}</td>
      </tr>
    </table>

    <h2>Cost Breakdown</h2>
    <table>
      <tr>
        <th>Category</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td>Current Manual Labor (Monthly)</td>
        <td>${formatCurrency(results.labor_cost_manual)}</td>
      </tr>
      <tr>
        <td>Automation Cost (Monthly)</td>
        <td>${formatCurrency(results.auto_cost)}</td>
      </tr>
      <tr>
        <td>Error Reduction Savings (Monthly)</td>
        <td style="color: #059669; font-weight: bold;">${formatCurrency(results.error_savings)}</td>
      </tr>
      <tr>
        <td><strong>Total Cumulative Savings</strong></td>
        <td style="color: #059669; font-weight: bold; font-size: 18px;">${formatCurrency(results.cumulative_savings)}</td>
      </tr>
    </table>

    <div class="footer">
      <p>This report was generated by the Invoicing ROI Simulator</p>
      <p>© ${new Date().getFullYear()} - All calculations are estimates based on provided inputs</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <>
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Download Full Report</h3>
          <p className="text-muted-foreground">Get a detailed PDF report with all calculations and insights</p>
          <Button
            onClick={() => setShowEmailDialog(true)}
            disabled={!inputs || !results}
            size="lg"
            className="w-full"
          >
            <FileDown className="mr-2 h-5 w-5" />
            Generate Report
          </Button>
        </div>
      </Card>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                We'll send you a copy of the report and keep you updated on how automation can benefit your business.
              </p>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Download Report"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};