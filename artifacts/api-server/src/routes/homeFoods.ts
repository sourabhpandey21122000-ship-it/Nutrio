import { Router, type IRouter } from "express";
import {
  ListIngredientsResponse,
  ListDishesResponse,
  AnalyzeHomeMealBody,
  AnalyzeHomeMealResponse,
} from "@workspace/api-zod";
import { ingredientsData } from "../data/ingredients";
import { dishesData } from "../data/dishes";
import { calculateNutriScore, buildTrafficLights, generateHealthTips } from "../lib/nutriScore";

const router: IRouter = Router();

router.get("/home-foods/ingredients", async (_req, res): Promise<void> => {
  res.json(ListIngredientsResponse.parse(ingredientsData));
});

router.get("/home-foods/dishes", async (_req, res): Promise<void> => {
  res.json(ListDishesResponse.parse(dishesData));
});

router.post("/home-foods/analyze", async (req, res): Promise<void> => {
  const body = AnalyzeHomeMealBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const { mealName, servings = 1, ingredients } = body.data;

  const ingredientMap = new Map(ingredientsData.map((i) => [i.id, i]));

  let totalCalories = 0;
  let totalFat = 0;
  let totalSaturatedFat = 0;
  let totalCarbs = 0;
  let totalSugars = 0;
  let totalFiber = 0;
  let totalProtein = 0;
  let totalSalt = 0;
  let totalSodium = 0;
  let totalGrams = 0;

  for (const item of ingredients) {
    const ingredient = ingredientMap.get(item.ingredientId);
    if (!ingredient) continue;

    const ratio = item.grams / 100;
    totalCalories += (ingredient.nutrition.calories ?? 0) * ratio;
    totalFat += (ingredient.nutrition.fat ?? 0) * ratio;
    totalSaturatedFat += (ingredient.nutrition.saturatedFat ?? 0) * ratio;
    totalCarbs += (ingredient.nutrition.carbohydrates ?? 0) * ratio;
    totalSugars += (ingredient.nutrition.sugars ?? 0) * ratio;
    totalFiber += (ingredient.nutrition.fiber ?? 0) * ratio;
    totalProtein += (ingredient.nutrition.protein ?? 0) * ratio;
    totalSalt += (ingredient.nutrition.salt ?? 0) * ratio;
    totalSodium += (ingredient.nutrition.sodium ?? 0) * ratio;
    totalGrams += item.grams;
  }

  const round = (n: number) => Math.round(n * 10) / 10;

  const totalNutrition = {
    calories: round(totalCalories),
    fat: round(totalFat),
    saturatedFat: round(totalSaturatedFat),
    carbohydrates: round(totalCarbs),
    sugars: round(totalSugars),
    fiber: round(totalFiber),
    protein: round(totalProtein),
    salt: round(totalSalt),
    sodium: round(totalSodium),
  };

  const safeServings = servings > 0 ? servings : 1;

  const perServingNutrition = {
    calories: round(totalCalories / safeServings),
    fat: round(totalFat / safeServings),
    saturatedFat: round(totalSaturatedFat / safeServings),
    carbohydrates: round(totalCarbs / safeServings),
    sugars: round(totalSugars / safeServings),
    fiber: round(totalFiber / safeServings),
    protein: round(totalProtein / safeServings),
    salt: round(totalSalt / safeServings),
    sodium: round(totalSodium / safeServings),
  };

  const per100gNutrition =
    totalGrams > 0
      ? {
          calories: round((totalCalories / totalGrams) * 100),
          fat: round((totalFat / totalGrams) * 100),
          saturatedFat: round((totalSaturatedFat / totalGrams) * 100),
          carbohydrates: round((totalCarbs / totalGrams) * 100),
          sugars: round((totalSugars / totalGrams) * 100),
          fiber: round((totalFiber / totalGrams) * 100),
          protein: round((totalProtein / totalGrams) * 100),
          salt: round((totalSalt / totalGrams) * 100),
          sodium: round((totalSodium / totalGrams) * 100),
        }
      : perServingNutrition;

  const nutriScore = calculateNutriScore(per100gNutrition);
  const trafficLights = buildTrafficLights(perServingNutrition);
  const tips = generateHealthTips(nutriScore, perServingNutrition);

  const result = {
    mealName: mealName ?? "Ghar Ka Khana",
    servings: safeServings,
    totalNutrition,
    perServingNutrition,
    nutriScore,
    trafficLights,
    tips,
  };

  res.json(AnalyzeHomeMealResponse.parse(result));
});

export default router;
