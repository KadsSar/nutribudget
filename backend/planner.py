import pandas as pd
from typing import Dict, Any


def load_dataset(csv_path: str) -> pd.DataFrame:
    """
    Load the Canada grocery dataset and add a product_id column.

    Called once from app.py at startup.
    """
    df = pd.read_csv(csv_path)
    df = df.reset_index().rename(columns={"index": "product_id"})
    return df


def planner(budget: float, people: int, diet_type: str, goal: str, df: pd.DataFrame) -> Dict[str, Any]:
    """
    Phase 1 dummy planner.

    - Applies a very light diet filter based on veg/non_veg.
    - Randomly samples a few items.
    - Computes cost and nutrient totals.
    - Builds a response that matches API_CONTRACT.md.

    This is NOT a real optimization yet; that will come in later phases.
    """

    # --- 1. Basic diet filter ---
    filtered = df.copy()

    # veg / vegan → try to keep vegetarian items if possible
    if diet_type in ("veg", "vegan") and "veg_nonveg" in filtered.columns:
        veg_mask = filtered["veg_nonveg"].astype(str).str.lower().str.contains("veg")
        tmp = filtered[veg_mask]
        if not tmp.empty:
            filtered = tmp

    # if filter removed everything, fall back to full dataset
    if filtered.empty:
        filtered = df.copy()

    # --- 2. Sample a few items (3) ---
    sample_size = min(3, len(filtered))
    sample = filtered.sample(sample_size, random_state=42)

    basket = []

    for _, row in sample.iterrows():
        quantity = 1
        unit = "item"

        price_per_100g = float(row.get("price_per_100g", 0.0))
        cost = price_per_100g * quantity  # treat 1 item as one 100 g-priced unit

        calories = float(row.get("calories", 0.0))
        protein = float(row.get("protein", 0.0))
        carbs = float(row.get("carbs", 0.0))
        fat = float(row.get("fat", 0.0))
        sugar = float(row.get("sugar", 0.0))
        fiber = float(row.get("fiber", 0.0))
        fpro = float(row.get("FPro", 0.0))

        basket.append(
            {
                "product_id": int(row["product_id"]),
                "name": str(row.get("product_name", "")),
                "store": str(row.get("store", "")),
                "brand": str(row.get("brand", "")),
                "category": str(row.get("category", "")),
                "sub_category": str(row.get("sub_category", "")),
                "quantity": quantity,
                "unit": unit,
                "cost": round(cost, 2),
                "calories": round(calories, 1),
                "protein": round(protein, 1),
                "carbs": round(carbs, 1),
                "fat": round(fat, 1),
                "sugar": round(sugar, 1),
                "fiber": round(fiber, 1),
                "cluster": 0,
                "cluster_label": "Placeholder Cluster",
                "FPro": round(fpro, 3),
            }
        )

    # --- 3. Totals ---
    totals = {
        "cost": round(sum(item["cost"] for item in basket), 2),
        "calories": round(sum(item["calories"] for item in basket), 1),
        "protein": round(sum(item["protein"] for item in basket), 1),
        "carbs": round(sum(item["carbs"] for item in basket), 1),
        "fat": round(sum(item["fat"] for item in basket), 1),
        "sugar": round(sum(item["sugar"] for item in basket), 1),
        "fiber": round(sum(item["fiber"] for item in basket), 1),
    }

    # --- 4. Coverage (simple targets) ---
    calories_target = 2400 * people
    protein_target = 50 * people

    coverage = {
        "calories": {
            "target": calories_target,
            "actual": totals["calories"],
            "percentage": round((totals["calories"] / calories_target) * 100, 1)
            if calories_target > 0
            else 0.0,
        },
        "protein": {
            "target": protein_target,
            "actual": totals["protein"],
            "percentage": round((totals["protein"] / protein_target) * 100, 1)
            if protein_target > 0
            else 0.0,
        },
    }

    # --- 5. Cluster breakdown (placeholder single cluster) ---
    cluster_breakdown = [
        {
            "cluster": 0,
            "label": "Placeholder Cluster",
            "count": len(basket),
            "cost": totals["cost"],
            "percentage": 100.0,
        }
    ]

    # --- 6. Processing breakdown by food_type ---
    processing_breakdown = []
    if "food_type" in sample.columns and not sample.empty:
        tmp = sample.copy()
        tmp["item_cost"] = tmp.get("price_per_100g", 0.0)
        total_cost = tmp["item_cost"].sum()

        for level, grp in tmp.groupby("food_type"):
            lvl_cost = grp["item_cost"].sum()
            processing_breakdown.append(
                {
                    "level": str(level),
                    "count": int(len(grp)),
                    "cost": round(lvl_cost, 2),
                    "percentage": round((lvl_cost / total_cost) * 100, 1)
                    if total_cost > 0
                    else 0.0,
                }
            )

    return {
        "basket": basket,
        "totals": totals,
        "coverage": coverage,
        "cluster_breakdown": cluster_breakdown,
        "processing_breakdown": processing_breakdown,
    }
