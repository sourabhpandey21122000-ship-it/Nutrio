import { useState, useEffect } from "react";
import { Product } from "@workspace/api-client-react";

export interface ScanHistoryItem extends Product {
  scannedAt: string;
}

const STORAGE_KEY = "nutrio_scans";
const MAX_ITEMS = 50;

export function useHistory() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (product: Product) => {
    try {
      const newItem: ScanHistoryItem = { ...product, scannedAt: new Date().toISOString() };
      setHistory(prev => {
        const filtered = prev.filter(p => p.barcode !== product.barcode);
        const next = [newItem, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const removeFromHistory = (barcode: string) => {
    try {
      setHistory(prev => {
        const next = prev.filter(p => p.barcode !== barcode);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.error("Failed to remove history", e);
    }
  };

  return { history, saveToHistory, removeFromHistory };
}