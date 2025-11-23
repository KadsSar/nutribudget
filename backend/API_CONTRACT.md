# API Contract

## Base URL
`http://localhost:5000`

## Endpoints

### 1. Health Check
- **GET** `/health`
- **Response**:
  ```json
  { "status": "ok" }
  ```

### 2. Get Foods
- **GET** `/api/foods`
- **Query Parameters**:
  - `veg_nonveg` (optional): "vegetarian", "non-vegetarian", or "all" (default: "all")
  - `max_price_per_100g` (optional): Filter by max price.
  - `cluster` (optional): Filter by cluster ID.
  - `category` (optional): Filter by category.
- **Response**: Array of food objects.
  ```json
  [
    {
      "product_id": 123,
      "product_name": "Apple",
      "store": "Loblaws",
      "category": "Fruits",
      "cluster_label": "Veg & Wholefoods",
      "price_per_100g": 0.5,
      "health_score": 85,
      "nutri_score_app": 80
    }
  ]
  ```

### 3. Generate Plan
- **POST** `/api/plan`
- **Request Body**:
  ```json
  {
    "budget": 50,
    "people": 2,
    "dietType": "veg"
  }
  ```
- **Response**:
  ```json
  {
    "inputs": { "budget": 50, "people": 2, "dietType": "veg" },
    "items": [
      {
        "product_id": 123,
        "product_name": "Apple",
        "store": "Loblaws",
        "category": "Fruits",
        "cluster_label": "Veg & Wholefoods",
        "health_score": 85,
        "nutri_score_app": 80,
        "price_per_100g": 0.5,
        "quantity_units": 4,
        "estimated_cost": 2.0
      }
    ],
    "totals": {
      "total_spent": 48.5,
      "budget": 50,
      "calories": 2100,
      "protein": 45,
      "fiber": 30
    },
    "clusterBreakdown": {
      "Veg & Wholefoods": 10,
      "Staples / Mixed": 5
    }
  }
  ```
