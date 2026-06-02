import { Router, type IRouter } from "express";
import {
  GetProductByBarcodeParams,
  SearchProductsQueryParams,
} from "@workspace/api-zod";
import { indianProducts } from "../data/indianProducts";
import {
  calculateNutriScoreWithPoints,
  generateHealthTips,
  getAyurvedicNote,
} from "../lib/nutriScore";
import {
  CURATED_BY_BARCODE,
  CURATED_BY_CATEGORY,
  type CuratedAlt,
} from "../data/curatedAlternatives";

const router: IRouter = Router();

const GRADE_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

function buildAlternatives(
  barcode: string,
  category: string | null,
  currentGrade: string,
  currentPoints: number
) {
  const results: Array<{
    barcode: string;
    name: string;
    brand: string | null;
    category: string | null;
    nutriScore: string;
    nutriScorePoints: number;
    reason: string;
  }> = [];

  // 1. Curated by barcode (highest priority)
  const curatedForBarcode: CuratedAlt[] = CURATED_BY_BARCODE[barcode] ?? [];

  // 2. DB-based same-category alternatives
  const dbCandidates = indianProducts
    .filter((p) => p.barcode !== barcode && p.category === category)
    .map((p) => {
      const { grade, points } = calculateNutriScoreWithPoints(p.nutrition);
      return { p, grade, points };
    })
    .filter(({ grade }) => GRADE_ORDER[grade] < GRADE_ORDER[currentGrade])
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map(({ p, grade, points }) => ({
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      nutriScore: grade,
      nutriScorePoints: points,
      reason: `Same category mein Grade ${grade} — healthier switch yaar! 💪`,
    }));

  // 3. Curated by category fallback
  const curatedForCategory: CuratedAlt[] =
    category && !curatedForBarcode.length
      ? (CURATED_BY_CATEGORY[category] ?? [])
      : [];

  // Merge: curated-by-barcode first, then DB candidates, dedupe by barcode
  const seen = new Set<string>();
  const mergeIn = (
    items: Array<{ barcode: string; name: string; brand: string | null; category: string | null; nutriScore: string; nutriScorePoints: number; reason: string }>
  ) => {
    for (const item of items) {
      if (!seen.has(item.barcode)) {
        seen.add(item.barcode);
        results.push(item);
      }
    }
  };

  mergeIn(curatedForBarcode);
  mergeIn(dbCandidates);
  mergeIn(curatedForCategory);

  if (results.length > 0) return results.slice(0, 3);

  // 4. Broad fallback — any category with significantly better score
  return indianProducts
    .filter((p) => p.barcode !== barcode)
    .map((p) => {
      const { grade, points } = calculateNutriScoreWithPoints(p.nutrition);
      return { p, grade, points };
    })
    .filter(
      ({ grade, points }) =>
        GRADE_ORDER[grade] < GRADE_ORDER[currentGrade] &&
        points > currentPoints + 10
    )
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map(({ p, grade, points }) => ({
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      nutriScore: grade,
      nutriScorePoints: points,
      reason: `Grade ${grade} (${points}/100) — yeh toh bahut better hai bhai!`,
    }));
}

function buildProductResponse(p: (typeof indianProducts)[0]) {
  const { grade, points } = calculateNutriScoreWithPoints(p.nutrition);
  const tips = generateHealthTips(grade, p.nutrition);
  const ayurvedicNote = getAyurvedicNote(p.category, p.ingredients, p.name);
  const needsAlternatives = grade === "D" || grade === "E";
  const alternatives = needsAlternatives
    ? buildAlternatives(p.barcode, p.category, grade, points)
    : [];

  return {
    barcode: p.barcode,
    name: p.name,
    brand: p.brand,
    imageUrl: p.imageUrl,
    category: p.category,
    nutriScore: grade,
    nutriScorePoints: points,
    isVeg: p.isVeg,
    isVegan: p.isVegan,
    isSwadeshi: p.isSwadeshi,
    isUltraProcessed: p.isUltraProcessed,
    nutrition: p.nutrition,
    ingredients: p.ingredients,
    servingSize: p.servingSize,
    source: "local" as const,
    tips,
    ayurvedicNote,
    alternatives,
  };
}

function mapOpenFoodFactsProduct(
  offData: Record<string, unknown>,
  barcode: string
) {
  const product = offData.product as Record<string, unknown> | undefined;
  if (!product) return null;

  const nutriments = (product.nutriments as Record<string, unknown>) ?? {};

  const nutrition = {
    calories:
      (nutriments["energy-kcal_100g"] as number | null) ?? null,
    fat: (nutriments["fat_100g"] as number | null) ?? null,
    saturatedFat:
      (nutriments["saturated-fat_100g"] as number | null) ?? null,
    carbohydrates:
      (nutriments["carbohydrates_100g"] as number | null) ?? null,
    sugars: (nutriments["sugars_100g"] as number | null) ?? null,
    fiber: (nutriments["fiber_100g"] as number | null) ?? null,
    protein: (nutriments["proteins_100g"] as number | null) ?? null,
    salt: (nutriments["salt_100g"] as number | null) ?? null,
    sodium: (nutriments["sodium_100g"] as number | null)
      ? ((nutriments["sodium_100g"] as number) * 1000)
      : null,
  };

  const { grade: nutriScore, points: nutriScorePoints } =
    calculateNutriScoreWithPoints(nutrition);
  const name =
    (product.product_name as string) ||
    (product.product_name_en as string) ||
    "Unknown Product";
  const category =
    (product.categories as string | null)?.split(",")[0]?.trim() ?? null;
  const ingredients =
    (product.ingredients_text as string | null) ?? null;
  const tips = generateHealthTips(nutriScore, nutrition);
  const ayurvedicNote = getAyurvedicNote(category, ingredients, name);
  const needsAlternatives = nutriScore === "D" || nutriScore === "E";
  const alternatives = needsAlternatives
    ? buildAlternatives(barcode, category, nutriScore, nutriScorePoints)
    : [];

  return {
    barcode,
    name,
    brand: (product.brands as string | null) ?? null,
    imageUrl:
      (product.image_front_url as string | null) ??
      (product.image_url as string | null) ??
      null,
    category,
    nutriScore,
    nutriScorePoints,
    isVeg: null,
    isVegan: null,
    isSwadeshi: null,
    isUltraProcessed: null,
    nutrition,
    ingredients,
    servingSize: (product.serving_size as string | null) ?? null,
    source: "openfoodfacts" as const,
    tips,
    ayurvedicNote,
    alternatives,
  };
}

router.get(
  "/products/barcode/:barcode",
  async (req, res): Promise<void> => {
    const params = GetProductByBarcodeParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const { barcode } = params.data;

    const localProduct = indianProducts.find((p) => p.barcode === barcode);
    if (localProduct) {
      res.json(buildProductResponse(localProduct));
      return;
    }

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        {
          headers: {
            "User-Agent":
              "Nutrio/1.0 (Indian food health scanner; https://nutrio.app)",
          },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (!response.ok) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const data = (await response.json()) as Record<string, unknown>;

      if (data.status !== 1) {
        res
          .status(404)
          .json({ error: "Product nahi mila hamare database mein. Add karo!" });
        return;
      }

      const product = mapOpenFoodFactsProduct(data, barcode);
      if (!product) {
        res.status(404).json({ error: "Product data unavailable" });
        return;
      }

      res.json(product);
    } catch (err) {
      req.log.warn({ err }, "Open Food Facts API call failed");
      res
        .status(404)
        .json({ error: "Product nahi mila. Manual search try karo!" });
    }
  }
);

router.get("/products/search", async (req, res): Promise<void> => {
  const query = SearchProductsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { q, limit = 20 } = query.data;
  const search = q.toLowerCase().trim();

  const results = indianProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        (p.brand && p.brand.toLowerCase().includes(search)) ||
        (p.category && p.category.toLowerCase().includes(search))
    )
    .slice(0, limit)
    .map((p) => buildProductResponse(p));

  res.json(results);
});

export default router;
