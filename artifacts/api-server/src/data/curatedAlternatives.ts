/**
 * Curated "Healthier Switch Kar!" alternatives for specific bad-grade products.
 * Barcodes starting with "curated-" are suggestions NOT in our local DB
 * (e.g. Slurrp Farm, Makhana, Roasted Chana) — they render as non-linkable cards.
 * Real barcodes (from indianProducts) are clickable and resolved fully.
 */

export interface CuratedAlt {
  barcode: string;
  name: string;
  brand: string | null;
  category: string | null;
  nutriScore: string;
  nutriScorePoints: number;
  reason: string;
}

// ── Per-barcode curated alternatives ─────────────────────────────────────────

export const CURATED_BY_BARCODE: Record<string, CuratedAlt[]> = {
  // Maggi 2-Minute Noodles Masala → better noodle options
  "8901058856686": [
    {
      barcode: "curated-slurrp-noodles",
      name: "Slurrp Farm Millet Noodles",
      brand: "Slurrp Farm",
      category: "Instant Noodles",
      nutriScore: "B",
      nutriScorePoints: 68,
      reason: "Millet-based, no maida, way less sodium — ghar mein bhi available!",
    },
    {
      barcode: "curated-bambino-vermicelli",
      name: "Bambino Vermicelli",
      brand: "Bambino",
      category: "Instant Noodles",
      nutriScore: "B",
      nutriScorePoints: 65,
      reason: "Semolina based, quick cook, less processed than Maggi — kirana pe milega!",
    },
    {
      barcode: "8901040050163",
      name: "Patanjali Atta Noodles",
      brand: "Patanjali",
      category: "Instant Noodles",
      nutriScore: "C",
      nutriScorePoints: 56,
      reason: "Whole wheat base, swadeshi aur less ultra-processed 💪",
    },
  ],

  // Maggi Atta Noodles → still better options
  "8901058856601": [
    {
      barcode: "curated-slurrp-noodles",
      name: "Slurrp Farm Millet Noodles",
      brand: "Slurrp Farm",
      category: "Instant Noodles",
      nutriScore: "B",
      nutriScorePoints: 68,
      reason: "Millet power + no maida — next level glow up from atta noodles!",
    },
    {
      barcode: "curated-bambino-vermicelli",
      name: "Bambino Vermicelli",
      brand: "Bambino",
      category: "Instant Noodles",
      nutriScore: "B",
      nutriScorePoints: 65,
      reason: "Semolina based, simpler ingredients, lower sodium — clean choice!",
    },
  ],

  // Lay's Classic Salted → healthier snack swaps
  "4902778012161": [
    {
      barcode: "8902030050101",
      name: "Too Yumm Multigrain Chips",
      brand: "Too Yumm",
      category: "Chips & Snacks",
      nutriScore: "C",
      nutriScorePoints: 62,
      reason: "Baked, not fried — same crunch, way less guilt!",
    },
    {
      barcode: "curated-makhana",
      name: "Roasted Makhana (Fox Nuts)",
      brand: "Any local brand",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 88,
      reason: "High protein, low fat — India ka OG healthy snack, kirana pe milega!",
    },
    {
      barcode: "curated-roasted-chana",
      name: "Roasted Chana (Salted)",
      brand: "Haldiram's / local",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 85,
      reason: "22g protein per 100g! Desi powerhouse snack — Maggi se match nahi karega yaar 💪",
    },
  ],

  // Lay's Magic Masala
  "8901058050201": [
    {
      barcode: "8902030050101",
      name: "Too Yumm Multigrain Chips",
      brand: "Too Yumm",
      category: "Chips & Snacks",
      nutriScore: "C",
      nutriScorePoints: 62,
      reason: "Same masala vibe, baked — sahi swap hai bhai!",
    },
    {
      barcode: "curated-makhana",
      name: "Roasted Makhana (Fox Nuts)",
      brand: "Any local brand",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 88,
      reason: "Netflix ke saath makhana — main character energy only!",
    },
    {
      barcode: "curated-roasted-chana",
      name: "Roasted Chana (Salted)",
      brand: "Haldiram's / local",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 85,
      reason: "Protein-packed desi snack — chips se 10x better for your gains!",
    },
  ],

  // Lay's Cream & Onion
  "8901058050218": [
    {
      barcode: "8902030050118",
      name: "Too Yumm Baked Veggie Stix",
      brand: "Too Yumm",
      category: "Chips & Snacks",
      nutriScore: "C",
      nutriScorePoints: 64,
      reason: "Veggie-based, baked not fried — same snacking energy!",
    },
    {
      barcode: "curated-makhana",
      name: "Roasted Makhana (Fox Nuts)",
      brand: "Any local brand",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 88,
      reason: "Guilt-free snacking ka OG option — try it once, hooked for life!",
    },
  ],

  // Kurkure Masala Munch
  "8901063056015": [
    {
      barcode: "curated-makhana",
      name: "Roasted Makhana (Fox Nuts)",
      brand: "Any local brand",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 88,
      reason: "Crunchy, filling, protein-rich — Kurkure ko bhool jaoge bhai!",
    },
    {
      barcode: "8902030050101",
      name: "Too Yumm Multigrain Chips",
      brand: "Too Yumm",
      category: "Chips & Snacks",
      nutriScore: "C",
      nutriScorePoints: 62,
      reason: "Baked multigrain — same namkeen vibe without the ultra-processing!",
    },
    {
      barcode: "curated-yoga-bar",
      name: "Yoga Bar Multigrain Energy Bar",
      brand: "Yoga Bar",
      category: "Health Foods",
      nutriScore: "B",
      nutriScorePoints: 70,
      reason: "Sweet + salty fix with actual nutrition — gym wali energy!",
    },
  ],

  // Kurkure Hyderabadi Hungama
  "8901063056022": [
    {
      barcode: "curated-makhana",
      name: "Roasted Makhana (Fox Nuts)",
      brand: "Any local brand",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 88,
      reason: "Hyderabadi biryani ke side mein makhana rakh lo — sahi combo! 😄",
    },
    {
      barcode: "curated-roasted-chana",
      name: "Roasted Chana",
      brand: "Haldiram's / local",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 85,
      reason: "Desi protein snack — filling aur actually nutritious!",
    },
  ],

  // Cadbury Dairy Milk (Grade E)
  "7622210100153": [
    {
      barcode: "8901058856817",
      name: "Amul Dark Chocolate 55%",
      brand: "Amul",
      category: "Chocolates",
      nutriScore: "C",
      nutriScorePoints: 58,
      reason: "Swadeshi dark choc with antioxidants — guilt trip se baahar niklo! 🍫",
    },
    {
      barcode: "curated-dry-fruits",
      name: "Mixed Dry Fruits (Almonds, Cashews, Raisins)",
      brand: "Any local brand",
      category: "Healthy Snacks",
      nutriScore: "A",
      nutriScorePoints: 80,
      reason: "Natural sugar rush with fiber + protein — meetha bhi, healthy bhi!",
    },
    {
      barcode: "curated-dates",
      name: "Medjool Dates (Khajoor)",
      brand: "Any local brand",
      category: "Healthy Snacks",
      nutriScore: "B",
      nutriScorePoints: 72,
      reason: "Nature ka candy — iron, fiber aur natural sweetness!",
    },
  ],

  // Cadbury 5 Star
  "7622210100160": [
    {
      barcode: "8901058856817",
      name: "Amul Dark Chocolate 55%",
      brand: "Amul",
      category: "Chocolates",
      nutriScore: "C",
      nutriScorePoints: 58,
      reason: "Darker, richer, actually has antioxidants — upgrade your choco game!",
    },
    {
      barcode: "curated-dry-fruits",
      name: "Mixed Dry Fruits & Nuts",
      brand: "Any local brand",
      category: "Healthy Snacks",
      nutriScore: "A",
      nutriScorePoints: 80,
      reason: "Healthy fats + natural sweetness — body bhi khush, taste bhi!",
    },
  ],

  // KitKat (Grade E)
  "7613035359634": [
    {
      barcode: "8901058856817",
      name: "Amul Dark Chocolate 55%",
      brand: "Amul",
      category: "Chocolates",
      nutriScore: "C",
      nutriScorePoints: 58,
      reason: "Give your tastebuds a REAL break — dark choc all the way! 🍫",
    },
    {
      barcode: "curated-dry-fruits",
      name: "Mixed Dry Fruits & Nuts",
      brand: "Any local brand",
      category: "Healthy Snacks",
      nutriScore: "A",
      nutriScorePoints: 80,
      reason: "Nature ka snack pack — no artificial anything!",
    },
  ],

  // Nestlé Munch
  "8901058857379": [
    {
      barcode: "8901058856817",
      name: "Amul Dark Chocolate 55%",
      brand: "Amul",
      category: "Chocolates",
      nutriScore: "C",
      nutriScorePoints: 58,
      reason: "Real cocoa, real taste — aur swadeshi bhi! 💪",
    },
    {
      barcode: "curated-dates",
      name: "Medjool Dates (Khajoor)",
      brand: "Any local brand",
      category: "Healthy Snacks",
      nutriScore: "B",
      nutriScorePoints: 72,
      reason: "Sweet craving ka desi jugaad — body bhi thank karega!",
    },
  ],

  // Bournvita (Grade D/E health drink)
  "8901058856762": [
    {
      barcode: "8901058856921",
      name: "Saffola Classic Oats",
      brand: "Marico",
      category: "Breakfast Cereals",
      nutriScore: "A",
      nutriScorePoints: 86,
      reason: "Real whole grain breakfast — Bournvita se 10x better start to your day!",
    },
    {
      barcode: "curated-plain-milk-banana",
      name: "Plain Milk + Banana (Desi Combo)",
      brand: "Ghar ka",
      category: "Breakfast",
      nutriScore: "A",
      nutriScorePoints: 90,
      reason: "Protein + potassium combo — athletes ka real breakfast, no added sugar!",
    },
  ],

  // Boost
  "8901063001015": [
    {
      barcode: "8901058856921",
      name: "Saffola Classic Oats",
      brand: "Marico",
      category: "Breakfast Cereals",
      nutriScore: "A",
      nutriScorePoints: 86,
      reason: "Slow-release energy — Boost se zyada lasting energy milegi!",
    },
    {
      barcode: "curated-plain-milk-banana",
      name: "Plain Milk + Banana (Desi Combo)",
      brand: "Ghar ka",
      category: "Breakfast",
      nutriScore: "A",
      nutriScorePoints: 90,
      reason: "Real energy without the sugar crash — isko try karo seriously!",
    },
  ],

  // Oreo
  "7622201493035": [
    {
      barcode: "8901063025189",
      name: "Britannia NutriChoice Digestive",
      brand: "Britannia",
      category: "Biscuits",
      nutriScore: "C",
      nutriScorePoints: 60,
      reason: "High fiber biscuit — chai ke saath sahi, aur gut bhi kush!",
    },
    {
      barcode: "curated-ragi-cookies",
      name: "Ragi Cookies (Millet-based)",
      brand: "Organic India / local bakery",
      category: "Biscuits",
      nutriScore: "B",
      nutriScorePoints: 72,
      reason: "Calcium-rich ragi cookies — sweetness with actual nutrition!",
    },
  ],

  // Britannia Good Day (Grade C → still offer D/E alternative)
  "8901063025103": [
    {
      barcode: "8901063025189",
      name: "Britannia NutriChoice Digestive",
      brand: "Britannia",
      category: "Biscuits",
      nutriScore: "C",
      nutriScorePoints: 60,
      reason: "Same brand, way more fiber — simple switch, big difference!",
    },
    {
      barcode: "curated-ragi-cookies",
      name: "Ragi Cookies",
      brand: "Organic India / local bakery",
      category: "Biscuits",
      nutriScore: "B",
      nutriScorePoints: 72,
      reason: "Calcium + iron from ragi — mithai without the guilt!",
    },
  ],

  // Britannia Bourbon (Grade D)
  "8901063025165": [
    {
      barcode: "8901063025189",
      name: "Britannia NutriChoice Digestive",
      brand: "Britannia",
      category: "Biscuits",
      nutriScore: "C",
      nutriScorePoints: 60,
      reason: "Same company, less sugar, more fiber — easy switch!",
    },
    {
      barcode: "8901063025172",
      name: "Britannia Marie Gold",
      brand: "Britannia",
      category: "Biscuits",
      nutriScore: "C",
      nutriScorePoints: 55,
      reason: "Light, lower sugar biscuit — chai ke saath OG combo!",
    },
  ],

  // Sunfeast Dark Fantasy (Grade D)
  "8901058856779": [
    {
      barcode: "8901063025189",
      name: "Britannia NutriChoice Digestive",
      brand: "Britannia",
      category: "Biscuits",
      nutriScore: "C",
      nutriScorePoints: 60,
      reason: "High fiber, less sugar — better snacking choice!",
    },
    {
      barcode: "curated-ragi-cookies",
      name: "Ragi Cookies",
      brand: "Organic India / local bakery",
      category: "Biscuits",
      nutriScore: "B",
      nutriScorePoints: 72,
      reason: "Chocolatey taste with actual nutrition? Haan yaar possible hai!",
    },
  ],

  // Kellogg's Chocos (Grade D)
  "8901058857110": [
    {
      barcode: "8901058856921",
      name: "Saffola Classic Oats",
      brand: "Marico",
      category: "Breakfast Cereals",
      nutriScore: "A",
      nutriScorePoints: 86,
      reason: "Real whole grain breakfast — Chocos se 5x more filling!",
    },
    {
      barcode: "8901058856890",
      name: "Tata Soulfull Ragi Millet Muesli",
      brand: "Tata",
      category: "Breakfast Cereals",
      nutriScore: "B",
      nutriScorePoints: 74,
      reason: "Millet + oats combo — mornings ka proper upgrade 🌾",
    },
  ],
};

// ── Per-category fallback curated alternatives ────────────────────────────────

export const CURATED_BY_CATEGORY: Record<string, CuratedAlt[]> = {
  "Chips & Snacks": [
    {
      barcode: "curated-makhana",
      name: "Roasted Makhana (Fox Nuts)",
      brand: "Any local brand",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 88,
      reason: "India ka OG healthy snack — crunchy, light, high protein!",
    },
    {
      barcode: "curated-roasted-chana",
      name: "Roasted Chana (Salted)",
      brand: "Haldiram's / local",
      category: "Chips & Snacks",
      nutriScore: "A",
      nutriScorePoints: 85,
      reason: "Desi protein bomb — budget mein, kirana pe available!",
    },
    {
      barcode: "8902030050101",
      name: "Too Yumm Multigrain Chips",
      brand: "Too Yumm",
      category: "Chips & Snacks",
      nutriScore: "C",
      nutriScorePoints: 62,
      reason: "Baked not fried — crunch ke saath conscience bhi clear!",
    },
  ],
  "Instant Noodles": [
    {
      barcode: "curated-bambino-vermicelli",
      name: "Bambino Vermicelli",
      brand: "Bambino",
      category: "Instant Noodles",
      nutriScore: "B",
      nutriScorePoints: 65,
      reason: "Simple semolina, less sodium, less processed — quick aur clean!",
    },
    {
      barcode: "curated-slurrp-noodles",
      name: "Slurrp Farm Millet Noodles",
      brand: "Slurrp Farm",
      category: "Instant Noodles",
      nutriScore: "B",
      nutriScorePoints: 68,
      reason: "Millet-based noodles — Maggi se better in every single way!",
    },
    {
      barcode: "curated-dalia",
      name: "Dalia (Broken Wheat Upma)",
      brand: "Any brand / ghar ka",
      category: "Breakfast Cereals",
      nutriScore: "A",
      nutriScorePoints: 82,
      reason: "Indian superfood — 5 min mein banta hai, body aur pocket dono kush!",
    },
  ],
  "Chocolates": [
    {
      barcode: "8901058856817",
      name: "Amul Dark Chocolate 55%",
      brand: "Amul",
      category: "Chocolates",
      nutriScore: "C",
      nutriScorePoints: 58,
      reason: "Real cocoa, antioxidants, swadeshi — upgrade your chocolate game!",
    },
    {
      barcode: "curated-dry-fruits",
      name: "Mixed Dry Fruits & Nuts",
      brand: "Any local brand",
      category: "Healthy Snacks",
      nutriScore: "A",
      nutriScorePoints: 80,
      reason: "Nature ka meetha — natural sugars + healthy fats, no regret!",
    },
  ],
  "Biscuits": [
    {
      barcode: "8901063025189",
      name: "Britannia NutriChoice Digestive",
      brand: "Britannia",
      category: "Biscuits",
      nutriScore: "C",
      nutriScorePoints: 60,
      reason: "High fiber, low sugar biscuit — chai ka perfect partner!",
    },
    {
      barcode: "curated-ragi-cookies",
      name: "Ragi Cookies",
      brand: "Organic India / local bakery",
      category: "Biscuits",
      nutriScore: "B",
      nutriScorePoints: 72,
      reason: "Calcium-rich ragi — taste bhi, nutrition bhi!",
    },
  ],
  "Health Drinks": [
    {
      barcode: "8901058856921",
      name: "Saffola Classic Oats",
      brand: "Marico",
      category: "Breakfast Cereals",
      nutriScore: "A",
      nutriScorePoints: 86,
      reason: "Real whole grain breakfast — health drink se better morning fuel!",
    },
    {
      barcode: "curated-plain-milk-banana",
      name: "Plain Milk + Banana",
      brand: "Ghar ka",
      category: "Breakfast",
      nutriScore: "A",
      nutriScorePoints: 90,
      reason: "Simple, real, nutritious — no added sugar, no artificial flavors!",
    },
  ],
};
