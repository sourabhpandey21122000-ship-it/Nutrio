export interface DishData {
  id: string;
  name: string;
  nameHindi: string;
  description: string | null;
  imageEmoji: string;
  isVeg: boolean;
  ingredients: { ingredientId: string; grams: number }[];
}

export const dishesData: DishData[] = [
  // ── CLASSICS ────────────────────────────────────────────────────
  {
    id: "dal-chawal",
    name: "Dal Chawal",
    nameHindi: "दाल चावल",
    description: "Simple everyday toor dal with white rice and ghee",
    imageEmoji: "🍛",
    isVeg: true,
    ingredients: [
      { ingredientId: "dal-tadka", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
      { ingredientId: "ghee", grams: 8 },
    ],
  },
  {
    id: "roti-sabzi",
    name: "Roti Sabzi",
    nameHindi: "रोटी सब्जी",
    description: "Two rotis with mixed vegetable curry and curd",
    imageEmoji: "🫓",
    isVeg: true,
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
    isVeg: true,
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
    isVeg: true,
    ingredients: [
      { ingredientId: "chole", grams: 200 },
      { ingredientId: "paratha", grams: 120 },
    ],
  },

  // ── PANEER DISHES ────────────────────────────────────────────────
  {
    id: "palak-paneer-roti",
    name: "Palak Paneer with Roti",
    nameHindi: "पालक पनीर रोटी",
    description: "Spinach and cottage cheese curry with roti",
    imageEmoji: "🥬",
    isVeg: true,
    ingredients: [
      { ingredientId: "palak-paneer", grams: 200 },
      { ingredientId: "roti", grams: 80 },
    ],
  },
  {
    id: "shahi-paneer-roti",
    name: "Shahi Paneer with Roti",
    nameHindi: "शाही पनीर रोटी",
    description: "Rich creamy paneer in mughlai gravy with roti",
    imageEmoji: "🧀",
    isVeg: true,
    ingredients: [
      { ingredientId: "shahi-paneer", grams: 200 },
      { ingredientId: "roti", grams: 80 },
    ],
  },

  // ── SABZI DISHES ─────────────────────────────────────────────────
  {
    id: "aloo-gobi-roti",
    name: "Aloo Gobi with Roti",
    nameHindi: "आलू गोभी रोटी",
    description: "Dry potato and cauliflower sabzi with roti",
    imageEmoji: "🥦",
    isVeg: true,
    ingredients: [
      { ingredientId: "aloo-gobi", grams: 150 },
      { ingredientId: "roti", grams: 80 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "baingan-bharta-roti",
    name: "Baingan Bharta with Roti",
    nameHindi: "बैंगन भर्ता रोटी",
    description: "Smoky roasted eggplant mash with roti",
    imageEmoji: "🍆",
    isVeg: true,
    ingredients: [
      { ingredientId: "baingan-bharta", grams: 150 },
      { ingredientId: "roti", grams: 80 },
    ],
  },

  // ── DAL DISHES ───────────────────────────────────────────────────
  {
    id: "dal-makhani-naan",
    name: "Dal Makhani with Paratha",
    nameHindi: "दाल मखनी",
    description: "Rich black lentil curry with layered bread",
    imageEmoji: "🍜",
    isVeg: true,
    ingredients: [
      { ingredientId: "dal-makhani", grams: 200 },
      { ingredientId: "paratha", grams: 80 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "kadhi-pakora-rice",
    name: "Kadhi Pakora with Rice",
    nameHindi: "कढ़ी पकोड़ा चावल",
    description: "Yogurt-based curry with fritters and rice",
    imageEmoji: "🍲",
    isVeg: true,
    ingredients: [
      { ingredientId: "kadhi-pakora", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
    ],
  },

  // ── BREAKFAST ────────────────────────────────────────────────────
  {
    id: "idli-sambar",
    name: "Idli Sambar",
    nameHindi: "इडली सांभर",
    description: "Steamed rice cakes with lentil vegetable soup",
    imageEmoji: "🫓",
    isVeg: true,
    ingredients: [
      { ingredientId: "idli", grams: 160 },
      { ingredientId: "sambar", grams: 200 },
      { ingredientId: "dahi", grams: 50 },
    ],
  },
  {
    id: "dosa-sambar",
    name: "Dosa Sambar",
    nameHindi: "डोसा सांभर",
    description: "Crispy rice crepe with lentil soup",
    imageEmoji: "🥞",
    isVeg: true,
    ingredients: [
      { ingredientId: "dosa", grams: 100 },
      { ingredientId: "sambar", grams: 200 },
      { ingredientId: "dahi", grams: 50 },
    ],
  },
  {
    id: "poha",
    name: "Poha",
    nameHindi: "पोहा",
    description: "Flattened rice breakfast with veggies and spices",
    imageEmoji: "🍽️",
    isVeg: true,
    ingredients: [
      { ingredientId: "poha", grams: 150 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "upma-breakfast",
    name: "Upma",
    nameHindi: "उपमा",
    description: "Semolina porridge with vegetables and tempered spices",
    imageEmoji: "🥣",
    isVeg: true,
    ingredients: [
      { ingredientId: "upma", grams: 200 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "methi-thepla-dahi",
    name: "Methi Thepla with Dahi",
    nameHindi: "मेथी थेपला दही",
    description: "Gujarat's classic fenugreek flatbread with curd",
    imageEmoji: "🌿",
    isVeg: true,
    ingredients: [
      { ingredientId: "methi-thepla", grams: 120 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },

  // ── RICE & COMFORT ───────────────────────────────────────────────
  {
    id: "khichdi-dahi",
    name: "Khichdi with Dahi",
    nameHindi: "खिचड़ी दही",
    description: "Moong dal and rice comfort food with curd",
    imageEmoji: "🍚",
    isVeg: true,
    ingredients: [
      { ingredientId: "khichdi", grams: 250 },
      { ingredientId: "dahi", grams: 100 },
      { ingredientId: "ghee", grams: 8 },
    ],
  },
  {
    id: "puri-bhaji",
    name: "Puri Bhaji",
    nameHindi: "पूरी भाजी",
    description: "Deep-fried puffed bread with spiced potato curry",
    imageEmoji: "🥟",
    isVeg: true,
    ingredients: [
      { ingredientId: "puri", grams: 100 },
      { ingredientId: "aloo-sabzi", grams: 150 },
    ],
  },

  // ── BIRYANI ──────────────────────────────────────────────────────
  {
    id: "veg-biryani",
    name: "Veg Biryani",
    nameHindi: "वेज बिरयानी",
    description: "Aromatic basmati rice with mixed vegetables and whole spices",
    imageEmoji: "🌾",
    isVeg: true,
    ingredients: [
      { ingredientId: "veg-biryani", grams: 350 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    nameHindi: "चिकन बिरयानी",
    description: "Dum-style basmati rice layered with spiced chicken",
    imageEmoji: "🍗",
    isVeg: false,
    ingredients: [
      { ingredientId: "chicken-biryani", grams: 350 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },

  // ── NON-VEG MAINS ────────────────────────────────────────────────
  {
    id: "chicken-rice",
    name: "Chicken Curry with Rice",
    nameHindi: "मुर्ग़ करी चावल",
    description: "Classic chicken curry with steamed rice",
    imageEmoji: "🍗",
    isVeg: false,
    ingredients: [
      { ingredientId: "chicken-curry", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
      { ingredientId: "dahi", grams: 100 },
    ],
  },
  {
    id: "butter-chicken-roti",
    name: "Butter Chicken with Roti",
    nameHindi: "बटर चिकन रोटी",
    description: "Murgh makhani in tomato cream sauce with roti",
    imageEmoji: "🧈",
    isVeg: false,
    ingredients: [
      { ingredientId: "butter-chicken", grams: 200 },
      { ingredientId: "roti", grams: 80 },
    ],
  },
  {
    id: "mutton-curry-rice",
    name: "Mutton Curry with Rice",
    nameHindi: "गोश्त करी चावल",
    description: "Slow-cooked mutton curry with steamed basmati",
    imageEmoji: "🥩",
    isVeg: false,
    ingredients: [
      { ingredientId: "mutton-curry", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
    ],
  },
  {
    id: "fish-curry-rice",
    name: "Fish Curry with Rice",
    nameHindi: "मछली करी चावल",
    description: "Coastal spiced fish curry with rice",
    imageEmoji: "🐟",
    isVeg: false,
    ingredients: [
      { ingredientId: "fish-curry", grams: 200 },
      { ingredientId: "white-rice", grams: 150 },
    ],
  },

  // ── EGG DISHES ───────────────────────────────────────────────────
  {
    id: "egg-bhurji-roti",
    name: "Anda Bhurji with Roti",
    nameHindi: "अंडा भुर्जी रोटी",
    description: "Spiced scrambled eggs with masala and roti",
    imageEmoji: "🍳",
    isVeg: false,
    ingredients: [
      { ingredientId: "egg-bhurji", grams: 150 },
      { ingredientId: "roti", grams: 80 },
    ],
  },
  {
    id: "omelette-toast",
    name: "Omelette",
    nameHindi: "अंडा आमलेट",
    description: "Plain egg omelette with spices",
    imageEmoji: "🍳",
    isVeg: false,
    ingredients: [
      { ingredientId: "omelette", grams: 150 },
      { ingredientId: "roti", grams: 40 },
    ],
  },
];
