import pandas as pd
import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from planner import planner, load_dataset

# Load data
data_path = 'data-ml/outputs/foods_scored.csv'
df = load_dataset(data_path)

print(f"Total items: {len(df)}")
print("Columns:", df.columns.tolist())
if "veg_nonveg" in df.columns:
    print("veg_nonveg values:", df["veg_nonveg"].unique())
else:
    print("Column 'veg_nonveg' not found!")

# Helper to check veg status
def count_non_veg(items, df):
    names = [i['product_name'] for i in items]
    subset = df[df['product_name'].isin(names)]
    if 'veg_nonveg' not in subset.columns: return 0
    return subset[subset['veg_nonveg'] == 'Non-Vegetarian'].shape[0]

# Generate plan for Vegan
print("\n--- Generating Vegan Plan ---")
vegan_plan = planner(50, 1, "Vegan", df)
vegan_non_veg_count = count_non_veg(vegan_plan['items'], df)
print(f"Non-Veg items in Vegan Plan: {vegan_non_veg_count}")

# Generate plan for Non-Vegetarian
print("\n--- Generating Non-Vegetarian Plan ---")
nonveg_plan = planner(50, 1, "Non-Vegetarian", df)
nonveg_non_veg_count = count_non_veg(nonveg_plan['items'], df)
print(f"Non-Veg items in Non-Veg Plan: {nonveg_non_veg_count}")

if vegan_non_veg_count == 0 and nonveg_non_veg_count > 0:
    print("PASS: Vegan plan is strictly vegetarian, Non-Veg plan includes meat.")
else:
    print("FAIL: Filtering logic is still flawed.")
    
    # Debug: Check top non-veg items
    df["value_metric"] = df["nutri_score_app"] / df["price_per_100g"]
    non_veg = df[df["veg_nonveg"] == "Non-Vegetarian"].sort_values("value_metric", ascending=False)
    print("\nTop 10 Non-Veg Items by Value:")
    print(non_veg[["product_name", "value_metric", "price_per_100g", "nutri_score_app"]].head(10))
