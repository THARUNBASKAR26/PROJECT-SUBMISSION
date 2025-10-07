-- Create table for ROI simulation scenarios
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  monthly_invoice_volume INTEGER NOT NULL,
  num_ap_staff INTEGER NOT NULL,
  avg_hours_per_invoice DECIMAL(10, 4) NOT NULL,
  hourly_wage DECIMAL(10, 2) NOT NULL,
  error_rate_manual DECIMAL(5, 2) NOT NULL,
  error_cost DECIMAL(10, 2) NOT NULL,
  time_horizon_months INTEGER NOT NULL,
  one_time_implementation_cost DECIMAL(10, 2) DEFAULT 0,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read scenarios (public calculator)
CREATE POLICY "Anyone can view scenarios" 
ON public.scenarios 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to create scenarios
CREATE POLICY "Anyone can create scenarios" 
ON public.scenarios 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to delete scenarios
CREATE POLICY "Anyone can delete scenarios" 
ON public.scenarios 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_scenarios_created_at ON public.scenarios(created_at DESC);