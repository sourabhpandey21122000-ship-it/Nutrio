import { Router, type IRouter } from "express";
import {
  SearchFruitsVeggiesQueryParams,
  ListFruitsVeggiesResponse,
  SearchFruitsVeggiesResponse,
} from "@workspace/api-zod";
import { fruitsVeggiesData } from "../data/fruitsVeggies";

const router: IRouter = Router();

router.get("/fruits-veggies", async (_req, res): Promise<void> => {
  res.json(ListFruitsVeggiesResponse.parse(fruitsVeggiesData));
});

router.get("/fruits-veggies/search", async (req, res): Promise<void> => {
  const query = SearchFruitsVeggiesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { q } = query.data;
  const search = q.toLowerCase().trim();

  const results = fruitsVeggiesData.filter(
    (item) =>
      item.name.toLowerCase().includes(search) ||
      item.nameHindi.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
  );

  res.json(SearchFruitsVeggiesResponse.parse(results));
});

export default router;
