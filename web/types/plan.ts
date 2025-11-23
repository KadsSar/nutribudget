export type BasketItem = {
  product_id: string | number;
  product_name: string;
  store: string;
  category: string;
  cluster_label: string;
  quantity_units: number;
  unit: string;
  estimated_cost: number;
  health_score: number;
  nutri_score_app: number;
  price_per_100g: number;
  // Optional raw data if needed
  calories?: number;
  protein?: number;
};

export type PlanTotals = {
  total_spent: number;
  budget: number;
  calories: number;
  protein: number;
  fiber: number;
};

export type PlanCoverage = {
  calories: {
    target: number;
    actual: number;
    percentage: number;
  };
  protein: {
    target: number;
    actual: number;
    percentage: number;
  };
};

export type PlanResponse = {
  inputs: {
    budget: number;
    people: number;
    dietType: string;
  };
  items: BasketItem[];
  totals: PlanTotals;
  coverage: PlanCoverage;
  savings?: {
    amount: number;
    percentage: number;
    typical_cost: number;
  };
  clusterBreakdown: Record<string, number>;
  processingBreakdown?: Record<string, number>;
};
