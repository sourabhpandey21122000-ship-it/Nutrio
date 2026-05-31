import { Router, type IRouter } from "express";
import {
  GetProductByBarcodeParams,
  SearchProductsQueryParams,
} from "@workspace/api-zod";
import { indianProducts } from "../data/indianProducts";
import { calculateNutriScore, buildTrafficLights } from "../lib/nutriScore";

const router: IRouter = Router();

function buildProductResponse(p: (typeof indianProducts)[0], nutriScore?: string) {
  const score = nutriScore ?? calculateNutriScore(p.nutrition);
  return {
    barcode: p.barcode,
    name: p.name,
    brand: p.brand,
    imageUrl: p.imageUrl,
    category: p.category,
    nutriScore: score,
    isVeg: p.isVeg,
    isVegan: p.isVegan,
    isSwadeshi: p.isSwadeshi,
    isUltraProcessed: p.isUltraProcessed,
    nutrition: p.nutrition,
    ingredients: p.ingredients,
    servingSize: p.servingSize,
    source: "local" as const,
  };
}

function mapOpenFoodFactsProduct(offData: Record<string, unknown>, barcode: string) {
  const product = offData.product as Record<string, unknown> | undefined;
  if (!product) return null;

  const nutriments = (product.nutriments as Record<string, unknown>) ?? {};

  const nutrition = {
    calories: (nutriments["energy-kcal_100g"] as number | null) ?? null,
    fat: (nutriments["fat_100g"] as number | null) ?? null,
    saturatedFat: (nutriments["saturated-fat_100g"] as number | null) ?? null,
    carbohydrates: (nutriments["carbohydrates_100g"] as number | null) ?? null,
    sugars: (nutriments["sugars_100g"] as number | null) ?? null,
    fiber: (nutriments["fiber_100g"] as number | null) ?? null,
    protein: (nutriments["proteins_100g"] as number | null) ?? null,
    salt: (nutriments["salt_100g"] as number | null) ?? null,
    sodium: (nutriments["sodium_100g"] as number | null)
      ? ((nutriments["sodium_100g"] as number) * 1000)
      : null,
  };

  const nutriScore = calculateNutriScore(nutrition);

  return {
    barcode,
    name: (product.product_name as string) || (product.product_name_en as string) || "Unknown Product",
    brand: (product.brands as string | null) ?? null,
    imageUrl: (product.image_front_url as string | null) ?? (product.image_url as string | null) ?? null,
    category: (product.categories as string | null)?.split(",")[0]?.trim() ?? null,
    nutriScore,
    isVeg: null,
    isVegan: null,
    isSwadeshi: null,
    isUltraProcessed: null,
    nutrition,
    ingredients: (product.ingredients_text as string | null) ?? null,
    servingSize: (product.serving_size as string | null) ?? null,
    source: "openfoodfacts" as const,
  };
}

router.get("/products/barcode/:barcode", async (req, res): Promise<void> => {
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
          "User-Agent": "Nutrio/1.0 (Indian food health scanner; https://nutrio.app)",
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
      res.status(404).json({ error: "Product not found in our database. Please add it!" });
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
    res.status(404).json({ error: "Product not found. Try manual search." });
  }
});

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
