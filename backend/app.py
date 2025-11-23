from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

from planner import load_dataset, planner

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Path to CSV (relative to backend folder)
DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data-ml",
    "outputs",
    "foods_scored.csv",
)

# Load dataset once at startup
df = load_dataset(DATA_PATH)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/foods", methods=["GET"])
def get_foods():
    """
    GET /api/foods
    Query params:
      veg_nonveg: 'vegetarian' | 'non-vegetarian' | 'all' (default 'all')
      max_price_per_100g: float
      cluster: int (cluster id)
      category: string
    """
    veg_filter = request.args.get("veg_nonveg", "all").lower()
    max_price = request.args.get("max_price_per_100g", type=float)
    cluster_id = request.args.get("cluster", type=int)
    category = request.args.get("category")

    filtered = df.copy()

    if veg_filter in ["vegetarian", "veg"]:
        # Assuming 'veg_nonveg' column exists and has "Vegetarian" / "Non-Vegetarian"
        if "veg_nonveg" in filtered.columns:
            filtered = filtered[filtered["veg_nonveg"].astype(str).str.lower().str.contains("veg")]
    elif veg_filter in ["non-vegetarian", "nonveg"]:
         if "veg_nonveg" in filtered.columns:
            filtered = filtered[~filtered["veg_nonveg"].astype(str).str.lower().str.contains("veg")]

    if max_price is not None:
        filtered = filtered[filtered["price_per_100g"] <= max_price]

    if cluster_id is not None:
        filtered = filtered[filtered["cluster"] == cluster_id]

    if category:
        filtered = filtered[filtered["category"] == category]

    # Return top 100 to avoid huge payload if no filters
    result = filtered.head(100).to_dict(orient="records")
    
    # Filter fields to return
    output = []
    for item in result:
        output.append({
            "product_id": item.get("product_id"),
            "product_name": item.get("product_name"),
            "store": item.get("store"),
            "category": item.get("category"),
            "cluster_label": item.get("cluster_label"),
            "price_per_100g": item.get("price_per_100g"),
            "health_score": item.get("health_score"),
            "nutri_score_app": item.get("nutri_score_app")
        })

    return jsonify(output)


@app.route("/api/plan", methods=["POST"])
def api_plan():
    """
    POST /api/plan
    Body: { "budget": 50, "people": 2, "dietType": "veg" }
    """
    body = request.get_json(force=True) or {}

    try:
        budget = float(body.get("budget", 0))
        people = int(body.get("people", 1))
        diet_type = str(body.get("dietType", "veg"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid request body"}), 400

    if budget <= 0 or people < 1:
        return jsonify({"error": "budget must be > 0 and people must be >= 1"}), 400

    result = planner(budget, people, diet_type, df)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
