export interface IngredientData {
  id: string;
  name: string;
  nameHindi: string;
  category: "grain" | "lentil" | "vegetable" | "dairy" | "oil" | "spice" | "protein";
  nutrition: {
    calories: number | null;
    fat: number | null;
    saturatedFat: number | null;
    carbohydrates: number | null;
    sugars: number | null;
    fiber: number | null;
    protein: number | null;
    salt: number | null;
    sodium: number | null;
  };
  defaultServingGrams: number;
}

export const ingredientsData: IngredientData[] = [
  { id: "roti", name: "Roti (whole wheat)", nameHindi: "Roti", category: "grain", nutrition: { calories: 297, fat: 1.2, saturatedFat: 0.2, carbohydrates: 62, sugars: 0.5, fiber: 9, protein: 11, salt: 0.1, sodium: 40 }, defaultServingGrams: 40 },
  { id: "white-rice", name: "White Rice (cooked)", nameHindi: "Safed Chawal", category: "grain", nutrition: { calories: 130, fat: 0.3, saturatedFat: 0.1, carbohydrates: 28, sugars: 0, fiber: 0.4, protein: 2.7, salt: 0, sodium: 1 }, defaultServingGrams: 150 },
  { id: "brown-rice", name: "Brown Rice (cooked)", nameHindi: "Bhoora Chawal", category: "grain", nutrition: { calories: 111, fat: 0.9, saturatedFat: 0.2, carbohydrates: 23, sugars: 0.4, fiber: 1.8, protein: 2.6, salt: 0, sodium: 5 }, defaultServingGrams: 150 },
  { id: "paratha", name: "Paratha (plain)", nameHindi: "Paratha", category: "grain", nutrition: { calories: 320, fat: 10, saturatedFat: 4, carbohydrates: 50, sugars: 1, fiber: 4, protein: 8, salt: 0.5, sodium: 200 }, defaultServingGrams: 60 },
  { id: "dal-tadka", name: "Dal Tadka (cooked)", nameHindi: "Dal Tadka", category: "lentil", nutrition: { calories: 120, fat: 4, saturatedFat: 1.5, carbohydrates: 14, sugars: 2, fiber: 5, protein: 7, salt: 0.8, sodium: 320 }, defaultServingGrams: 200 },
  { id: "dal-makhani", name: "Dal Makhani (cooked)", nameHindi: "Dal Makhani", category: "lentil", nutrition: { calories: 165, fat: 8, saturatedFat: 4, carbohydrates: 16, sugars: 2, fiber: 6, protein: 8, salt: 1, sodium: 400 }, defaultServingGrams: 200 },
  { id: "chana-dal", name: "Chana Dal (cooked)", nameHindi: "Chana Dal", category: "lentil", nutrition: { calories: 164, fat: 2.7, saturatedFat: 0.3, carbohydrates: 27, sugars: 4, fiber: 8, protein: 9, salt: 0, sodium: 7 }, defaultServingGrams: 150 },
  { id: "moong-dal", name: "Moong Dal (cooked)", nameHindi: "Moong Dal", category: "lentil", nutrition: { calories: 105, fat: 0.4, saturatedFat: 0.1, carbohydrates: 19, sugars: 2, fiber: 8, protein: 7, salt: 0, sodium: 2 }, defaultServingGrams: 150 },
  { id: "rajma", name: "Rajma (cooked)", nameHindi: "Rajma", category: "lentil", nutrition: { calories: 127, fat: 0.5, saturatedFat: 0.1, carbohydrates: 23, sugars: 0.3, fiber: 6, protein: 9, salt: 0.6, sodium: 240 }, defaultServingGrams: 200 },
  { id: "chole", name: "Chhole / Chickpeas (cooked)", nameHindi: "Chole", category: "lentil", nutrition: { calories: 164, fat: 2.6, saturatedFat: 0.3, carbohydrates: 27, sugars: 4.8, fiber: 8, protein: 9, salt: 0.4, sodium: 160 }, defaultServingGrams: 200 },
  { id: "aloo-sabzi", name: "Aloo Sabzi (cooked)", nameHindi: "Aloo Sabzi", category: "vegetable", nutrition: { calories: 110, fat: 4.5, saturatedFat: 0.5, carbohydrates: 16, sugars: 1.5, fiber: 2.5, protein: 2, salt: 0.7, sodium: 280 }, defaultServingGrams: 150 },
  { id: "palak-paneer", name: "Palak Paneer", nameHindi: "Palak Paneer", category: "vegetable", nutrition: { calories: 175, fat: 12, saturatedFat: 6, carbohydrates: 9, sugars: 2, fiber: 3, protein: 8, salt: 0.8, sodium: 320 }, defaultServingGrams: 200 },
  { id: "mixed-veg-sabzi", name: "Mixed Veg Sabzi", nameHindi: "Mixi Sabzi", category: "vegetable", nutrition: { calories: 95, fat: 4, saturatedFat: 0.5, carbohydrates: 12, sugars: 4, fiber: 3.5, protein: 2.5, salt: 0.6, sodium: 240 }, defaultServingGrams: 150 },
  { id: "bhindi-masala", name: "Bhindi Masala", nameHindi: "Bhindi Masala", category: "vegetable", nutrition: { calories: 100, fat: 6, saturatedFat: 0.7, carbohydrates: 10, sugars: 3, fiber: 4, protein: 2, salt: 0.5, sodium: 200 }, defaultServingGrams: 150 },
  { id: "paneer", name: "Paneer (raw)", nameHindi: "Paneer", category: "dairy", nutrition: { calories: 265, fat: 20, saturatedFat: 13, carbohydrates: 1.2, sugars: 1.2, fiber: 0, protein: 18, salt: 0.1, sodium: 40 }, defaultServingGrams: 100 },
  { id: "dahi", name: "Dahi / Curd", nameHindi: "Dahi", category: "dairy", nutrition: { calories: 98, fat: 4.3, saturatedFat: 2.8, carbohydrates: 3.4, sugars: 3.4, fiber: 0, protein: 11, salt: 0.1, sodium: 40 }, defaultServingGrams: 100 },
  { id: "milk", name: "Milk (full fat)", nameHindi: "Doodh", category: "dairy", nutrition: { calories: 61, fat: 3.3, saturatedFat: 1.9, carbohydrates: 4.8, sugars: 4.8, fiber: 0, protein: 3.2, salt: 0.1, sodium: 40 }, defaultServingGrams: 200 },
  { id: "ghee", name: "Ghee", nameHindi: "Ghee", category: "oil", nutrition: { calories: 900, fat: 100, saturatedFat: 62, carbohydrates: 0, sugars: 0, fiber: 0, protein: 0, salt: 0, sodium: 0 }, defaultServingGrams: 10 },
  { id: "mustard-oil", name: "Mustard Oil", nameHindi: "Sarson ka Tel", category: "oil", nutrition: { calories: 884, fat: 100, saturatedFat: 11.6, carbohydrates: 0, sugars: 0, fiber: 0, protein: 0, salt: 0, sodium: 0 }, defaultServingGrams: 10 },
  { id: "coconut-oil", name: "Coconut Oil", nameHindi: "Nariyal ka Tel", category: "oil", nutrition: { calories: 862, fat: 100, saturatedFat: 86, carbohydrates: 0, sugars: 0, fiber: 0, protein: 0, salt: 0, sodium: 0 }, defaultServingGrams: 10 },
  { id: "egg", name: "Egg (boiled)", nameHindi: "Anda", category: "protein", nutrition: { calories: 155, fat: 11, saturatedFat: 3.3, carbohydrates: 1.1, sugars: 1.1, fiber: 0, protein: 13, salt: 0.3, sodium: 120 }, defaultServingGrams: 50 },
  { id: "chicken-curry", name: "Chicken Curry", nameHindi: "Murgh Curry", category: "protein", nutrition: { calories: 175, fat: 10, saturatedFat: 2.5, carbohydrates: 4, sugars: 2, fiber: 1, protein: 18, salt: 0.8, sodium: 320 }, defaultServingGrams: 200 },
  { id: "fish-curry", name: "Fish Curry", nameHindi: "Machli Curry", category: "protein", nutrition: { calories: 140, fat: 7, saturatedFat: 1.5, carbohydrates: 5, sugars: 2, fiber: 1, protein: 16, salt: 0.9, sodium: 360 }, defaultServingGrams: 200 },
  { id: "idli", name: "Idli (steamed)", nameHindi: "Idli", category: "grain", nutrition: { calories: 58, fat: 0.3, saturatedFat: 0.1, carbohydrates: 12, sugars: 0.3, fiber: 0.5, protein: 2, salt: 0.2, sodium: 80 }, defaultServingGrams: 40 },
  { id: "dosa", name: "Dosa (plain)", nameHindi: "Dosa", category: "grain", nutrition: { calories: 168, fat: 6, saturatedFat: 0.7, carbohydrates: 25, sugars: 0.5, fiber: 1.5, protein: 4, salt: 0.4, sodium: 160 }, defaultServingGrams: 100 },
  { id: "sambar", name: "Sambar", nameHindi: "Sambar", category: "lentil", nutrition: { calories: 68, fat: 2.5, saturatedFat: 0.5, carbohydrates: 9, sugars: 3, fiber: 3, protein: 3.5, salt: 0.7, sodium: 280 }, defaultServingGrams: 200 },
  { id: "poha", name: "Poha (cooked)", nameHindi: "Poha", category: "grain", nutrition: { calories: 180, fat: 5, saturatedFat: 0.5, carbohydrates: 30, sugars: 1, fiber: 1.5, protein: 3, salt: 0.6, sodium: 240 }, defaultServingGrams: 150 },
  { id: "upma", name: "Upma", nameHindi: "Upma", category: "grain", nutrition: { calories: 150, fat: 6, saturatedFat: 1, carbohydrates: 22, sugars: 1.5, fiber: 2, protein: 4, salt: 0.5, sodium: 200 }, defaultServingGrams: 150 },
];
