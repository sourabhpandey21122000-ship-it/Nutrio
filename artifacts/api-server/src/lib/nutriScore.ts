interface Nutrition {
  calories?: number | null;
  fat?: number | null;
  saturatedFat?: number | null;
  carbohydrates?: number | null;
  sugars?: number | null;
  fiber?: number | null;
  protein?: number | null;
  salt?: number | null;
  sodium?: number | null;
}

function getEnergyPoints(kcal: number): number {
  if (kcal <= 335) return 0;
  if (kcal <= 670) return 1;
  if (kcal <= 1005) return 2;
  if (kcal <= 1340) return 3;
  if (kcal <= 1675) return 4;
  if (kcal <= 2010) return 5;
  if (kcal <= 2345) return 6;
  if (kcal <= 2680) return 7;
  if (kcal <= 3015) return 8;
  if (kcal <= 3350) return 9;
  return 10;
}

function getSaturatedFatPoints(g: number): number {
  if (g <= 1) return 0;
  if (g <= 2) return 1;
  if (g <= 3) return 2;
  if (g <= 4) return 3;
  if (g <= 5) return 4;
  if (g <= 6) return 5;
  if (g <= 7) return 6;
  if (g <= 8) return 7;
  if (g <= 9) return 8;
  if (g <= 10) return 9;
  return 10;
}

function getSugarsPoints(g: number): number {
  if (g <= 4.5) return 0;
  if (g <= 9) return 1;
  if (g <= 13.5) return 2;
  if (g <= 18) return 3;
  if (g <= 22.5) return 4;
  if (g <= 27) return 5;
  if (g <= 31) return 6;
  if (g <= 36) return 7;
  if (g <= 40) return 8;
  if (g <= 45) return 9;
  return 10;
}

function getSodiumPoints(mg: number): number {
  if (mg <= 90) return 0;
  if (mg <= 180) return 1;
  if (mg <= 270) return 2;
  if (mg <= 360) return 3;
  if (mg <= 450) return 4;
  if (mg <= 540) return 5;
  if (mg <= 630) return 6;
  if (mg <= 720) return 7;
  if (mg <= 810) return 8;
  if (mg <= 900) return 9;
  return 10;
}

function getFiberPoints(g: number): number {
  if (g <= 0.9) return 0;
  if (g <= 1.9) return 1;
  if (g <= 2.8) return 2;
  if (g <= 3.7) return 3;
  if (g <= 4.7) return 4;
  return 5;
}

function getProteinPoints(g: number): number {
  if (g <= 1.6) return 0;
  if (g <= 3.2) return 1;
  if (g <= 4.8) return 2;
  if (g <= 6.4) return 3;
  if (g <= 8.0) return 4;
  return 5;
}

export function calculateNutriScore(nutrition: Nutrition): string {
  return calculateNutriScoreWithPoints(nutrition).grade;
}

export function calculateNutriScoreWithPoints(nutrition: Nutrition): { grade: string; points: number } {
  const calories = nutrition.calories ?? 0;
  const saturatedFat = nutrition.saturatedFat ?? 0;
  const sugars = nutrition.sugars ?? 0;
  const sodiumMg = nutrition.sodium ?? (nutrition.salt ? nutrition.salt * 400 : 0);
  const fiber = nutrition.fiber ?? 0;
  const protein = nutrition.protein ?? 0;

  const negativePoints =
    getEnergyPoints(calories) +
    getSaturatedFatPoints(saturatedFat) +
    getSugarsPoints(sugars) +
    getSodiumPoints(sodiumMg);

  const positivePoints = getFiberPoints(fiber) + getProteinPoints(protein);

  const rawScore = negativePoints - positivePoints;

  let grade: string;
  if (rawScore <= -1) grade = "A";
  else if (rawScore <= 2) grade = "B";
  else if (rawScore <= 10) grade = "C";
  else if (rawScore <= 18) grade = "D";
  else grade = "E";

  // Map raw score (-10 to +40) → health score (100 to 0, higher = healthier)
  const points = Math.max(0, Math.min(100, Math.round(((40 - rawScore) / 50) * 100)));

  return { grade, points };
}

export function getTrafficLightLevel(
  type: "fat" | "sugar" | "salt" | "calories",
  valuePer100g: number | null
): "low" | "medium" | "high" {
  if (valuePer100g === null) return "low";

  const thresholds: Record<string, [number, number]> = {
    fat: [3, 17.5],
    sugar: [5, 22.5],
    salt: [0.3, 1.5],
    calories: [100, 400],
  };

  const [low, high] = thresholds[type];
  if (valuePer100g <= low) return "low";
  if (valuePer100g <= high) return "medium";
  return "high";
}

export function buildTrafficLights(nutrition: Nutrition) {
  const fat = nutrition.fat ?? null;
  const sugar = nutrition.sugars ?? null;
  const salt = nutrition.salt ?? (nutrition.sodium ? nutrition.sodium / 400 : null);
  const calories = nutrition.calories ?? null;

  return {
    fat: {
      level: getTrafficLightLevel("fat", fat),
      label: "Fat",
      value: fat,
    },
    sugar: {
      level: getTrafficLightLevel("sugar", sugar),
      label: "Sugar",
      value: sugar,
    },
    salt: {
      level: getTrafficLightLevel("salt", salt),
      label: "Salt",
      value: salt,
    },
    calories: {
      level: getTrafficLightLevel("calories", calories),
      label: "Calories",
      value: calories,
    },
  };
}

export function generateHealthTips(nutriScore: string, nutrition: Nutrition): string[] {
  const tips: string[] = [];

  if (nutriScore === "A") {
    tips.push("💚 Wah! Ekdum solid choice hai! Isko regularly khao — body aur mind dono kush rahenge.");
  } else if (nutriScore === "B") {
    tips.push("👍 Acchi choice hai bhai! Balanced diet ka perfect hissa ban sakta hai yeh.");
  } else if (nutriScore === "C") {
    tips.push("⚠️ Theek-thaak hai, lekin roz-roz mat khao. Week mein 2-3 baar se zyada nahi.");
  } else if (nutriScore === "D") {
    tips.push("🚨 Yaar, yeh sehat ke liye sahi nahi hai. Kabhi-kabhi thoda theek, lekin daily bilkul avoid karo.");
  } else {
    tips.push("🛑 Bhai ruk ja! Yeh product body ke liye nuksaan-deh hai. Iska healthier alternative dhundo.");
  }

  const salt = nutrition.salt ?? (nutrition.sodium ? nutrition.sodium / 400 : 0);
  if (salt > 1.5) {
    tips.push("🧂 Namak ki matra bahut zyada hai — BP wale log bilkul door rahein! Har din 5g se kam namak lena chahiye.");
  } else if (salt > 0.3) {
    tips.push("🧂 Thoda namak hai — din bhar aur zyada salty cheezein avoid karo iske saath.");
  }

  if ((nutrition.sugars ?? 0) > 22.5) {
    tips.push("🍭 Cheeni ki matra alarm-level par hai! Diabetes ya pre-diabetes mein strictly avoid karo. Blood sugar spike guaranteed.");
  } else if ((nutrition.sugars ?? 0) > 5) {
    tips.push("🍬 Sugar moderate level par hai — meetha khane ki craving satisfy karta hai, lekin limit mein raho.");
  }

  if ((nutrition.saturatedFat ?? 0) > 10) {
    tips.push("❤️ Saturated fat bahut zyada hai — heart disease ka risk badhta hai. Roz khana dangerous ho sakta hai.");
  } else if ((nutrition.saturatedFat ?? 0) > 5) {
    tips.push("🫀 Saturated fat thoda high hai — heart ke liye dhyan rakhna zaroori hai.");
  }

  if ((nutrition.fiber ?? 0) >= 6) {
    tips.push("🌾 Fiber ka zabardast source! Pet saaf, digestion smooth aur cholesterol control — trifecta!");
  } else if ((nutrition.fiber ?? 0) < 1 && (nutrition.calories ?? 0) > 200) {
    tips.push("📉 Fiber bilkul nahi hai — alag se fruits, veggies ya dals khakar fiber poori karo.");
  }

  if ((nutrition.protein ?? 0) >= 10) {
    tips.push("💪 Protein se mast loaded hai! Muscles ke liye, workout ke baad, ya active logon ke liye best.");
  }

  if ((nutrition.calories ?? 0) > 450) {
    tips.push("🔥 Calories bahut high hain — ek choti serving mein hi din ka bada hissa khatam. Portion size strictly control karo!");
  }

  return tips;
}

const AYURVEDIC_MAP: Array<{ match: RegExp; note: string }> = [
  {
    match: /ghee|cow ghee/i,
    note: "✨ Desi Ghee Ayurveda ka 'Amrit' hai! Agni (digestive fire) ko strengthen karta hai, brain function improve karta hai aur Vata-Pitta dono ko balance karta hai. Roz subah khaali peth ek chammach lena faydemand hai.",
  },
  {
    match: /dairy|milk|doodh|paneer|curd|yogurt|doi/i,
    note: "🐄 Ayurveda mein dairy ko 'Satvik aahar' maana jaata hai — pure aur consciousness-enhancing. Doodh Vata aur Pitta ko shant karta hai. Kapha prakriti waale log (weight gain-prone) moderation mein lein. Raat ko warm milk Ojas badhata hai.",
  },
  {
    match: /spice|masala|garam masala|haldi|turmeric|jeera|coriander/i,
    note: "🌶️ Masale Ayurvedic 'Dravyaguna Shastra' ke superhero hain! Haldi (curcumin) anti-inflammatory, jeera Agni badhata hai, kali mirch bioavailability improve karta hai. Roz khana banana mein inhe zaroor shamil karo.",
  },
  {
    match: /tea|chai/i,
    note: "☕ Chai Ayurveda mein 'Ushna Virya' (hot potency) wali hai — body warm aur alert rakhti hai. Adrak-elaichi-tulsi wali chai Vata-Kapha ke liye best. Pitta prakriti wale (acidity-prone) zyada mat piyo — din mein 2 cup kaafi.",
  },
  {
    match: /coffee/i,
    note: "☕ Coffee 'Tikta-Ushna' (bitter-hot) hai Ayurveda mein. Vata badhati hai aur excess mein anxiety deti hai. Pitta types avoid karein. Subah ek cup theek hai — baaki din herbal teas prefer karo.",
  },
  {
    match: /whole wheat|atta|wheat flour|aashirvaad/i,
    note: "🌾 Gehun (whole wheat) Ayurveda mein 'Brimhana' hai — strength aur nourishment deta hai. Whole wheat maida se hamesha superior — Agni smooth chalata hai aur constipation se bachata hai. Apni roti ka atta healthy rehna chahiye.",
  },
  {
    match: /refined|maida|instant noodles|processed/i,
    note: "⚠️ Refined flour (maida) Ayurveda mein 'Abhishyandi' hai — body mein 'Ama' (toxins) create karta hai. Digestion slow karta hai, Kapha badhata hai aur long-term mein tridosha disturb karta hai. Whole grain alternatives choose karo.",
  },
  {
    match: /oil|sunflower|palm|refined oil/i,
    note: "💧 Ayurveda mein tel ka choice prakriti ke hisab se hota hai: Sarson ka tel Vata ke liye (warming), Coconut tel Pitta ke liye (cooling), Sunflower moderate sabke liye. Cold-pressed oils refined se hamesha better hain.",
  },
  {
    match: /juice|fruit juice/i,
    note: "🍹 Packed juice mein 'Prana Shakti' (life energy) fresh fruit se bahut kam hoti hai — processing mein nutrients aur enzymes toot jaate hain. Ayurveda kehta hai fresh cut fruit khao, juice nahi. Agar peena hi hai toh ghar ka taaza nikala piyo.",
  },
  {
    match: /dark chocolate|cocoa/i,
    note: "🍫 Dark chocolate 'Tikta rasa' (bitter taste) wali hai — Ayurveda mein bitter taste liver cleanse karta hai aur Pitta-Kapha balance karta hai. 70%+ cocoa wala dark chocolate mein antioxidants aur magnesium hain. Thoda roz OK hai.",
  },
  {
    match: /chocolate|candy|sweet/i,
    note: "🍬 Meetha khaana 'Madhura rasa' se relate karta hai Ayurveda mein — thoda kaafi zyada Kapha badhata hai, lethargy aur weight gain ho sakta hai. Natural sweeteners jaise khajoor, gur prefer karo refined sugar ki jagah.",
  },
  {
    match: /biscuit|cookie|cracker/i,
    note: "🍪 Biscuits mein maida + sugar + trans fat ka combination Ayurveda mein 'Viruddha Aahar' (incompatible food) jaisa effect deta hai. Agni ko kamzor karta hai aur Ama create karta hai. Khakhara, makhana ya dry fruits better snack options hain.",
  },
  {
    match: /chips|namkeen|sev|bhujia|snack|kurkure|lays/i,
    note: "🧂 Fried namkeen Ayurveda mein 'Guru-Ruksha' (heavy-drying) hai — Vata badhata hai aur digestive fire ko overload karta hai. Makhana (fox nuts) ya roasted chana bahut healthier snack alternatives hain.",
  },
  {
    match: /papad/i,
    note: "🌱 Papad urad dal se bana hota hai jo protein aur fiber ka achha source hai. Ayurveda mein urad 'Brimhana' (nourishing) hai. Roasted papad fried se better — Vata shant karta hai aur digestion mein help karta hai.",
  },
];

export function getAyurvedicNote(
  category: string | null,
  ingredients: string | null,
  name: string
): string {
  const searchText = `${name} ${category ?? ""} ${ingredients ?? ""}`;

  for (const { match, note } of AYURVEDIC_MAP) {
    if (match.test(searchText)) return note;
  }

  return "🌿 Ayurveda kehta hai: 'Pathya' (suitable food) woh hai jo aapki prakriti (body type) aur Agni (digestive strength) ke hisab se sahi ho. Hamesha apni body ki sunno — koi bhi food zyada maat khao.";
}
