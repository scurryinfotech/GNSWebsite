// export const categories = [
//   { categoryId: 1, categoryName: "CHINESE", description: "Chinese cuisine including momos, noodles, fried rice, and starters", color: "bg-green-500" },
//   { categoryId: 2, categoryName: "BREAKFAST", description: "Breakfast items including appetizers and pasta", color: "bg-blue-500" },
//   { categoryId: 3, categoryName: "BURGER_ROLLS", description: "Burgers, wraps, rolls and french fries", color: "bg-red-500" },
//   { categoryId: 4, categoryName: "PIZZA", description: "Various types of pizzas and combo meals", color: "bg-orange-500" },
//   { categoryId: 5, categoryName: "SANDWICH", description: "Grilled sandwiches and bruschetta", color: "bg-pink-500" },
//   { categoryId: 6, categoryName: "JUICES_ICECREAM_DESSERT", description: "Beverages, juices, milkshakes, ice cream and desserts", color: "bg-purple-500" }
// ];

// Subcategories data
// export const subcategories = {
//   1: [
//     { id: 1, name: "VEG MOMOS", categoryId: 1 },
//     { id: 2, name: "VEG SOUP", categoryId: 1 },
//     { id: 3, name: "NON-VEG MOMOS", categoryId: 1 },
//     { id: 4, name: "NOODLES", categoryId: 1 }, 
//     { id: 5, name: "FRIED RICE", categoryId: 1 }
//   ],
//   2: [
//     { id: 6, name: "APPETIZERS", categoryId: 2 },
//     { id: 7, name: "PASTA", categoryId: 2 },
//     { id: 8, name: "BREAKFAST SPECIALS", categoryId: 2 }
//   ],
//   3: [
//     { id: 9, name: "BURGERS", categoryId: 3 },
//     { id: 10, name: "ROLLS", categoryId: 3 },
//     { id: 11, name: "FRENCH FRIES", categoryId: 3 }
//   ],
//   4: [
//     { id: 12, name: "VEG PIZZA", categoryId: 4 },
//     { id: 13, name: "NON-VEG PIZZA", categoryId: 4 },
//     { id: 14, name: "COMBO MEALS", categoryId: 4 }
//   ],
//   5: [
//     { id: 15, name: "GRILLED SANDWICH", categoryId: 5 },
//     { id: 16, name: "BRUSCHETTA", categoryId: 5 }
//   ],
//   6: [
//     { id: 17, name: "JUICES", categoryId: 6 },
//     { id: 18, name: "MILKSHAKES", categoryId: 6 },
//     { id: 19, name: "ICE CREAM", categoryId: 6 },
//     { id: 20, name: "DESSERTS", categoryId: 6 }
//   ]
// };

// Menu items data
// export const menuItems = {
//   1: [
//     { id: 1, name: "Steam Veg Momos", prices: { Half: 70, Full: 100 }, subcategoryId: 1 },
//     { id: 2, name: "Fried Veg Momos", prices: { Half: 80, Full: 130 }, subcategoryId: 1 },
//     { id: 3, name: "Fried Schezwan Momos Dry", prices: { Half: 100, Full: 170 }, subcategoryId: 1 },
//     { id: 4, name: "Fried Chilly Momos Dry", prices: { Half: 100, Full: 170 }, subcategoryId: 1 }
//   ],
//   2: [
//     { id: 5, name: "Veg Manchow Soup", prices: { Full: 100 }, subcategoryId: 2 },
//     { id: 6, name: "Sweet Corn Soup", prices: { Full: 110 }, subcategoryId: 2 },
//     { id: 7, name: "Hot & Sour Soup", prices: { Full: 110 }, subcategoryId: 2 }
//   ],
//   3: [
//     { id: 8, name: "Chicken Steam Momos", prices: { Half: 90, Full: 140 }, subcategoryId: 3 },
//     { id: 9, name: "Chicken Fried Momos", prices: { Half: 110, Full: 180 }, subcategoryId: 3 }
//   ],
//   4: [
//     { id: 10, name: "Veg Hakka Noodles", prices: { Half: 120, Full: 180 }, subcategoryId: 4 },
//     { id: 11, name: "Veg Schezwan Noodles", prices: { Half: 130, Full: 190 }, subcategoryId: 4 }
//   ],
//   5: [
//     { id: 12, name: "Veg Fried Rice", prices: { Half: 110, Full: 160 }, subcategoryId: 5 },
//     { id: 13, name: "Schezwan Fried Rice", prices: { Half: 120, Full: 170 }, subcategoryId: 5 }
//   ],
//   6: [
//     { id: 14, name: "Garlic Bread", prices: { Full: 80 }, subcategoryId: 6 },
//     { id: 15, name: "Stuffed Garlic Bread", prices: { Full: 120 }, subcategoryId: 6 }
//   ],
//   7: [
//     { id: 16, name: "White Sauce Pasta", prices: { Full: 150 }, subcategoryId: 7 },
//     { id: 17, name: "Red Sauce Pasta", prices: { Full: 140 }, subcategoryId: 7 }
//   ],
//   8: [
//     { id: 18, name: "Pancakes", prices: { Full: 100 }, subcategoryId: 8 },
//     { id: 19, name: "French Toast", prices: { Full: 90 }, subcategoryId: 8 }
//   ],
//   9: [
//     { id: 20, name: "Veg Burger", prices: { Full: 120 }, subcategoryId: 9 },
//     { id: 21, name: "Chicken Burger", prices: { Full: 160 }, subcategoryId: 9 }
//   ],
//   10: [
//     { id: 22, name: "Veg Roll", prices: { Full: 100 }, subcategoryId: 10 },
//     { id: 23, name: "Chicken Roll", prices: { Full: 140 }, subcategoryId: 10 }
//   ],
//   11: [
//     { id: 24, name: "Classic French Fries", prices: { Full: 80 }, subcategoryId: 11 },
//     { id: 25, name: "Peri Peri Fries", prices: { Full: 100 }, subcategoryId: 11 }
//   ],
//   12: [
//     { id: 26, name: "Margherita Pizza", prices: { Full: 180 }, subcategoryId: 12 },
//     { id: 27, name: "Vegetarian Pizza", prices: { Full: 220 }, subcategoryId: 12 }
//   ],
//   13: [
//     { id: 28, name: "Chicken Pizza", prices: { Full: 280 }, subcategoryId: 13 },
//     { id: 29, name: "Pepperoni Pizza", prices: { Full: 320 }, subcategoryId: 13 }
//   ],
//   14: [
//     { id: 30, name: "Pizza + Coke Combo", prices: { Full: 250 }, subcategoryId: 14 },
//     { id: 31, name: "Burger + Fries Combo", prices: { Full: 180 }, subcategoryId: 14 }
//   ],
//   15: [
//     { id: 32, name: "Grilled Cheese Sandwich", prices: { Full: 100 }, subcategoryId: 15 },
//     { id: 33, name: "Veg Grilled Sandwich", prices: { Full: 120 }, subcategoryId: 15 }
//   ],
//   16: [
//     { id: 34, name: "Tomato Bruschetta", prices: { Full: 150 }, subcategoryId: 16 },
//     { id: 35, name: "Cheese Bruschetta", prices: { Full: 180 }, subcategoryId: 16 }
//   ],
//   17: [
//     { id: 36, name: "Orange Juice", prices: { Full: 60 }, subcategoryId: 17 },
//     { id: 37, name: "Apple Juice", prices: { Full: 70 }, subcategoryId: 17 }
//   ],
//   18: [
//     { id: 38, name: "Chocolate Milkshake", prices: { Full: 120 }, subcategoryId: 18 },
//     { id: 39, name: "Strawberry Milkshake", prices: { Full: 130 }, subcategoryId: 18 }
//   ],
//   19: [
//     { id: 40, name: "Vanilla Ice Cream", prices: { Full: 80 }, subcategoryId: 19 },
//     { id: 41, name: "Chocolate Ice Cream", prices: { Full: 90 }, subcategoryId: 19 }
//   ],
//   20: [
//     { id: 42, name: "Chocolate Cake", prices: { Full: 150 }, subcategoryId: 20 },
//     { id: 43, name: "Cheesecake", prices: { Full: 180 }, subcategoryId: 20 }
//   ]
// };

// Table options
// export const tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10'];
