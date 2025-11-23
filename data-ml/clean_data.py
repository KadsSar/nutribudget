import pandas as pd
import os
from pathlib import Path

# 1. Load Data
# Try relative path from data-ml first, then from root
raw_path = Path("raw/canada_grocery_nutrition_5000.csv")
if not raw_path.exists():
    raw_path = Path("data-ml/raw/canada_grocery_nutrition_5000.csv")

if not raw_path.exists():
    # Fallback to absolute path if needed, but let's try relative first
    print(f"Error: Could not find {raw_path}")
    exit(1)

print(f"Loading data from {raw_path}...")
df = pd.read_csv(raw_path)

# 2. Fix brand-product mismatches
df = df.copy()

big_cp_brands = {
    "Coca-Cola", "PepsiCo", "Nestlé", "Heinz",
    "Yoplait", "Oikos", "Quaker", "Kellogg's", "Astro"
}

beverage_keywords = {
    "coke": "Coca-Cola",
    "cola": "Coca-Cola",
    "coca-cola": "Coca-Cola",
    "pepsi": "PepsiCo",
    "sprite": "Coca-Cola",
    "fanta": "Coca-Cola",
    "7-up": "PepsiCo",
    "7up": "PepsiCo",
    "7 up": "PepsiCo",
    "mountain dew": "PepsiCo",
}

produce_categories = {"Produce"}

def clean_brand(row):
    name = str(row["product_name"]).lower()
    brand = str(row["brand"])
    store = str(row["store"])
    category = str(row["category"])

    # 1) If the name clearly says Coke / Pepsi / Sprite etc., force the right brand
    for kw, br in beverage_keywords.items():
        if kw in name:
            return br

    # 2) For Produce, if the brand is a big packaged-goods brand, use the store as brand
    if category in produce_categories and brand in big_cp_brands:
        return store

    # 3) Otherwise keep the original brand
    return brand

df["brand_clean"] = df.apply(clean_brand, axis=1)

# 3. Winsorize prices
def winsorize_prices(group, lower=0.01, upper=0.99):
    q_low = group["price_per_100g"].quantile(lower)
    q_high = group["price_per_100g"].quantile(upper)

    # Clamp
    group["price_per_100g_clean"] = group["price_per_100g"].clip(q_low, q_high)

    # Scale other price columns proportionally
    # Avoid division by zero
    mask = group["price_per_100g"] != 0
    factor = pd.Series(1.0, index=group.index)
    factor[mask] = group.loc[mask, "price_per_100g_clean"] / group.loc[mask, "price_per_100g"]
    
    group["price_per_gram_clean"] = group["price_per_gram"] * factor
    group["price_per_serving_clean"] = group["price_per_serving"] * factor

    return group

# Filter out zero prices before grouping if necessary, or handle in function
# The original dataset might have some 0s, let's keep them but they won't be scaled
df = df.groupby("category", group_keys=False).apply(winsorize_prices)

# 4. Finalize columns
# Drop old columns and rename clean ones
df = df.drop(columns=["brand"])
df = df.rename(columns={"brand_clean": "brand"})

df = df.drop(
    columns=["price_per_gram", "price_per_serving", "price_per_100g"]
).rename(
    columns={
        "price_per_gram_clean": "price_per_gram",
        "price_per_serving_clean": "price_per_serving",
        "price_per_100g_clean": "price_per_100g",
    }
)

# 5. Save
output_path = Path("outputs/canada_grocery_nutrition_clean.csv")
if not output_path.parent.exists():
    # If running from root
    output_path = Path("data-ml/outputs/canada_grocery_nutrition_clean.csv")

output_path.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(output_path, index=False)
print(f"Saved cleaned data to {output_path}")
