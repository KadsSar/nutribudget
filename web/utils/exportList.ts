import type { BasketItem } from "../types/plan";

export function exportShoppingList(items: BasketItem[], totals: any) {
    const header = `NutriBudget Shopping List
Generated: ${new Date().toLocaleDateString()}
Total Cost: $${totals.total_spent.toFixed(2)}
Total Items: ${items.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    const itemsList = items.map((item, idx) =>
        `${idx + 1}. ${item.product_name}
   Store: ${item.store}
   Qty: ${item.quantity_units}
   Price: $${item.estimated_cost.toFixed(2)}
`
    ).join('\n');

    const footer = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NUTRITION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Calories: ${totals.calories}
Total Protein: ${totals.protein}g
Total Fiber: ${totals.fiber}g

Happy Shopping! 🛒
Powered by NutriBudget
`;

    const content = header + itemsList + footer;

    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutribudget-shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
