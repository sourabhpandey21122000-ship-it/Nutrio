export interface DishData {
  id: string;
  name: string;
  nameHindi: string;
  description: string | null;
  imageEmoji: string;
  ingredients: { ingredientId: string; grams: number }[];
}

export const dishesData: DishData[] = [
  {
    id: "dal-chawal",
    name: "Dal Chawal",
    nameHindi: "दाल चावल",
    description: "Simple everyday dal with white rice",
    imageEmoji: "🍛",
    ingredients: [
      { ingredientId: "dal-tadka", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
      { ingredientId: "ghee", grams: 10 },
    ],
  },
  {
    id: "roti-sabzi",
    name: "Roti Sabzi",
    nameHindi: "रोटी सब्जी",
    description: "Two rotis with mixed vegetable curry",
    imageEmoji: "🫓",
    ingredients: [
      { ingredientId: "roti", grams: 80 },
      { ingredientId: "mixed-veg-sabzi", grams: 150 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "rajma-chawal",
    name: "Rajma Chawal",
    nameHindi: "राजमा चावल",
    description: "Kidney bean curry with steamed rice",
    imageEmoji: "🫘",
    ingredients: [
      { ingredientId: "rajma", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
      { ingredientId: "ghee", grams: 5 },
    ],
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    nameHindi: "छोले भटूरे",
    description: "Spicy chickpea curry with fried bread",
    imageEmoji: "🍲",
    ingredients: [
      { ingredientId: "chole", grams: 200 },
      { ingredientId: "paratha", grams: 120 },
    ],
  },
  {
    id: "palak-paneer-roti",
    name: "Palak Paneer with Roti",
    nameHindi: "पालक पनीर रोटी",
    description: "Spinach and cottage cheese curry with roti",
    imageEmoji: "🥬",
    ingredients: [
      { ingredientId: "palak-paneer", grams: 200 },
      { ingredientId: "roti", grams: 80 },
    ],
  },
  {
    id: "idli-sambar",
    name: "Idli Sambar",
    nameHindi: "इडली सांभर",
    description: "Steamed rice cakes with lentil vegetable soup",
    imageEmoji: "🫓",
    ingredients: [
      { ingredientId: "idli", grams: 160 },
      { ingredientId: "sambar", grams: 200 },
      { ingredientId: "dahi", grams: 50 },
    ],
  },
  {
    id: "poha",
    name: "Poha",
    nameHindi: "पोहा",
    description: "Flattened rice breakfast dish",
    imageEmoji: "🍽️",
    ingredients: [
      { ingredientId: "poha", grams: 150 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "dosa-sambar",
    name: "Dosa Sambar",
    nameHindi: "डोसा सांभर",
    description: "Crispy rice crepe with lentil soup",
    imageEmoji: "🥞",
    ingredients: [
      { ingredientId: "dosa", grams: 100 },
      { ingredientId: "sambar", grams: 200 },
      { ingredientId: "dahi", grams: 50 },
    ],
  },
  {
    id: "dal-makhani-naan",
    name: "Dal Makhani with Naan",
    nameHindi: "दाल मखनी",
    description: "Rich black lentil curry with bread",
    imageEmoji: "🍜",
    ingredients: [
      { ingredientId: "dal-makhani", grams: 200 },
      { ingredientId: "paratha", grams: 80 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "chicken-rice",
    name: "Chicken Curry with Rice",
    nameHindi: "मुर्ग़ करी चावल",
    description: "Classic chicken curry with steamed rice",
    imageEmoji: "🍗",
    ingredients: [
      { ingredientId: "chicken-curry", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
];
