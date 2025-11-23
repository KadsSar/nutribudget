# NutriBudget Data Notes

## 1. Dataset Summary (canada_grocery_nutrition_5000.csv)

- Source: Canadian grocery products with nutrition + price (derived from GroceryDB-style data).
- File path: `data-ml/raw/canada_grocery_nutrition_5000.csv`

From `01_explore_canada_grocery.ipynb`:

- Number of rows: 4900
- Number of columns: 22

All columns currently show 0.0 missing fraction (no nulls).

---

## 2. Core Columns (from canada_grocery_nutrition_5000.csv)

### 2.1 Product metadata

- `product_name`  
  Product description/name.

- `store`  
  Source retailer.

- `brand`  
  Brand name.

- `category`  
  High-level product category (e.g., Pantry, Dairy, Frozen, Fresh, etc.).

- `sub_category`  
  More specific category (e.g., Bread, Yogurt, Cereal).

- `food_type`  
  Processing type (e.g., Minimally processed, Ultra-Processed).

- `veg_nonveg`  
  Whether the product is Vegetarian or Non-vegetarian.

> Note: The original dataset does not include a `product_id` field.  
> We will create our own `product_id` from the dataframe index in Phase 2.

### 2.2 Nutrients per 100 g

- `calories`  
  Energy in kilocalories per 100 g.

- `protein`  
  Protein in grams per 100 g.

- `carbs`  
  Carbohydrates in grams per 100 g.

- `fat`  
  Fat in grams per 100 g.

- `sugar`  
  Sugar in grams per 100 g.

- `fiber`  
  Fibre in grams per 100 g.

- `sodium`  
  Sodium in milligrams per 100 g.

- `saturated_fat`  
  Saturated fat in grams per 100 g.

- `trans_fat`  
  Trans fat in grams per 100 g.

- `cholesterol`  
  Cholesterol in milligrams per 100 g.

### 2.3 Price-related columns

- `price_per_gram`  
  Price per gram of product (currency unit per gram).

- `price_per_serving`  
  Price per serving.

- `price_per_100g`  
  Price per 100 g.

> The budget in the app will be interpreted in the same currency units as these price columns
> (e.g., if prices are in dollars, then budget is also in dollars).

### 2.4 Processing / health scores

- `FPro`  
  Processing score between 0 and 1 (0 = minimally processed, 1 = ultra-processed).

- `nutriscore`  
  Precomputed nutrition score (higher = healthier / lower risk).

---

## 3. Data Quality Notes

From `01_explore_canada_grocery.ipynb`:

### 3.1 Missing values

- All columns currently show a missing fraction of 0.0 (no nulls).

### 3.2 Out-of-range / suspicious values

- Price-related:
  - `price_per_gram`, `price_per_100g`, and `price_per_serving` are all positive and fall within realistic ranges (no visible negatives or absurd outliers in the basic summary stats).

- Nutrition-related:
  - `calories`, `protein`, `carbs`, `fat`, `sugar`, `fiber`, `sodium`, `saturated_fat`, `trans_fat`, and `cholesterol` appear within plausible ranges for real foods.
  - No obviously impossible values observed in initial `describe()` output.

### 3.3 Initial cleaning decisions (for Phase 2)

Planned rules for Phase 2 (feature engineering):

- Create a `product_id` column from the dataframe index to serve as a stable identifier.
- Keep all rows, since there are no missing values in core columns.
- Potentially cap or handle extreme outliers in price or nutrients if they distort clustering or planner behaviour.
- Use the following as main features:
  - Nutrient features for health: `calories`, `protein`, `carbs`, `fat`, `sugar`, `fiber`.
  - Price feature for cost: `price_per_gram` (and/or `price_per_100g`).
  - Additional health indicators: `FPro` and `nutriscore`.
