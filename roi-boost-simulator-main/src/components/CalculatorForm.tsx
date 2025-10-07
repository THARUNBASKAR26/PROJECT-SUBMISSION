import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface CalculatorInputs {
  scenario_name: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost: number;
}

interface CalculatorFormProps {
  onCalculate: (data: CalculatorInputs) => void;
  defaultValues?: Partial<CalculatorInputs>;
}

export const CalculatorForm = ({ onCalculate, defaultValues }: CalculatorFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CalculatorInputs>({
    defaultValues: {
      scenario_name: defaultValues?.scenario_name || "",
      monthly_invoice_volume: defaultValues?.monthly_invoice_volume || 2000,
      num_ap_staff: defaultValues?.num_ap_staff || 3,
      avg_hours_per_invoice: defaultValues?.avg_hours_per_invoice || 0.17,
      hourly_wage: defaultValues?.hourly_wage || 30,
      error_rate_manual: defaultValues?.error_rate_manual || 0.5,
      error_cost: defaultValues?.error_cost || 100,
      time_horizon_months: defaultValues?.time_horizon_months || 36,
      one_time_implementation_cost: defaultValues?.one_time_implementation_cost || 50000,
    }
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onCalculate)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Input Your Business Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario_name">Scenario Name</Label>
              <Input
                id="scenario_name"
                {...register("scenario_name", { required: "Scenario name is required" })}
                placeholder="e.g., Q4_Pilot"
              />
              {errors.scenario_name && (
                <p className="text-sm text-destructive">{errors.scenario_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_invoice_volume">Monthly Invoice Volume</Label>
              <Input
                id="monthly_invoice_volume"
                type="number"
                {...register("monthly_invoice_volume", { 
                  required: "Required",
                  min: { value: 1, message: "Must be at least 1" }
                })}
                placeholder="2000"
              />
              {errors.monthly_invoice_volume && (
                <p className="text-sm text-destructive">{errors.monthly_invoice_volume.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_ap_staff">Number of AP Staff</Label>
              <Input
                id="num_ap_staff"
                type="number"
                {...register("num_ap_staff", { 
                  required: "Required",
                  min: { value: 1, message: "Must be at least 1" }
                })}
                placeholder="3"
              />
              {errors.num_ap_staff && (
                <p className="text-sm text-destructive">{errors.num_ap_staff.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avg_hours_per_invoice">Avg Hours Per Invoice</Label>
              <Input
                id="avg_hours_per_invoice"
                type="number"
                step="0.01"
                {...register("avg_hours_per_invoice", { 
                  required: "Required",
                  min: { value: 0.01, message: "Must be greater than 0" }
                })}
                placeholder="0.17"
              />
              <p className="text-xs text-muted-foreground">e.g., 0.17 hours = ~10 minutes</p>
              {errors.avg_hours_per_invoice && (
                <p className="text-sm text-destructive">{errors.avg_hours_per_invoice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_wage">Average Hourly Wage ($)</Label>
              <Input
                id="hourly_wage"
                type="number"
                step="0.01"
                {...register("hourly_wage", { 
                  required: "Required",
                  min: { value: 0.01, message: "Must be greater than 0" }
                })}
                placeholder="30"
              />
              {errors.hourly_wage && (
                <p className="text-sm text-destructive">{errors.hourly_wage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="error_rate_manual">Manual Error Rate (%)</Label>
              <Input
                id="error_rate_manual"
                type="number"
                step="0.1"
                {...register("error_rate_manual", { 
                  required: "Required",
                  min: { value: 0, message: "Must be 0 or greater" },
                  max: { value: 100, message: "Must be 100 or less" }
                })}
                placeholder="0.5"
              />
              {errors.error_rate_manual && (
                <p className="text-sm text-destructive">{errors.error_rate_manual.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="error_cost">Cost Per Error ($)</Label>
              <Input
                id="error_cost"
                type="number"
                step="0.01"
                {...register("error_cost", { 
                  required: "Required",
                  min: { value: 0, message: "Must be 0 or greater" }
                })}
                placeholder="100"
              />
              {errors.error_cost && (
                <p className="text-sm text-destructive">{errors.error_cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_horizon_months">Time Horizon (Months)</Label>
              <Input
                id="time_horizon_months"
                type="number"
                {...register("time_horizon_months", { 
                  required: "Required",
                  min: { value: 1, message: "Must be at least 1" }
                })}
                placeholder="36"
              />
              {errors.time_horizon_months && (
                <p className="text-sm text-destructive">{errors.time_horizon_months.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="one_time_implementation_cost">One-Time Setup Cost ($)</Label>
              <Input
                id="one_time_implementation_cost"
                type="number"
                step="0.01"
                {...register("one_time_implementation_cost", { 
                  required: "Required",
                  min: { value: 0, message: "Must be 0 or greater" }
                })}
                placeholder="50000"
              />
              {errors.one_time_implementation_cost && (
                <p className="text-sm text-destructive">{errors.one_time_implementation_cost.message}</p>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Calculate ROI
        </Button>
      </form>
    </Card>
  );
};