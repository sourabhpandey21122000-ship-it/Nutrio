import { useParams, useLocation } from "wouter";
import React from "react";
import { NutriScore } from "@/components/ui/nutri-score";
import { TrafficLight } from "@/components/ui/traffic-light";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, ScanLine, Leaf, Info, AlertTriangle, Sparkles, FlameKindling, RefreshCw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

declare function gtag(...args: unknown[]): void;

// ─── Types ───────────────────────────────────────────────────────────────────

interface NutriInfo {
  calories?: number;
  fat?: number;
  sugars?: number;
  salt?: number;
  protein?: number;
  fiber?: number;
  sodium?: number;
  saturatedFat?: number;
}

interface Alternative {
  type: "home" | "shop";
  name: string;
  reason: string;
}

interface Product {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  nutriScore: string;
  nutriScorePoints?: number;
  isVeg?: boolean | null;
  isVegan?: boolean;
  isSwadeshi?: boolean;
  swadeshiScore?: number;
  isUltraProcessed?: boolean;
  source?: string;
  imageUrl?: string;
  nutrition?: NutriInfo;
  ingredients?: string;
  tips?: string[];
  ayurvedicNote?: string;
  alternatives?: Alternative[];
}

// ─── Fun Facts ───────────────────────────────────────────────────────────────

const FUN_FACTS = [
  "Parle-G duniya ka sabse zyada bikne wala biscuit brand hai! 🌍",
  "Dahi mein live probiotic bacteria hote hain jo gut health ke liye zaroori hain! 🦠",
  "Amul India ka sabse bada dairy brand hai — rozana 2 crore litre milk process karta hai! 🥛",
  "Maggi 1983 mein India mein launch hua tha! 📅",
  "Honey kabhi kharab nahi hota — 3000 saal purana Egyptian honey bhi khaane layak tha! 🍯",
  "Dark chocolate mein antioxidants hote hain jo heart ke liye beneficial hain! 🍫",
  "Ek chammach namak mein 2300mg sodium hota hai — poore din ki limit! 🧂",
  "Moong dal sabse jaldi digest hone wali dal hai! 💚",
  "Britannia 1892 mein establish hua tha — India ki sabse purani food company hai! 🏢",
  "Coconut water mein natural electrolytes hote hain! 🥥",
  "Tata Salt India ka pehla iodised salt brand tha! 🧂",
  "Haldiram's 1937 mein Bikaner mein ek choti si shop se shuru hua tha! 🏪",
  "Oats mein beta-glucan fiber hota hai jo cholesterol kam karta hai! 🌾",
  "Turmeric (haldi) mein curcumin hota hai jo natural anti-inflammatory hai! 🌿",
  "Rajma mein chicken se zyada protein ho sakta hai per 100g! 🫘",
  "Sattu Bihar ka traditional superfood hai — protein aur fiber se bharpoor! 💪",
  "Amul ka naam Anand Milk Union Limited ka short form hai! 🐄",
  "Frooti 1985 mein launch hua — India ka pehla tetrapak juice tha! 🥭",
  "Chana dal tridoshic hai — Ayurveda mein sabke liye beneficial maani jaati hai! ✨",
  "Ghee mein fat soluble vitamins A, D, E aur K hote hain! 🧈",
  "Makhana (fox nuts) mein fat bahut kam hota hai aur protein achha hota hai! 🌰",
  "Dabur 1884 mein establish hua — India ki oldest FMCG company hai! 🌿",
  "Green tea mein coffee se kam caffeine hota hai! 🍵",
  "ITC ka Sunfeast brand 2003 mein launch hua tha! 🍪",
  "Nestle 150+ saal se zyada purani company hai! 📅",
];

// ─── Category Alternatives ───────────────────────────────────────────────────

const CATEGORY_ALTERNATIVES: Record<string, { home: string[]; homeReasons: string[]; shop: string[]; shopReasons: string[] }> = {
  "instant noodles": {
    home: ["Daliya upma", "Poha"],
    homeReasons: ["10 min mein ready, fiber zyada, sodium kam!", "Halka aur healthy — pet bhi bhar jayega!"],
    shop: ["Bambino Atta Noodles", "Sunfeast Yippee Atta Noodles"],
    shopReasons: ["Atta based hai — maida se better!", "Same price, zyada fiber!"],
  },
  "biscuits": {
    home: ["Ragi cookies ghar pe", "Oats ke ladoo"],
    homeReasons: ["Ragi se calcium milta hai!", "No maida, natural sweetener use karo!"],
    shop: ["Britannia NutriChoice 5 Grain", "Digestive Biscuits"],
    shopReasons: ["Multigrain — fiber zyada!", "Oats based — better for digestion!"],
  },
  "chips & snacks": {
    home: ["Roasted chana", "Makhana with salt"],
    homeReasons: ["High protein, zero maida — best snack!", "Low fat, crunchy — same feel!"],
    shop: ["Haldiram's Moong Dal", "Too Yumm Baked Chips"],
    shopReasons: ["Protein rich namkeen!", "Baked hai — fried se better!"],
  },
  "namkeen & snacks": {
    home: ["Roasted chana", "Bhuna makhana"],
    homeReasons: ["High protein snack!", "Low calorie, crunchy!"],
    shop: ["Haldiram's Moong Dal", "Too Yumm Baked"],
    shopReasons: ["Better than fried namkeen!", "Baked option!"],
  },
  "chocolate": {
    home: ["Dates aur dry fruits", "Kela with peanut butter"],
    homeReasons: ["Natural sugar, fiber bhi!", "Natural energy boost!"],
    shop: ["Amul Dark Chocolate 70%", "Cadbury Bournville"],
    shopReasons: ["Antioxidants zyada, sugar kam!", "Dark chocolate — better choice!"],
  },
  "beverages": {
    home: ["Nimbu paani with kala namak", "Jaljeera"],
    homeReasons: ["Natural electrolytes, zero artificial sugar!", "Digestive bhi hai — desi classic!"],
    shop: ["Coconut water", "Real Fruit Power"],
    shopReasons: ["Natural hydration!", "Less sugar than cola!"],
  },
  "dairy": {
    home: ["Ghar ka dahi", "Chaas with jeera"],
    homeReasons: ["Fresh probiotics, no preservatives!", "Digestive drink — Ayurveda approved!"],
    shop: ["Amul Dahi", "Amul Lassi (plain)"],
    shopReasons: ["Good probiotic source!", "Better than sugary drinks!"],
  },
  "health drinks": {
    home: ["Haldi doodh (golden milk)", "Sattu drink"],
    homeReasons: ["Anti-inflammatory, natural immunity boost!", "High protein, desi superfood!"],
    shop: ["Amul Kool Kesar", "Complan Natural"],
    shopReasons: ["Less sugar than Horlicks!", "Better protein source!"],
  },
  "packaged tea": {
    home: ["Adrak tulsi chai", "Green tea ghar pe"],
    homeReasons: ["Immunity boost — dadi ka nuskha!", "Antioxidants zyada, caffeine kam!"],
    shop: ["Tata Tea Gold", "Lipton Green Tea"],
    shopReasons: ["Good quality tea!", "Healthier than milk tea packets!"],
  },
  "breakfast cereals": {
    home: ["Oats with fruits", "Daliya with milk"],
    homeReasons: ["High fiber, no added sugar!", "Traditional superfood!"],
    shop: ["Quaker Oats", "Saffola Oats"],
    shopReasons: ["Plain oats — no sugar added!", "Good fiber source!"],
  },
  "ready to eat": {
    home: ["Dal chawal ghar pe", "Khichdi"],
    homeReasons: ["Fresh, no preservatives — body happy!", "One pot meal — healthy aur simple!"],
    shop: ["MTR Oats Upma", "Gits Upma Mix"],
    shopReasons: ["Less preservatives than others!", "Quick and healthier option!"],
  },
  "sauces & ketchup": {
    home: ["Ghar ka tamatar chutney", "Hari chutney"],
    homeReasons: ["No preservatives, fresh taste!", "Mint-coriander — digestive bhi!"],
    shop: ["Kissan Mixed Fruit Jam (less sugar)", "Dr. Oetker Veeba"],
    shopReasons: ["Less sugar than regular ketchup!", "Better ingredient list!"],
  },
  "bread & bakery": {
    home: ["Multigrain atta roti", "Oats roti"],
    homeReasons: ["Fresh, no preservatives — best option!", "High fiber, healthy!"],
    shop: ["Britannia Brown Bread", "Harvest Gold Brown"],
    shopReasons: ["Fiber zyada than white bread!", "Whole wheat option!"],
  },
  "juices": {
    home: ["Fresh nimbu paani", "Ghar ka fresh juice"],
    homeReasons: ["Real fruit, no concentrate, no sugar!", "100% natural — no comparison!"],
    shop: ["Raw Pressery", "B Natural"],
    shopReasons: ["No concentrate, real fruit!", "Less added sugar!"],
  },
  "ice cream": {
    home: ["Banana nice cream", "Dahi with fruits"],
    homeReasons: ["Blend frozen banana — natural ice cream!", "Probiotic + natural sweet!"],
    shop: ["Amul Sugar Free", "Kwality Walls Cornetto Light"],
    shopReasons: ["Less sugar option!", "Lower calorie choice!"],
  },
  "cooking oils": {
    home: ["Sarson ka tel", "Nariyal tel"],
    homeReasons: ["Traditional Indian oil — heart friendly!", "Natural, good fats!"],
    shop: ["Saffola Gold", "Fortune Kachi Ghani"],
    shopReasons: ["Blended oil — better fat profile!", "Cold pressed — nutrients preserve!"],
  },
  "frozen foods": {
    home: ["Ghar ke parathe", "Fresh sabzi"],
    homeReasons: ["No preservatives, fresh atta!", "Fresh is always best!"],
    shop: ["ITC Aashirvaad Paratha", "Sumeru Paneer"],
    shopReasons: ["Better than most frozen options!", "Good quality frozen!"],
  },
  "baby food": {
    home: ["Ghar ka daliya", "Mashed banana"],
    homeReasons: ["Fresh, no preservatives — best for baby!", "Natural, easy to digest!"],
    shop: ["Organic India Baby", "Slurrp Farm"],
    shopReasons: ["Organic option!", "Clean ingredients for baby!"],
  },
  "protein & fitness": {
    home: ["Sattu shake", "Dahi with banana"],
    homeReasons: ["Desi protein — no additives!", "Natural protein + potassium!"],
    shop: ["Muscleblaze Biozyme", "Amway Nutrilite"],
    shopReasons: ["Good protein quality!", "Trusted brand!"],
  },
  "spices & masala": {
    home: ["Ghar ke whole spices", "Fresh haldi"],
    homeReasons: ["Whole spices grind karo — zyada fresh!", "Fresh haldi mein curcumin zyada!"],
    shop: ["Organic India Turmeric", "24 Mantra Organic"],
    shopReasons: ["Organic option!", "No artificial colors!"],
  },
  "personal care": {
    home: ["Neem paste for teeth", "Coconut oil"],
    homeReasons: ["Traditional desi nuskha!", "Natural moisturizer!"],
    shop: ["Patanjali Dant Kanti", "Himalaya"],
    shopReasons: ["Natural herbal ingredients!", "Trusted natural brand!"],
  },
};

// ─── FSSAI Grading ───────────────────────────────────────────────────────────

function calculateFSSAIGrade(nutrition: NutriInfo): { grade: string; points: number } {
  let points = 0;

  const sodium = nutrition.sodium ?? (nutrition.salt ? nutrition.salt * 400 : 0);
  const sugar = nutrition.sugars ?? 0;
  const fat = nutrition.fat ?? 0;
  const satFat = nutrition.saturatedFat ?? fat * 0.4;
  const calories = nutrition.calories ?? 0;
  const protein = nutrition.protein ?? 0;
  const fiber = nutrition.fiber ?? 0;

  // Negative (bad) points
  if (sodium > 800) points += 4;
  else if (sodium > 600) points += 3;
  else if (sodium > 400) points += 2;
  else if (sodium > 200) points += 1;

  if (sugar > 27) points += 4;
  else if (sugar > 22.5) points += 3;
  else if (sugar > 15) points += 2;
  else if (sugar > 5) points += 1;

  if (satFat > 10) points += 3;
  else if (satFat > 5) points += 2;
  else if (satFat > 3) points += 1;

  if (calories > 500) points += 3;
  else if (calories > 400) points += 2;
  else if (calories > 200) points += 1;

  // Positive (good) points — subtract
  if (protein > 10) points -= 2;
  else if (protein > 5) points -= 1;

  if (fiber > 5) points -= 2;
  else if (fiber > 2) points -= 1;

  points = Math.max(0, points);

  let grade = "A";
  if (points >= 14) grade = "E";
  else if (points >= 10) grade = "D";
  else if (points >= 6) grade = "C";
  else if (points >= 3) grade = "B";
  else grade = "A";

  return { grade, points };
}

// ─── Health Warnings ─────────────────────────────────────────────────────────

function getHealthWarnings(nutrition: NutriInfo): string[] {
  const warnings: string[] = [];
  const sodium = nutrition.sodium ?? (nutrition.salt ? nutrition.salt * 400 : 0);
  const sugar = nutrition.sugars ?? 0;
  const fat = nutrition.fat ?? 0;
  const calories = nutrition.calories ?? 0;
  const satFat = nutrition.saturatedFat ?? fat * 0.4;

  if (sugar > 15) warnings.push("🩺 Diabetes walo ke liye — avoid karo yaar!");
  if (sodium > 600) warnings.push("❤️ BP patients — khatre ki ghanti! Sodium bahut zyada hai!");
  if (calories > 400 && fat > 15) warnings.push("⚖️ Weight loss mein ho? Yeh skip karo bhai!");
  if (satFat > 5) warnings.push("🫀 Heart patients — saturated fat zyada hai, dhyan rakho!");
  if (sugar > 22) warnings.push("🦷 Bacchon ko limit mein do — teeth ke liye bhi bura!");

  return warnings;
}

// ─── Swadeshi Score ──────────────────────────────────────────────────────────

const SWADESHI_BRANDS: Record<string, number> = {
  "amul": 100, "tata": 95, "parle": 95, "britannia": 85, "haldiram": 100,
  "dabur": 100, "patanjali": 100, "marico": 90, "itc": 90, "godrej": 85,
  "nestlé": 20, "nestle": 20, "pepsico": 10, "pepsi": 10, "coca-cola": 10,
  "coca cola": 10, "unilever": 15, "hindustan unilever": 30, "hul": 30,
  "reckitt": 10, "kellogg": 10, "mondelez": 10, "cadbury": 15,
};

function getSwadeshiScore(brand?: string): { score: number; label: string; emoji: string } {
  if (!brand) return { score: 50, label: "Pata nahi", emoji: "🤷" };
  const b = brand.toLowerCase();
  for (const [key, score] of Object.entries(SWADESHI_BRANDS)) {
    if (b.includes(key)) {
      if (score >= 90) return { score, label: "Pure Desi! Jai Hind!", emoji: "🇮🇳" };
      if (score >= 70) return { score, label: "Mostly Swadeshi — achha hai!", emoji: "🇮🇳" };
      if (score >= 40) return { score, label: "Half desi half videshi", emoji: "🤝" };
      return { score, label: "Zyaadatar Videshi", emoji: "🌍" };
    }
  }
  return { score: 60, label: "Indian mein bana", emoji: "🇮🇳" };
}

// ─── Veg Detection from OFF ──────────────────────────────────────────────────

function detectVegStatus(labels: string[], ingredients: string): { isVeg: boolean | null; isVegan: boolean } {
  const labelsStr = labels.join(" ").toLowerCase();
  const ingStr = ingredients.toLowerCase();

  const nonVegIngredients = ["gelatin", "gelatine", "lard", "tallow", "rennet", "chicken", "beef", "pork", "fish", "shrimp", "anchovy"];
  const hasNonVeg = nonVegIngredients.some(i => ingStr.includes(i));

  if (labelsStr.includes("en:vegan") || labelsStr.includes("vegan")) {
    return { isVeg: true, isVegan: true };
  }
  if (labelsStr.includes("en:vegetarian") || labelsStr.includes("vegetarian")) {
    return { isVeg: true, isVegan: false };
  }
  if (hasNonVeg) return { isVeg: false, isVegan: false };

  return { isVeg: null, isVegan: false };
}

// ─── OFF API Fetch ────────────────────────────────────────────────────────────

async function fetchFromOFF(barcode: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();

    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const nutriments = p.nutriments || {};

    const nutrition: NutriInfo = {
      calories: nutriments["energy-kcal_100g"] ?? nutriments["energy-kcal"] ?? undefined,
      fat: nutriments["fat_100g"] ?? undefined,
      sugars: nutriments["sugars_100g"] ?? undefined,
      salt: nutriments["salt_100g"] ?? undefined,
      sodium: nutriments["sodium_100g"] ? nutriments["sodium_100g"] * 1000 : undefined,
      protein: nutriments["proteins_100g"] ?? undefined,
      fiber: nutriments["fiber_100g"] ?? undefined,
      saturatedFat: nutriments["saturated-fat_100g"] ?? undefined,
    };

    const labels: string[] = p.labels_tags ?? [];
    const ingredients = p.ingredients_text_en ?? p.ingredients_text ?? "";
    const { isVeg, isVegan } = detectVegStatus(labels, ingredients);

    const { grade, points } = calculateFSSAIGrade(nutrition);
    const swadeshi = getSwadeshiScore(p.brands);

    const categoryRaw = (p.categories ?? "").toLowerCase();
    const alternatives = getCategoryAlternatives(categoryRaw);

    return {
      barcode,
      name: p.product_name_en ?? p.product_name ?? p.abbreviated_product_name ?? "Unknown Product",
      brand: p.brands ?? undefined,
      category: p.categories ?? undefined,
      nutriScore: grade,
      nutriScorePoints: points,
      isVeg,
      isVegan,
      isSwadeshi: swadeshi.score >= 70,
      swadeshiScore: swadeshi.score,
      isUltraProcessed: (p.nova_group ?? 0) >= 4,
      source: "OpenFoodFacts",
      imageUrl: p.image_front_url ?? p.image_url ?? undefined,
      nutrition,
      ingredients,
      tips: generateHinglishTips(nutrition, grade),
      alternatives,
    };
  } catch {
    return null;
  }
}

// ─── Get Category Alternatives ────────────────────────────────────────────────

function getCategoryAlternatives(categoryRaw: string): Alternative[] {
  const result: Alternative[] = [];

  for (const [key, val] of Object.entries(CATEGORY_ALTERNATIVES)) {
    if (categoryRaw.includes(key)) {
      val.home.forEach((name, i) => {
        result.push({ type: "home", name, reason: val.homeReasons[i] ?? "" });
      });
      val.shop.forEach((name, i) => {
        result.push({ type: "shop", name, reason: val.shopReasons[i] ?? "" });
      });
      return result;
    }
  }

  // Default alternatives
  result.push({ type: "home", name: "Ghar ka khana", reason: "Fresh, no preservatives — hamesha best!" });
  result.push({ type: "shop", name: "Local brand dekho", reason: "Ingredients list padho — clean label dhundho!" });
  return result;
}

// ─── Hinglish Tips Generator ─────────────────────────────────────────────────

function generateHinglishTips(nutrition: NutriInfo, grade: string): string[] {
  const tips: string[] = [];
  const sodium = nutrition.sodium ?? (nutrition.salt ? nutrition.salt * 400 : 0);

  if (grade === "E") tips.push("🚨 Yaar yeh toh danga hai sehat ke saath — seriously avoid karo!");
  if (grade === "D") tips.push("⚠️ Kabhi kabhi theek hai — but daily mat khao bhai!");
  if ((nutrition.sugars ?? 0) > 20) tips.push(`🍬 Sugar ${nutrition.sugars}g per 100g — bahut zyada hai yeh!`);
  if (sodium > 600) tips.push(`🧂 Sodium ${Math.round(sodium)}mg — WHO limit 2000mg/din hai, yeh akele kaafi hai!`);
  if ((nutrition.calories ?? 0) > 400) tips.push(`🔥 ${nutrition.calories} calories per 100g — ek portion mein hi zyada ho jayega!`);
  if ((nutrition.protein ?? 0) > 10) tips.push(`💪 Protein ${nutrition.protein}g — yeh toh achha hai!`);
  if ((nutrition.fiber ?? 0) > 5) tips.push(`🌾 Fiber ${nutrition.fiber}g — gut ke liye achi cheez hai!`);

  return tips;
}

// ─── Local DB Fetch ───────────────────────────────────────────────────────────

async function fetchFromLocalDB(barcode: string): Promise<Product | null> {
  try {
    const res = await fetch("/products.json");
    const products: Product[] = await res.json();
    const found = products.find(p => p.barcode === barcode);
    if (!found) return null;

    // Enrich local product with swadeshi score + category alternatives
    const swadeshi = getSwadeshiScore(found.brand);
    const warnings = getHealthWarnings(found.nutrition ?? {});

    let alternatives = found.alternatives as unknown as Alternative[];
    if (!alternatives || alternatives.length === 0) {
      alternatives = getCategoryAlternatives((found.category ?? "").toLowerCase());
    }

    return {
      ...found,
      swadeshiScore: swadeshi.score,
      isSwadeshi: swadeshi.score >= 70,
      alternatives,
      tips: [...(found.tips ?? []), ...warnings],
    };
  } catch {
    return null;
  }
}

// ─── Loading Modes ────────────────────────────────────────────────────────────

function LoadingScreen() {
  const [mode] = React.useState(() => Math.floor(Math.random() * 5));
  const [factIdx] = React.useState(() => Math.floor(Math.random() * FUN_FACTS.length));
  const [msgIdx, setMsgIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [meterVal, setMeterVal] = React.useState(0);

  const hinglishMsgs = [
    "Ingredients check ho rahe hain... 🔍",
    "FSSAI standards se compare kar rahe hain... 📋",
    "Health score calculate ho raha hai... 🧮",
    "Aapke liye best alternative dhundh rahe hain... 🌿",
    "Sach pata kar rahe hain... 💯",
  ];

  React.useEffect(() => {
    if (mode === 2) {
      const t = setInterval(() => setMsgIdx(i => (i + 1) % hinglishMsgs.length), 600);
      return () => clearInterval(t);
    }
    if (mode === 3) {
      const t = setInterval(() => setProgress(p => Math.min(p + 20, 100)), 400);
      return () => clearInterval(t);
    }
    if (mode === 1) {
      const t = setInterval(() => setMeterVal(v => (v >= 4 ? 0 : v + 1)), 300);
      return () => clearInterval(t);
    }
  }, [mode]);

  const grades = ["A", "B", "C", "D", "E"];
  const meterColors = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-6 bg-background">
      {mode === 0 && (
        <>
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-xs text-center">
            <p className="text-xs text-amber-500 font-semibold mb-1">🌟 Kya aap jaante hain?</p>
            <p className="text-amber-800 text-sm leading-relaxed font-medium">{FUN_FACTS[factIdx]}</p>
          </div>
          <p className="text-muted-foreground text-sm">Product scan ho raha hai...</p>
        </>
      )}

      {mode === 1 && (
        <>
          <p className="text-lg font-bold text-center">Health Score Check Ho Raha Hai... 🎯</p>
          <div className="flex gap-2 items-end">
            {grades.map((g, i) => (
              <div key={g} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 rounded-t-lg transition-all duration-300"
                  style={{
                    height: i === meterVal ? "80px" : "40px",
                    backgroundColor: meterColors[i],
                    opacity: i === meterVal ? 1 : 0.3,
                  }}
                />
                <span className="text-xs font-bold" style={{ color: meterColors[i] }}>{g}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">FSSAI ke rules se compare ho raha hai...</p>
        </>
      )}

      {mode === 2 && (
        <>
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-semibold text-center text-primary"
          >
            {hinglishMsgs[msgIdx]}
          </motion.p>
          <p className="text-muted-foreground text-xs">Thoda ruko yaar... 😄</p>
        </>
      )}

      {mode === 3 && (
        <>
          <p className="text-lg font-bold text-center">Checking... 🔍</p>
          <div className="w-full max-w-xs space-y-3">
            {["Barcode read hua ✅", "Product dhundh rahe hain...", "Health score calculate ho raha hai...", "Alternative dhundh rahe hain...", "Almost done..."].map((step, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm transition-all ${progress >= (i + 1) * 20 ? "text-green-600 font-semibold" : "text-muted-foreground"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${progress >= (i + 1) * 20 ? "bg-green-500 text-white" : "bg-muted"}`}>
                  {progress >= (i + 1) * 20 ? "✓" : i + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 4 && (
        <>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-2xl" />
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="w-full h-1 bg-primary/80 shadow-[0_0_12px_3px_rgba(34,197,94,0.6)]"
                style={{ animation: "scan 1.5s ease-in-out infinite" }} />
            </div>
            <span className="text-4xl z-10">📦</span>
          </div>
          <p className="text-base font-semibold text-center">Scanning kar rahe hain... 📷</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-xs text-center">
            <p className="text-amber-800 text-sm">{FUN_FACTS[factIdx]}</p>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `@keyframes scan { 0%,100%{transform:translateY(0)} 50%{transform:translateY(120px)} }` }} />
        </>
      )}
    </div>
  );
}

// ─── Grade Vibe ───────────────────────────────────────────────────────────────

const GRADE_VIBE: Record<string, { headline: string; sub: string; bg: string; text: string; border: string }> = {
  A: { headline: "Ekdum bindaas! ✅", sub: "Khao bina tension ke — full marks wala product hai!", bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  B: { headline: "Theek thaak hai yaar 👍", sub: "Balanced choice — isko regularly kha sakte ho!", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  C: { headline: "Chalta hai par roz mat khana 😐", sub: "Kabhi kabhi theek hai — but daily avoid karo!", bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" },
  D: { headline: "Bhai soch lo ek baar... 😬", sub: "Yeh toh red flag hai 🚩 — healthier switch karo yaar!", bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
  E: { headline: "Yaar yeh toh danga hai sehat ke saath! 🚨", sub: "Body pe direct attack 💀 — seriously avoid karo!", bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Product() {
  const { barcode } = useParams();
  const [, setLocation] = useLocation();
  const { saveToHistory } = useHistory();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!barcode) return;

    setIsLoading(true);
    setNotFound(false);
    setProduct(null);

    (async () => {
      // Step 1: Try local DB first
      let result = await fetchFromLocalDB(barcode);

      // Step 2: If not found locally, try OFF API
      if (!result) {
        result = await fetchFromOFF(barcode);
      }

      if (result) {
        setProduct(result);
        // GA4 tracking
        try {
          gtag("event", "product_viewed", {
            barcode,
            product_name: result.name,
            grade: result.nutriScore,
            source: result.source ?? "local",
          });
        } catch {}
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    })();
  }, [barcode]);

  const handleSave = () => {
    if (product) {
      saveToHistory(product);
      toast.success("✅ History mein save ho gaya!");
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (notFound || !product) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold">Product nahi mila! 😔</h2>
        <p className="text-muted-foreground text-sm mb-1">
          Barcode <span className="font-mono font-bold">{barcode}</span> hamare database aur Open Food Facts mein bhi nahi hai.
        </p>
        <p className="text-muted-foreground text-xs">Dusra product try karo ya barcode manually type karo!</p>
        <Button onClick={() => setLocation("/scan")} className="w-full max-w-xs bg-primary mt-2">
          Dobara Scan Karo 📷
        </Button>
      </div>
    );
  }

  const grade = (product.nutriScore ?? "C").toUpperCase();
  const vibe = GRADE_VIBE[grade] ?? GRADE_VIBE["C"];
  const isUnhealthy = grade === "C" || grade === "D" || grade === "E";
  const swadeshi = getSwadeshiScore(product.brand);
  const healthWarnings = getHealthWarnings(product.nutrition ?? {});

  const homeAlts = (product.alternatives ?? []).filter(a => a.type === "home");
  const shopAlts = (product.alternatives ?? []).filter(a => a.type === "shop");

  return (
    <div className="flex flex-col bg-background overflow-auto pb-8">

      {/* ── Header ── */}
      <div className="relative bg-muted/30 pt-16 pb-12 px-6 flex flex-col items-center">
        <Button
          variant="ghost" size="icon"
          className="absolute top-4 left-4 bg-background/60 backdrop-blur-md rounded-full"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft />
        </Button>

        <div className="w-36 h-36 bg-card rounded-2xl shadow-sm border p-2 flex items-center justify-center mb-5 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-5xl">🛒</span>
          )}
        </div>

        <h1 className="text-xl font-bold text-center mb-1 leading-snug">{product.name}</h1>
        <p className="text-muted-foreground text-sm text-center">{product.brand ?? "Brand Unknown"}</p>

        {product.source === "OpenFoodFacts" && (
          <p className="text-xs text-muted-foreground mt-1 opacity-60">via Open Food Facts 🌍</p>
        )}

        <div className="absolute -bottom-12 shadow-xl">
          <NutriScore score={product.nutriScore} points={product.nutriScorePoints} size="xl" showPoints />
        </div>
      </div>

      {/* ── SCROLL 1: Grade + Badges + Nutrition + Health Warnings ── */}
      <div className="px-4 pt-16 space-y-5">

        {/* Grade Vibe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl p-4 border ${vibe.bg} ${vibe.border}`}
        >
          <p className={`font-bold text-base ${vibe.text}`}>{vibe.headline}</p>
          <p className={`text-sm mt-0.5 ${vibe.text} opacity-80`}>{vibe.sub}</p>
        </motion.div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {product.isVeg !== null && product.isVeg !== undefined && (
            <Badge variant="outline" className={product.isVeg
              ? "border-green-500 text-green-700 bg-green-50"
              : "border-red-500 text-red-700 bg-red-50"}>
              <div className={`w-2 h-2 rounded-full mr-1.5 ${product.isVeg ? "bg-green-600" : "bg-red-600"}`} />
              {product.isVeg ? "Veg 🌿" : "Non-Veg 🍗"}
            </Badge>
          )}
          {product.isVegan && (
            <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
              <Leaf size={11} className="mr-1" /> Vegan 🌱
            </Badge>
          )}
          <Badge variant="outline" className={
            swadeshi.score >= 90 ? "border-orange-500 text-orange-700 bg-orange-50" :
            swadeshi.score >= 60 ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
            "border-gray-400 text-gray-600 bg-gray-50"
          }>
            {swadeshi.emoji} {swadeshi.label} ({swadeshi.score}%)
          </Badge>
          {product.isUltraProcessed && (
            <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
              <AlertTriangle size={11} className="mr-1" /> Ultra-Processed ⚠️
            </Badge>
          )}
        </div>

        {/* Nutrition */}
        <section>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
            <Info size={17} className="text-primary" />
            Kya hai andar? 👀 (per 100g)
          </h3>
          <div className="space-y-2">
            <TrafficLight label="Calories 🔥" value={product.nutrition?.calories ?? null} level={getTrafficLevel(product.nutrition?.calories, "calories")} unit=" kcal" />
            <TrafficLight label="Sugar (Cheeni) 🍬" value={product.nutrition?.sugars ?? null} level={getTrafficLevel(product.nutrition?.sugars, "sugar")} />
            <TrafficLight label="Fat (Chiknaai) 🫙" value={product.nutrition?.fat ?? null} level={getTrafficLevel(product.nutrition?.fat, "fat")} />
            <TrafficLight label="Salt (Namak) 🧂" value={product.nutrition?.salt ?? null} level={getTrafficLevel(product.nutrition?.salt, "salt")} />
            {product.nutrition?.protein != null && (
              <TrafficLight label="Protein 💪" value={product.nutrition.protein} level="low" />
            )}
            {product.nutrition?.fiber != null && (
              <TrafficLight label="Fiber 🌾" value={product.nutrition.fiber} level="low" />
            )}
          </div>
        </section>

        {/* Health Warnings */}
        {healthWarnings.length > 0 && (
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <AlertTriangle size={17} className="text-red-500" />
              Health Alert 🚨
            </h3>
            <div className="space-y-2">
              {healthWarnings.map((w, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-800 font-medium">
                  {w}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tips */}
        {product.tips && product.tips.filter(t => !healthWarnings.includes(t)).length > 0 && (
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <Sparkles size={17} className="text-amber-500" />
              Nutrio Ki Salah 🧠
            </h3>
            <div className="space-y-2">
              {product.tips.filter(t => !healthWarnings.includes(t)).map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-3 rounded-xl text-sm leading-relaxed border bg-amber-50 border-amber-100 text-amber-900">
                  {tip}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Ingredients */}
        {product.ingredients && (
          <section>
            <h3 className="font-semibold mb-2 text-base">Ingredients 🧪</h3>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-3">
              {product.ingredients}
            </p>
          </section>
        )}

        {/* Ayurvedic Note */}
        {product.ayurvedicNote && (
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <FlameKindling size={17} className="text-orange-500" />
              Ayurvedic Nazar Se 🌿
            </h3>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm text-orange-900 leading-relaxed">
              {product.ayurvedicNote}
            </div>
          </section>
        )}
      </div>

      {/* ── SCROLL 2: Alternatives ── */}
      {isUnhealthy && (homeAlts.length > 0 || shopAlts.length > 0) && (
        <div className="px-4 mt-5 space-y-4">
          <div className={`rounded-2xl overflow-hidden border ${grade === "E" ? "border-red-200" : "border-orange-200"}`}>
            <div className={`px-4 py-3 flex items-center gap-2 ${grade === "E" ? "bg-red-500" : "bg-orange-500"}`}>
              <RefreshCw size={18} className="text-white" />
              <div>
                <p className="font-bold text-white text-base">Healthier Switch Kar! 🔄</p>
                <p className="text-white/80 text-xs">Inhe try karo yaar — body khush ho jayegi!</p>
              </div>
            </div>

            <div className="bg-white divide-y divide-gray-100">
              {homeAlts.length > 0 && (
                <div className="px-4 py-3">
                  <p className="text-xs font-bold text-green-700 mb-2">🏠 Ghar Pe Banao:</p>
                  {homeAlts.map((alt, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm font-semibold">{alt.name}</p>
                      <p className="text-xs text-green-700">{alt.reason}</p>
                    </div>
                  ))}
                </div>
              )}
              {shopAlts.length > 0 && (
                <div className="px-4 py-3">
                  <p className="text-xs font-bold text-blue-700 mb-2">🛒 Shop Se Uthao:</p>
                  {shopAlts.map((alt, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm font-semibold">{alt.name}</p>
                      <p className="text-xs text-blue-700">{alt.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-3 border-t pt-5">
        <Button variant="outline" onClick={handleSave} className="h-14 font-medium">
          <Save className="mr-2" size={18} /> Save Karo 📌
        </Button>
        <Button onClick={() => setLocation("/scan")} className="h-14 font-medium bg-primary">
          <ScanLine className="mr-2" size={18} /> Aur Scan Karo
        </Button>
      </div>
    </div>
  );
}

function getTrafficLevel(value: number | undefined | null, type: string): "low" | "medium" | "high" {
  if (value == null) return "medium";
  if (type === "sugar") return value > 22.5 ? "high" : value > 5 ? "medium" : "low";
  if (type === "fat") return value > 17.5 ? "high" : value > 3 ? "medium" : "low";
  if (type === "salt") return value > 1.5 ? "high" : value > 0.3 ? "medium" : "low";
  if (type === "calories") return value > 400 ? "high" : value > 100 ? "medium" : "low";
  return "low";
}
