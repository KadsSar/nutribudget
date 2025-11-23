from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from planner import load_dataset, planner

app = Flask(__name__)
CORS(app)

# Path to CSV (relative to backend folder)
DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data-ml",
    "raw",
    "canada_grocery_nutrition_5000.csv",
)

# Load dataset once at startup
df = load_dataset(DATA_PATH)


@app.route("/api/debug-products", methods=["GET"])
def debug_products():
    """
    Simple debug route to confirm backend + data loading work.
    Returns the first 20 rows as JSON.
    """
    sample = df.head(20).to_dict(orient="records")
    return jsonify(sample)


@app.route("/api/plan", methods=["POST"])
def api_plan():
    """
    POST /api/plan implementation for Phase 1.

    - Validates basic input (budget > 0, people >= 1).
    - Reads dietType and goal.
    - Delegates to planner() to build a response that matches API_CONTRACT.md.
    """
    body = request.get_json(force=True) or {}

    try:
        budget = float(body.get("budget", 0))
        people = int(body.get("people", 1))
        diet_type = str(body.get("dietType", "veg"))
        goal = str(body.get("goal", "balanced"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid request body"}), 400

    if budget <= 0 or people < 1:
        return jsonify({"error": "budget must be > 0 and people must be >= 1"}), 400

    result = planner(budget, people, diet_type, goal, df)
    return jsonify(result)


@app.route("/", methods=["GET"])
def root():
    return jsonify(
        {
            "status": "NutriBudget backend running",
            "endpoints": ["/api/debug-products", "/api/plan"],
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
