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

  if (nutriScore === "A" || nutriScore === "B") {
    tips.push("Yeh product bahut healthy hai! Isko apni diet mein zaroor shamil karo.");
  }
  if (nutriScore === "D" || nutriScore === "E") {
    tips.push("Yeh product occasionally hi khao — regular diet mein avoid karo.");
  }

  const salt = nutrition.salt ?? (nutrition.sodium ? nutrition.sodium / 400 : 0);
  if (salt > 1.5) {
    tips.push("Namak zyada hai — blood pressure ke patients soche phir khayein.");
  }

  if ((nutrition.sugars ?? 0) > 22.5) {
    tips.push("Sugar bahut zyada hai — diabetes patients ke liye suitable nahi.");
  }

  if ((nutrition.fiber ?? 0) >= 6) {
    tips.push("Fiber ka achha source hai — digestion ke liye bahut accha!");
  }

  if ((nutrition.protein ?? 0) >= 10) {
    tips.push("Protein se bharpur hai — workout ke baad ek accha choice!");
  }

  if ((nutrition.saturatedFat ?? 0) > 5) {
    tips.push("Saturated fat zyada hai — heart health ke liye kam khaana better hai.");
  }

  if (tips.length === 0) {
    tips.push("Balanced diet ke hisse ke roop mein theek hai — portion size dhyan rakho.");
  }

  return tips;
}
