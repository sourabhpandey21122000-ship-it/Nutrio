import { useState } from "react";
import { Link } from "wouter";
import { NutriScore } from "@/components/ui/nutri-score";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

const PRODUCTS = [
  { barcode: "8901058852427", name: "Maggi 2-Minute Noodles", brand: "Nestle", category: "Instant Noodles", nutriScore: "D", imageUrl: "" },
  { barcode: "8901058000015", name: "KitKat", brand: "Nestle", category: "Chocolate", nutriScore: "E", imageUrl: "" },
  { barcode: "8901719110017", name: "Parle-G Biscuits", brand: "Parle", category: "Biscuits", nutriScore: "D", imageUrl: "" },
  { barcode: "8906002190032", name: "Amul Butter", brand: "Amul", category: "Dairy", nutriScore: "C", imageUrl: "" },
  { barcode: "8901030860027", name: "Britannia Good Day", brand: "Britannia", category: "Biscuits", nutriScore: "D", imageUrl: "" },
  { barcode: "8901063100350", name: "Lay's Classic Salted", brand: "PepsiCo", category: "Chips", nutriScore: "D", imageUrl: "" },
  { barcode: "8901063130365", name: "Kurkure Masala Munch", brand: "PepsiCo", category: "Snacks", nutriScore: "D", imageUrl: "" },
  { barcode: "8901491100036", name: "Haldiram's Aloo Bhujia", brand: "Haldirams", category: "Namkeen", nutriScore: "D", imageUrl: "" },
  { barcode: "8902519001011", name: "Tata Salt", brand: "Tata", category: "Salt", nutriScore: "B", imageUrl: "" },
  { barcode: "8901764100018", name: "Fortune Sunflower Oil", brand: "Fortune", category: "Oil", nutriScore: "C", imageUrl: "" },
  { barcode: "8901764000028", name: "Aashirvaad Atta", brand: "ITC", category: "Flour", nutriScore: "B", imageUrl: "" },
  { barcode: "8901063160027", name: "Tropicana Orange Juice", brand: "PepsiCo", category: "Juice", nutriScore: "C", imageUrl: "" },
  { barcode: "8901058012018", name: "Munch Chocolate", brand: "Nestle", category: "Chocolate", nutriScore: "E", imageUrl: "" },
  { barcode: "8901491000021", name: "Bingo Mad Angles", brand: "ITC", category: "Chips", nutriScore: "D", imageUrl: "" },
  { barcode: "8906025680013", name: "Paper Boat Aamras", brand: "Paper Boat", category: "Juice", nutriScore: "C", imageUrl: "" },
];

export default function Search() {
  const [query, setQuery] = useState("");

  const results = query.trim().length >= 2
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold">Product Search</h1>
        <p className="text-muted-foreground text-sm">Apna favourite product dhundo</p>
      </header>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="search"
          placeholder="Maggi, Parle-G, Amul..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-auto -mx-4 px-4">
        {query.trim().length < 2 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <ScanLine size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Type at least 2 characters to search</p>
            <p className="text-sm text-muted-foreground mt-1">25+ Indian products available</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">{results.length} result{results.length !== 1 ? "s" : ""} mila</p>
            {results.map((product, i) => (
              <motion.div key={product.barcode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/product/${product.barcode}`}>
                  <Card className="cursor-pointer active:scale-[0.98] transition-transform">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-xl">🛒</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
                        <p className="text-xs text-muted-foreground/70 truncate">{product.category}</p>
                      </div>
                      <NutriScore score={product.nutriScore} size="sm" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold">Koi product nahi mila</p>
            <p className="text-muted-foreground text-sm mt-1">Try a different name or scan the barcode</p>
          </div>
        )}
      </div>
    </div>
  );
}
