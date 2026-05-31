import { useState } from "react";
import { Link } from "wouter";
import { useSearchProducts, getSearchProductsQueryKey } from "@workspace/api-client-react";
import { NutriScore } from "@/components/ui/nutri-score";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

export default function Search() {
  const [query, setQuery] = useState("");

  const { data: results, isLoading } = useSearchProducts(
    { q: query, limit: 20 },
    { query: { enabled: query.trim().length >= 2, queryKey: getSearchProductsQueryKey({ q: query, limit: 20 }) } }
  );

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold">Product Search</h1>
        <p className="text-muted-foreground text-sm">Apna favourite product dhundo</p>
      </header>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          data-testid="input-search"
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
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">{results.length} result{results.length !== 1 ? "s" : ""} mila</p>
            {results.map((product, i) => (
              <motion.div
                key={product.barcode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/product/${product.barcode}`}>
                  <Card data-testid={`card-product-${product.barcode}`} className="hover-elevate cursor-pointer active:scale-[0.98] transition-transform">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">🛒</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.brand || "Unknown Brand"}</p>
                        {product.category && (
                          <p className="text-xs text-muted-foreground/70 truncate">{product.category}</p>
                        )}
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
