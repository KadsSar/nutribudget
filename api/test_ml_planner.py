#!/usr/bin/env python3
"""Quick test of ML-powered planner"""

from planner import planner, load_dataset

# Load dataset
df = load_dataset('data/foods_scored.csv')

# Test ML planner
result = planner(100, 2, 'veg', 'balanced', df, use_ml=True)

print(f"\n✅ ML Planner Test Results:")
print(f"   Items: {len(result['items'])}")
print(f"   Total Spent: ${result['totals']['total_spent']:.2f}")
print(f"   Calories: {result['totals']['calories']}")
print(f"   Protein: {result['totals']['protein']}g")
print(f"\n   Sample items:")
for i, item in enumerate(result['items'][:5]):
    print(f"   {i+1}. {item['product_name']} - ${item['estimated_cost']:.2f}")
