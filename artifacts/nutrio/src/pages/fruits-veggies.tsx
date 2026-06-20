import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FruitVeggie {
  id: number;
  name: string;
  nameHindi: string;
  category: string;
  imageEmoji: string;
  season?: string;
  benefits: string[];
  freshnessTips: string[];
  nutrition: {
    calories: number;
    carbohydrates: number;
    protein: number;
    fat: number;
    fiber: number;
    sugars: number;
    sodium: number;
  };
  dadiKiRasoi?: string;
  healthTags: string[];
  packetAlt?: { name: string; note: string };
}

const DATA: FruitVeggie[] = [
  // ===== FRUITS (existing, fields added) =====
  { id: 1, name: "Apple", nameHindi: "Seb", category: "fruit", imageEmoji: "🍎", season: "Winter",
    benefits: ["Heart health", "Fiber rich"], freshnessTips: ["Store in fridge", "Avoid bruising"],
    nutrition: { calories: 52, carbohydrates: 14, protein: 0.3, fat: 0.2, fiber: 2.4, sugars: 10, sodium: 1 },
    dadiKiRasoi: "Roz ek seb khane se kaha jata hai doctor paas nahi jaana padta - purani kahawat hai.",
    healthTags: ["heart", "digestion", "weight"],
    packetAlt: { name: "Packaged Apple Juice", note: "Juice mein fiber nikal jata hai aur sugar zyada hoti hai - sabut seb hamesha better hai." } },
  { id: 2, name: "Banana", nameHindi: "Kela", category: "fruit", imageEmoji: "🍌", season: "All year",
    benefits: ["Energy boost", "Potassium rich"], freshnessTips: ["Store at room temp", "Avoid direct sunlight"],
    nutrition: { calories: 89, carbohydrates: 23, protein: 1.1, fat: 0.3, fiber: 2.6, sugars: 12, sodium: 1 },
    dadiKiRasoi: "Dadi kehti thi subah khaali pet kela khane se pet thik rehta hai aur taakat milti hai.",
    healthTags: ["energy", "digestion", "heart"],
    packetAlt: { name: "Banana Chips (Packaged)", note: "Chips deep-fried hote hai aur namak/oil zyada - taaza kela healthier hai." } },
  { id: 3, name: "Mango", nameHindi: "Aam", category: "fruit", imageEmoji: "🥭", season: "Summer",
    benefits: ["Vitamin C", "Immunity boost"], freshnessTips: ["Ripen at room temp", "Refrigerate when ripe"],
    nutrition: { calories: 60, carbohydrates: 15, protein: 0.8, fat: 0.4, fiber: 1.6, sugars: 14, sodium: 1 },
    dadiKiRasoi: "Gaon mein kaha jata hai aam khane ke baad doodh peene se garmi nahi lagti.",
    healthTags: ["immunity", "skin", "energy"],
    packetAlt: { name: "Mango Juice/Drink (Packaged)", note: "Packaged drinks mein asli aam 10-20% hi hota hai, baaki sugar syrup - taaza aam zyada vitamin C deta hai." } },
  { id: 4, name: "Papaya", nameHindi: "Papita", category: "fruit", imageEmoji: "🟠", season: "All year",
    benefits: ["Digestion", "Vitamin A"], freshnessTips: ["Store unripe at room temp"],
    nutrition: { calories: 43, carbohydrates: 11, protein: 0.5, fat: 0.3, fiber: 1.7, sugars: 8, sodium: 8 },
    dadiKiRasoi: "Purane zamane se kaha jata hai papita khane se pet saaf rehta hai aur khana achhe se pachta hai.",
    healthTags: ["digestion", "skin", "weight"],
    packetAlt: { name: "Papaya Enzyme Supplements", note: "Supplement ki jagah taaza papita lena better hai - natural fiber bhi milta hai." } },
  { id: 5, name: "Guava", nameHindi: "Amrood", category: "fruit", imageEmoji: "🍐", season: "Winter",
    benefits: ["Vitamin C", "Diabetes friendly"], freshnessTips: ["Eat when slightly soft"],
    nutrition: { calories: 68, carbohydrates: 14, protein: 2.6, fat: 1, fiber: 5.4, sugars: 9, sodium: 2 },
    dadiKiRasoi: "Amrood ke patte ubaal ke peene se dast mein aaram milta hai - ye traditional gharelu nuskha hai.",
    healthTags: ["sugar", "immunity", "digestion"],
    packetAlt: { name: "Guava Juice (Packaged)", note: "Juice banane mein asli fiber chhoot jata hai - sabut fruit zyada fayda karta hai." } },

  // ===== VEGETABLES (existing, fields added) =====
  { id: 6, name: "Tomato", nameHindi: "Tamatar", category: "vegetable", imageEmoji: "🍅", season: "All year",
    benefits: ["Lycopene", "Heart health"], freshnessTips: ["Store at room temp", "Avoid fridge"],
    nutrition: { calories: 18, carbohydrates: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2, sugars: 2.6, sodium: 5 },
    dadiKiRasoi: "Kaha jata hai tamatar ka ras chehre pe lagane se skin glow karti hai - purana beauty nuskha hai.",
    healthTags: ["heart", "skin", "hydration"],
    packetAlt: { name: "Tomato Ketchup/Puree (Packaged)", note: "Ketchup mein chupi hui sugar aur namak bahut zyada hota hai - taaza tamatar mein dono kam hai." } },
  { id: 7, name: "Onion", nameHindi: "Pyaaz", category: "vegetable", imageEmoji: "🧅", season: "All year",
    benefits: ["Antibacterial", "Heart health"], freshnessTips: ["Store in cool dry place"],
    nutrition: { calories: 40, carbohydrates: 9, protein: 1.1, fat: 0.1, fiber: 1.7, sugars: 4.2, sodium: 4 },
    dadiKiRasoi: "Garmi mein jeb mein kaccha pyaaz rakhne se loo se bachne ki purani maanyata hai.",
    healthTags: ["heart", "immunity"],
    packetAlt: { name: "Fried Onion/Onion Powder (Packaged)", note: "Packaged mein oil aur preservatives hote hai - kaccha pyaaz zyada healthy hai." } },
  { id: 8, name: "Potato", nameHindi: "Aloo", category: "root", imageEmoji: "🥔", season: "All year",
    benefits: ["Energy", "Potassium"], freshnessTips: ["Store in dark cool place"],
    nutrition: { calories: 77, carbohydrates: 17, protein: 2, fat: 0.1, fiber: 2.2, sugars: 0.8, sodium: 6 },
    dadiKiRasoi: "Jode ke dard ya sujan pe kaccha aloo kaat ke lagane ka purana gharelu tareeka mana jata hai.",
    healthTags: ["energy", "digestion"],
    packetAlt: { name: "Potato Chips/Fries (Packaged)", note: "Chips mein oil aur sodium kaafi zyada hota hai - ubla/bhuna aloo zyada healthy hai." } },

  // ===== LEAFY GREENS (existing, fields added) =====
  { id: 9, name: "Spinach", nameHindi: "Palak", category: "leafy", imageEmoji: "🥬", season: "Winter",
    benefits: ["Iron rich", "Bone health"], freshnessTips: ["Refrigerate in damp cloth"],
    nutrition: { calories: 23, carbohydrates: 3.6, protein: 2.9, fat: 0.4, fiber: 2.2, sugars: 0.4, sodium: 79 },
    dadiKiRasoi: "Bachpan se suna hoga 'Popeye palak khata tha' - taakat ke liye yeh baat purani hai.",
    healthTags: ["heart", "energy", "weight"],
    packetAlt: { name: "Frozen/Canned Spinach Puree", note: "Frozen palak mein kuch nutrients kam ho jate hai - taaza palak zyada iron deta hai." } },
  { id: 10, name: "Fenugreek", nameHindi: "Methi", category: "leafy", imageEmoji: "🌿", season: "Winter",
    benefits: ["Blood sugar control", "Digestion"], freshnessTips: ["Use fresh, store in fridge"],
    nutrition: { calories: 49, carbohydrates: 6, protein: 4.4, fat: 0.9, fiber: 2.7, sugars: 0, sodium: 67 },
    dadiKiRasoi: "Sardi mein methi ke laddu khane se jode aur sardi-khansi mein aaram milta hai.",
    healthTags: ["sugar", "digestion"],
    packetAlt: { name: "Methi Powder/Kasuri Methi (Packaged)", note: "Sukhi methi mein kuch vitamins kam ho jate hai - taaza patte zyada poshak hote hai." } },

  // ===== ROOT VEGETABLES (existing, fields added) =====
  { id: 11, name: "Carrot", nameHindi: "Gajar", category: "root", imageEmoji: "🥕", season: "Winter",
    benefits: ["Eye health", "Vitamin A"], freshnessTips: ["Store in fridge", "Remove tops before storing"],
    nutrition: { calories: 41, carbohydrates: 10, protein: 0.9, fat: 0.2, fiber: 2.8, sugars: 4.7, sodium: 69 },
    dadiKiRasoi: "Aankhon ki roshni ke liye gajar khane ki salaah dadi-nani hamesha dete aaye hai.",
    healthTags: ["skin", "immunity", "sugar"],
    packetAlt: { name: "Carrot Juice (Packaged)", note: "Packaged juice mein fiber kam ho jata hai - sabut gajar behtar hai." } },
  { id: 12, name: "Radish", nameHindi: "Mooli", category: "root", imageEmoji: "⚪", season: "Winter",
    benefits: ["Liver health", "Digestion"], freshnessTips: ["Store in fridge"],
    nutrition: { calories: 16, carbohydrates: 3.4, protein: 0.7, fat: 0.1, fiber: 1.6, sugars: 1.9, sodium: 39 },
    dadiKiRasoi: "Mooli ka achaar ya salad khane se acidity aur jaundice mein aaram milne ki purani maanyata hai.",
    healthTags: ["liver", "digestion", "hydration"],
    packetAlt: { name: "Mooli Pickle (Packaged Achaar)", note: "Packaged achaar mein namak/preservative zyada hota hai - taaza mooli ka salad healthier hai." } },

  // ===== FRUITS (new) =====
  { id: 13, name: "Orange", nameHindi: "Santra", category: "fruit", imageEmoji: "🍊", season: "Winter",
    benefits: ["Vitamin C boost", "Skin glow"], freshnessTips: ["Store in fridge", "Pick heavy fruits"],
    nutrition: { calories: 47, carbohydrates: 12, protein: 0.9, fat: 0.1, fiber: 2.4, sugars: 9, sodium: 0 },
    dadiKiRasoi: "Sardi-khansi mein santre ka ras peene se jaldi aaram milta hai - ye ghar ki purani salaah hai.",
    healthTags: ["immunity", "skin", "hydration"],
    packetAlt: { name: "Orange Juice (Tetra Pack)", note: "Tetra pack juice mein vitamin C kam ho jata hai - taaza santra zyada fayda karta hai." } },
  { id: 14, name: "Grapes", nameHindi: "Angoor", category: "fruit", imageEmoji: "🍇", season: "Winter",
    benefits: ["Antioxidants", "Heart health"], freshnessTips: ["Wash before eating", "Store in fridge"],
    nutrition: { calories: 69, carbohydrates: 18, protein: 0.7, fat: 0.2, fiber: 0.9, sugars: 16, sodium: 2 },
    dadiKiRasoi: "Thakaan door karne ke liye angoor khane ki purani salaah dadi-nani dete aaye hai.",
    healthTags: ["heart", "energy"],
    packetAlt: { name: "Raisins/Kishmish (Packaged)", note: "Kishmish mein sugar concentrated ho jati hai - taaza angoor mein paani aur fiber zyada hota hai." } },
  { id: 15, name: "Watermelon", nameHindi: "Tarbooz", category: "fruit", imageEmoji: "🍉", season: "Summer",
    benefits: ["Hydration", "Cooling effect"], freshnessTips: ["Refrigerate after cutting", "Tap to check ripeness"],
    nutrition: { calories: 30, carbohydrates: 8, protein: 0.6, fat: 0.2, fiber: 0.4, sugars: 6, sodium: 1 },
    dadiKiRasoi: "Garmi mein tarbooz khane se loo nahi lagti - ye purani gaon ki maanyata hai.",
    healthTags: ["hydration", "weight", "heart"],
    packetAlt: { name: "Watermelon Juice (Packaged)", note: "Packaged juice mein natural water content kho jata hai - taaza tarbooz behtar hydration deta hai." } },
  { id: 16, name: "Pomegranate", nameHindi: "Anar", category: "fruit", imageEmoji: "🔴", season: "Winter",
    benefits: ["Blood health", "Antioxidants"], freshnessTips: ["Store in fridge", "Pick heavy fruits"],
    nutrition: { calories: 83, carbohydrates: 19, protein: 1.7, fat: 1.2, fiber: 4, sugars: 14, sodium: 3 },
    dadiKiRasoi: "Anaemia mein anar khane ki salaah ghar ke bade hamesha dete hai.",
    healthTags: ["heart", "energy", "immunity"],
    packetAlt: { name: "Pomegranate Juice (Packaged)", note: "Packaged juice mein asli anar kam aur sugar zyada hota hai - taaza daane zyada poshak hote hai." } },
  { id: 17, name: "Pineapple", nameHindi: "Ananas", category: "fruit", imageEmoji: "🍍", season: "Summer",
    benefits: ["Digestion enzyme", "Vitamin C"], freshnessTips: ["Store at room temp", "Refrigerate after cutting"],
    nutrition: { calories: 50, carbohydrates: 13, protein: 0.5, fat: 0.1, fiber: 1.4, sugars: 10, sodium: 1 },
    dadiKiRasoi: "Khana ke baad ananas khane se digestion better hone ki baat purani hai.",
    healthTags: ["digestion", "immunity"],
    packetAlt: { name: "Pineapple Slices (Canned)", note: "Canned pineapple mein sugar syrup add hota hai - taaza ananas zyada healthy hai." } },
  { id: 18, name: "Litchi", nameHindi: "Litchi", category: "fruit", imageEmoji: "🍒", season: "Summer",
    benefits: ["Vitamin C", "Hydration"], freshnessTips: ["Refrigerate fresh", "Avoid eating empty stomach in excess"],
    nutrition: { calories: 66, carbohydrates: 17, protein: 0.8, fat: 0.4, fiber: 1.3, sugars: 15, sodium: 1 },
    dadiKiRasoi: "Litchi zyada matra mein khaali pet na khaane ki salaah purani peedhi dete aaye hai.",
    healthTags: ["hydration", "immunity"],
    packetAlt: { name: "Litchi Juice/Drink (Packaged)", note: "Packaged drink mein litchi kam aur sugar/flavor zyada hota hai - taaza litchi behtar hai." } },
  { id: 19, name: "Chikoo", nameHindi: "Sapota", category: "fruit", imageEmoji: "🟤", season: "Winter",
    benefits: ["Energy boost", "Digestion"], freshnessTips: ["Ripen at room temp", "Eat when soft"],
    nutrition: { calories: 83, carbohydrates: 20, protein: 0.4, fat: 1.1, fiber: 5.3, sugars: 14, sodium: 12 },
    dadiKiRasoi: "Kamzori mein chikoo khilane ki purani salaah ghar ki dadiyan dete aaye hai - quick energy ke liye.",
    healthTags: ["energy", "digestion"],
    packetAlt: { name: "Chikoo Milkshake (Packaged Mix)", note: "Ready-mix shake mein sugar zyada hoti hai - taaza chikoo se ghar pe shake behtar hai." } },
  { id: 20, name: "Custard Apple", nameHindi: "Sitaphal", category: "fruit", imageEmoji: "🟢", season: "Winter",
    benefits: ["Energy boost", "Mood support"], freshnessTips: ["Ripen at room temp", "Refrigerate when ripe"],
    nutrition: { calories: 94, carbohydrates: 24, protein: 2.1, fat: 0.3, fiber: 2.4, sugars: 18, sodium: 4 },
    dadiKiRasoi: "Kamzor logon ko sitaphal khilane ki salaah purane zamane se chali aa rahi hai.",
    healthTags: ["energy", "heart"] },
  { id: 21, name: "Jackfruit", nameHindi: "Kathal", category: "fruit", imageEmoji: "🟡", season: "Summer",
    benefits: ["Fiber rich", "Energy boost"], freshnessTips: ["Oil hands before cutting", "Store cut pieces in fridge"],
    nutrition: { calories: 95, carbohydrates: 24, protein: 1.7, fat: 0.3, fiber: 1.5, sugars: 19, sodium: 2 },
    dadiKiRasoi: "Bihar-UP mein kathal ki sabzi 'vegetarian mutton' ke naam se mashhoor hai - purani ghar ki recipe.",
    healthTags: ["digestion", "energy"],
    packetAlt: { name: "Jackfruit Chips (Packaged)", note: "Chips deep-fried hote hai - taaza kathal ki sabzi zyada healthy hai." } },
  { id: 22, name: "Muskmelon", nameHindi: "Kharbuja", category: "fruit", imageEmoji: "🍈", season: "Summer",
    benefits: ["Hydration", "Cooling effect"], freshnessTips: ["Refrigerate after cutting", "Check smell at stem"],
    nutrition: { calories: 34, carbohydrates: 8, protein: 0.8, fat: 0.2, fiber: 0.9, sugars: 8, sodium: 16 },
    dadiKiRasoi: "Garmi mein kharbuja khane se pet thanda rehta hai - ye purani salaah hai.",
    healthTags: ["hydration", "skin"] },
  { id: 23, name: "Plum", nameHindi: "Aloo Bukhara", category: "fruit", imageEmoji: "🟣", season: "Summer",
    benefits: ["Digestion", "Antioxidants"], freshnessTips: ["Store in fridge", "Wash before eating"],
    nutrition: { calories: 46, carbohydrates: 11, protein: 0.7, fat: 0.3, fiber: 1.4, sugars: 10, sodium: 0 },
    dadiKiRasoi: "Constipation mein aloo bukhara khane ki purani gharelu salaah hai.",
    healthTags: ["digestion", "heart"],
    packetAlt: { name: "Prune Juice (Packaged)", note: "Packaged juice mein fiber kam ho jata hai - taaza aloo bukhara zyada effective hai." } },
  { id: 24, name: "Strawberry", nameHindi: "Strawberry", category: "fruit", imageEmoji: "🍓", season: "Winter",
    benefits: ["Vitamin C", "Skin glow"], freshnessTips: ["Refrigerate immediately", "Wash just before eating"],
    nutrition: { calories: 32, carbohydrates: 8, protein: 0.7, fat: 0.3, fiber: 2, sugars: 5, sodium: 1 },
    dadiKiRasoi: "Roz thoda strawberry khane se skin pe glow aata hai - kaha jata hai.",
    healthTags: ["skin", "immunity"],
    packetAlt: { name: "Strawberry Jam (Packaged)", note: "Jam mein sugar bahut zyada hoti hai aur fiber nikal jata hai - taaza strawberry behtar hai." } },
  { id: 25, name: "Kiwi", nameHindi: "Kiwi", category: "fruit", imageEmoji: "🥝", season: "Winter",
    benefits: ["Vitamin C", "Digestion"], freshnessTips: ["Ripen at room temp", "Refrigerate when ripe"],
    nutrition: { calories: 61, carbohydrates: 15, protein: 1.1, fat: 0.5, fiber: 3, sugars: 9, sodium: 3 },
    dadiKiRasoi: "Kiwi vitamin C ka powerhouse hai - roz ek kiwi immunity ke liye achha mana jata hai.",
    healthTags: ["immunity", "digestion", "skin"] },
  { id: 26, name: "Coconut", nameHindi: "Nariyal", category: "fruit", imageEmoji: "🥥", season: "All year",
    benefits: ["Energy boost", "Hydration (water)"], freshnessTips: ["Use fresh within 2-3 days", "Store nariyal pani in fridge"],
    nutrition: { calories: 354, carbohydrates: 15, protein: 3.3, fat: 33, fiber: 9, sugars: 6, sodium: 20 },
    dadiKiRasoi: "Nariyal pani peene se garmi mein dehydration nahi hoti - ye purani gaon ki salaah hai.",
    healthTags: ["hydration", "energy", "heart"],
    packetAlt: { name: "Packaged Coconut Water", note: "Packaged nariyal pani mein preservative add hote hai - taaza nariyal pani zyada fresh hai." } },
  { id: 27, name: "Lemon", nameHindi: "Nimbu", category: "fruit", imageEmoji: "🍋", season: "All year",
    benefits: ["Vitamin C", "Digestion aid"], freshnessTips: ["Store at room temp", "Refrigerate for longer shelf life"],
    nutrition: { calories: 29, carbohydrates: 9, protein: 1.1, fat: 0.3, fiber: 2.8, sugars: 2.5, sodium: 2 },
    dadiKiRasoi: "Subah garam paani mein nimbu daal ke peene se pet saaf rehta hai - ye gharo mein roz ki salaah hai.",
    healthTags: ["digestion", "immunity", "skin"],
    packetAlt: { name: "Lemon Juice Concentrate (Packaged)", note: "Packaged concentrate mein preservative aur kam vitamin C hota hai - taaza nimbu behtar hai." } },

  // ===== VEGETABLES (new) =====
  { id: 28, name: "Brinjal", nameHindi: "Baingan", category: "vegetable", imageEmoji: "🍆", season: "All year",
    benefits: ["Fiber rich", "Heart health"], freshnessTips: ["Store in fridge", "Avoid cutting too early"],
    nutrition: { calories: 25, carbohydrates: 6, protein: 1, fat: 0.2, fiber: 3, sugars: 3.5, sodium: 2 },
    dadiKiRasoi: "Baingan ka bharta khane se pet bhar jata hai aur halka bhi rehta hai - purani ghar ki recipe.",
    healthTags: ["heart", "digestion", "weight"] },
  { id: 29, name: "Cauliflower", nameHindi: "Phool Gobi", category: "vegetable", imageEmoji: "⚪", season: "Winter",
    benefits: ["Low calorie", "Vitamin C"], freshnessTips: ["Store in fridge", "Wash before cooking"],
    nutrition: { calories: 25, carbohydrates: 5, protein: 1.9, fat: 0.3, fiber: 2, sugars: 1.9, sodium: 30 },
    dadiKiRasoi: "Sardi mein gobi-aloo ki sabzi ghar-ghar mein roz banti hai - ye season ki khaas sabzi hai.",
    healthTags: ["weight", "immunity"],
    packetAlt: { name: "Frozen Gobi (Packaged)", note: "Frozen gobi mein kuch vitamins kam ho jate hai - taaza gobi zyada poshak hoti hai." } },
  { id: 30, name: "Cabbage", nameHindi: "Patta Gobi", category: "vegetable", imageEmoji: "🟢", season: "Winter",
    benefits: ["Low calorie", "Digestion"], freshnessTips: ["Store in fridge", "Remove outer leaves before cooking"],
    nutrition: { calories: 25, carbohydrates: 6, protein: 1.3, fat: 0.1, fiber: 2.5, sugars: 3.2, sodium: 18 },
    dadiKiRasoi: "Patta gobi ka salad khane se pet halka rehta hai - diet mein roz shamil karne ki salaah hai.",
    healthTags: ["weight", "digestion"] },
  { id: 31, name: "Capsicum", nameHindi: "Shimla Mirch", category: "vegetable", imageEmoji: "🫑", season: "All year",
    benefits: ["Vitamin C", "Low calorie"], freshnessTips: ["Store in fridge", "Avoid washing before storing"],
    nutrition: { calories: 20, carbohydrates: 4.6, protein: 0.9, fat: 0.2, fiber: 1.7, sugars: 2.4, sodium: 3 },
    dadiKiRasoi: "Shimla mirch mein nimbu se bhi zyada vitamin C hota hai - kam log jaante hai ye baat.",
    healthTags: ["immunity", "weight"] },
  { id: 32, name: "Cucumber", nameHindi: "Kheera", category: "vegetable", imageEmoji: "🥒", season: "Summer",
    benefits: ["Hydration", "Skin health"], freshnessTips: ["Refrigerate", "Eat within 3-4 days"],
    nutrition: { calories: 15, carbohydrates: 3.6, protein: 0.7, fat: 0.1, fiber: 0.5, sugars: 1.7, sodium: 2 },
    dadiKiRasoi: "Garmi mein kheera khane se pet thanda rehta hai aur paani ki kami nahi hoti.",
    healthTags: ["hydration", "weight", "skin"] },
  { id: 33, name: "Okra", nameHindi: "Bhindi", category: "vegetable", imageEmoji: "🟩", season: "All year",
    benefits: ["Sugar control", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 33, carbohydrates: 7, protein: 1.9, fat: 0.2, fiber: 3.2, sugars: 1.5, sodium: 7 },
    dadiKiRasoi: "Bhindi ka paani khaali pet peene se sugar control mein madad milne ki purani gharelu maanyata hai.",
    healthTags: ["sugar", "digestion"] },
  { id: 34, name: "Green Peas", nameHindi: "Matar", category: "vegetable", imageEmoji: "🫛", season: "Winter",
    benefits: ["Protein rich", "Fiber rich"], freshnessTips: ["Store in fridge", "Shell just before cooking"],
    nutrition: { calories: 81, carbohydrates: 14, protein: 5.4, fat: 0.4, fiber: 5.7, sugars: 5.7, sodium: 5 },
    dadiKiRasoi: "Sardi mein taaza matar mile toh roz sabzi mein daalna chahiye, protein ka achha source hai.",
    healthTags: ["energy", "digestion", "heart"],
    packetAlt: { name: "Frozen Peas (Packaged)", note: "Frozen matar mein nutrients kuch kam ho jate hai - taaza matar season mein zyada poshak hota hai." } },
  { id: 35, name: "French Beans", nameHindi: "Faliyan", category: "vegetable", imageEmoji: "🟢", season: "Winter",
    benefits: ["Fiber rich", "Low calorie"], freshnessTips: ["Store in fridge", "Trim ends before cooking"],
    nutrition: { calories: 31, carbohydrates: 7, protein: 1.8, fat: 0.2, fiber: 3.4, sugars: 3.3, sodium: 6 },
    healthTags: ["weight", "digestion"] },
  { id: 36, name: "Drumstick", nameHindi: "Saijan", category: "vegetable", imageEmoji: "🟤", season: "Summer",
    benefits: ["Bone health", "Digestion"], freshnessTips: ["Use within 2-3 days", "Store in fridge"],
    nutrition: { calories: 37, carbohydrates: 8.5, protein: 2.1, fat: 0.2, fiber: 3.2, sugars: 0, sodium: 42 },
    dadiKiRasoi: "Saijan ki sambar ya sabzi haddiyon ke liye achhi mani jati hai - dakshin bharat ki purani salaah hai.",
    healthTags: ["bp", "digestion"] },
  { id: 37, name: "Mushroom", nameHindi: "Khumbi", category: "vegetable", imageEmoji: "🍄", season: "All year",
    benefits: ["Protein rich", "Low calorie"], freshnessTips: ["Store in paper bag in fridge", "Avoid washing before storing"],
    nutrition: { calories: 22, carbohydrates: 3.3, protein: 3.1, fat: 0.3, fiber: 1, sugars: 2, sodium: 5 },
    healthTags: ["weight", "immunity"],
    packetAlt: { name: "Canned Mushroom (Packaged)", note: "Canned mushroom mein sodium zyada hota hai - taaza khumbi healthier hai." } },
  { id: 38, name: "Sweet Corn", nameHindi: "Bhutta", category: "vegetable", imageEmoji: "🌽", season: "Summer",
    benefits: ["Energy boost", "Fiber rich"], freshnessTips: ["Eat fresh same day", "Store husk-on in fridge"],
    nutrition: { calories: 86, carbohydrates: 19, protein: 3.3, fat: 1.4, fiber: 2.7, sugars: 3.2, sodium: 15 },
    dadiKiRasoi: "Baarish mein bhutte ka maza kaun bhoolta hai - ghar pe bhuna bhutta sehat ke liye bhi achha hai.",
    healthTags: ["energy", "digestion"],
    packetAlt: { name: "Canned Sweet Corn (Packaged)", note: "Canned corn mein sodium/sugar add hota hai - taaza bhutta zyada healthy hai." } },
  { id: 39, name: "Broccoli", nameHindi: "Broccoli", category: "vegetable", imageEmoji: "🥦", season: "Winter",
    benefits: ["Vitamin C", "Heart health"], freshnessTips: ["Store in fridge", "Wash before cooking"],
    nutrition: { calories: 34, carbohydrates: 7, protein: 2.8, fat: 0.4, fiber: 2.6, sugars: 1.7, sodium: 33 },
    healthTags: ["heart", "immunity", "weight"],
    packetAlt: { name: "Frozen Broccoli (Packaged)", note: "Frozen mein kuch vitamin C kam ho jata hai - taaza broccoli zyada poshak hai." } },
  { id: 40, name: "Spring Onion", nameHindi: "Hara Pyaaz", category: "vegetable", imageEmoji: "🧅", season: "Winter",
    benefits: ["Vitamin C", "Digestion"], freshnessTips: ["Store in fridge wrapped in paper", "Use within a week"],
    nutrition: { calories: 32, carbohydrates: 7.3, protein: 1.8, fat: 0.2, fiber: 2.6, sugars: 2.3, sodium: 16 },
    healthTags: ["immunity", "digestion"] },
  { id: 41, name: "Cluster Beans", nameHindi: "Gawar Phali", category: "vegetable", imageEmoji: "🟢", season: "Winter",
    benefits: ["Sugar control", "Fiber rich"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 33, carbohydrates: 7, protein: 3.2, fat: 0.4, fiber: 4, sugars: 0, sodium: 9 },
    dadiKiRasoi: "Gawar phali sugar patients ke liye achhi sabzi mani jati hai - ye purana gharelu gyaan hai.",
    healthTags: ["sugar", "digestion"] },
  { id: 42, name: "Raw Banana", nameHindi: "Kaccha Kela", category: "vegetable", imageEmoji: "🍌", season: "All year",
    benefits: ["Digestion", "Energy boost"], freshnessTips: ["Store at room temp", "Use within a week"],
    nutrition: { calories: 122, carbohydrates: 31, protein: 1.3, fat: 0.4, fiber: 2.3, sugars: 15, sodium: 4 },
    dadiKiRasoi: "Loose motion mein kaccha kele ki sabzi khilane ki purani salaah dadi-nani dete aaye hai.",
    healthTags: ["digestion", "energy"] },
  { id: 43, name: "Kohlrabi", nameHindi: "Knol Khol", category: "vegetable", imageEmoji: "🟢", season: "Winter",
    benefits: ["Low calorie", "Vitamin C"], freshnessTips: ["Store in fridge", "Peel before cooking"],
    nutrition: { calories: 27, carbohydrates: 6.2, protein: 1.7, fat: 0.1, fiber: 3.6, sugars: 2.6, sodium: 20 },
    healthTags: ["weight", "immunity"] },

  // ===== LEAFY GREENS (new) =====
  { id: 44, name: "Mustard Greens", nameHindi: "Sarson", category: "leafy", imageEmoji: "🥬", season: "Winter",
    benefits: ["Bone health", "Iron rich"], freshnessTips: ["Use within 2 days", "Store in fridge"],
    nutrition: { calories: 27, carbohydrates: 4.7, protein: 2.9, fat: 0.4, fiber: 3.2, sugars: 1.4, sodium: 20 },
    dadiKiRasoi: "Punjab mein sarson ka saag sardi mein roz banta hai - taakat ke liye purana khaana mana jata hai.",
    healthTags: ["bp", "heart", "energy"],
    packetAlt: { name: "Frozen Sarson Saag (Packaged)", note: "Frozen mein kuch nutrients aur taste kam ho jata hai - taaza saag zyada swaad deta hai." } },
  { id: 45, name: "Bathua", nameHindi: "Bathua", category: "leafy", imageEmoji: "🥬", season: "Winter",
    benefits: ["Iron rich", "Digestion"], freshnessTips: ["Use within 2 days", "Store in fridge"],
    nutrition: { calories: 43, carbohydrates: 6, protein: 4.2, fat: 0.8, fiber: 2.9, sugars: 0, sodium: 76 },
    dadiKiRasoi: "Bathue ka raita pet ki garmi shaant karne ke liye purane zamane se khaya jata hai.",
    healthTags: ["digestion", "energy"] },
  { id: 46, name: "Lettuce", nameHindi: "Salad Patta", category: "leafy", imageEmoji: "🥬", season: "Winter",
    benefits: ["Hydration", "Low calorie"], freshnessTips: ["Store in fridge", "Wash before eating"],
    nutrition: { calories: 15, carbohydrates: 2.9, protein: 1.4, fat: 0.2, fiber: 1.3, sugars: 0.8, sodium: 28 },
    healthTags: ["weight", "hydration"],
    packetAlt: { name: "Packaged Salad Mix", note: "Packaged mix kabhi-kabhi der se wash hota hai - taaza patte dhokar khana behtar hai." } },
  { id: 47, name: "Amaranth", nameHindi: "Chaulai", category: "leafy", imageEmoji: "🥬", season: "All year",
    benefits: ["Iron rich", "Bone health"], freshnessTips: ["Use within 2 days", "Store in fridge"],
    nutrition: { calories: 23, carbohydrates: 4.0, protein: 2.5, fat: 0.3, fiber: 2.1, sugars: 0, sodium: 20 },
    dadiKiRasoi: "Chaulai ka saag bachhon ki haddiyon ke liye achha mana jata hai - ghar ki purani salaah hai.",
    healthTags: ["bp", "energy"] },
  { id: 48, name: "Colocasia Leaves", nameHindi: "Arbi Patta", category: "leafy", imageEmoji: "🍃", season: "Monsoon",
    benefits: ["Vitamin A", "Digestion"], freshnessTips: ["Use within 1-2 days", "Cook well before eating"],
    nutrition: { calories: 38, carbohydrates: 6.7, protein: 3.7, fat: 0.7, fiber: 2, sugars: 0, sodium: 2 },
    dadiKiRasoi: "Arbi ke patte ke patode/vadiyan baarish ke mausam mein ghar-ghar mein bante hai.",
    healthTags: ["digestion", "immunity"] },
  { id: 49, name: "Drumstick Leaves", nameHindi: "Saijan Patta", category: "leafy", imageEmoji: "🍃", season: "All year",
    benefits: ["Protein rich", "Iron rich"], freshnessTips: ["Use fresh within 1-2 days", "Store in fridge"],
    nutrition: { calories: 64, carbohydrates: 8.3, protein: 9.4, fat: 1.4, fiber: 2, sugars: 0, sodium: 9 },
    dadiKiRasoi: "Saijan ke patton ka soup kamzori door karne ke liye purane zamane se diya jata hai.",
    healthTags: ["energy", "immunity", "bp"],
    packetAlt: { name: "Moringa Powder (Packaged)", note: "Powder mein kuch vitamin kam ho jate hai sukhane mein - taaza patte zyada poshak hote hai." } },
  { id: 50, name: "Radish Leaves", nameHindi: "Mooli Patta", category: "leafy", imageEmoji: "🍃", season: "Winter",
    benefits: ["Digestion", "Vitamin C"], freshnessTips: ["Use within 2 days", "Store in fridge"],
    nutrition: { calories: 22, carbohydrates: 4.2, protein: 2.4, fat: 0.5, fiber: 1.7, sugars: 0, sodium: 38 },
    dadiKiRasoi: "Mooli ke patton ki sabzi bhi mooli jitni hi faydemand mani jati hai - kam log try karte hai.",
    healthTags: ["digestion", "liver"] },
  { id: 51, name: "Red Amaranth", nameHindi: "Lal Saag", category: "leafy", imageEmoji: "🍃", season: "All year",
    benefits: ["Iron rich", "Skin health"], freshnessTips: ["Use within 2 days", "Store in fridge"],
    nutrition: { calories: 26, carbohydrates: 4.4, protein: 2.6, fat: 0.3, fiber: 2.6, sugars: 0, sodium: 24 },
    dadiKiRasoi: "Lal saag khoon badhane ke liye purani salaah mein khilaya jata hai - khaaskar anaemia mein.",
    healthTags: ["energy", "skin"] },

  // ===== ROOT VEGETABLES (new) =====
  { id: 52, name: "Sweet Potato", nameHindi: "Shakarkandi", category: "root", imageEmoji: "🍠", season: "Winter",
    benefits: ["Energy boost", "Vitamin A"], freshnessTips: ["Store in cool dry place", "Avoid fridge"],
    nutrition: { calories: 86, carbohydrates: 20, protein: 1.6, fat: 0.1, fiber: 3, sugars: 4.2, sodium: 55 },
    dadiKiRasoi: "Navratri ke vrat mein shakarkandi khane ki purani parampara hai - energy ke liye behtareen.",
    healthTags: ["energy", "digestion", "immunity"],
    packetAlt: { name: "Sweet Potato Chips (Packaged)", note: "Chips fried hoti hai - bhuni shakarkandi zyada healthy option hai." } },
  { id: 53, name: "Beetroot", nameHindi: "Chukandar", category: "root", imageEmoji: "🔴", season: "Winter",
    benefits: ["Blood health", "Heart health"], freshnessTips: ["Store in fridge", "Wash before cutting"],
    nutrition: { calories: 43, carbohydrates: 10, protein: 1.6, fat: 0.2, fiber: 2.8, sugars: 7, sodium: 78 },
    dadiKiRasoi: "Khoon ki kami mein chukandar ka juice peene ki salaah ghar ke bade dete aaye hai.",
    healthTags: ["energy", "heart", "bp"],
    packetAlt: { name: "Beetroot Juice (Packaged)", note: "Packaged juice mein sugar add hoti hai - taaza chukandar behtar hai." } },
  { id: 54, name: "Turnip", nameHindi: "Shalgam", category: "root", imageEmoji: "⚪", season: "Winter",
    benefits: ["Low calorie", "Digestion"], freshnessTips: ["Store in fridge", "Peel before cooking"],
    nutrition: { calories: 28, carbohydrates: 6.4, protein: 0.9, fat: 0.1, fiber: 1.8, sugars: 3.8, sodium: 67 },
    healthTags: ["weight", "digestion"] },
  { id: 55, name: "Yam", nameHindi: "Suran", category: "root", imageEmoji: "🟤", season: "Winter",
    benefits: ["Energy boost", "Fiber rich"], freshnessTips: ["Store in cool dry place", "Cook well before eating"],
    nutrition: { calories: 118, carbohydrates: 27.9, protein: 1.5, fat: 0.2, fiber: 4.1, sugars: 0, sodium: 9 },
    dadiKiRasoi: "Diwali pe suran ki sabzi banane ki parampara kayi gharon mein hoti hai.",
    healthTags: ["energy", "digestion"] },
  { id: 56, name: "Colocasia Root", nameHindi: "Arbi", category: "root", imageEmoji: "🟤", season: "Monsoon",
    benefits: ["Energy boost", "Digestion"], freshnessTips: ["Store in cool dry place", "Cook thoroughly"],
    nutrition: { calories: 112, carbohydrates: 26.5, protein: 1.5, fat: 0.2, fiber: 4.1, sugars: 0, sodium: 2 },
    healthTags: ["energy", "digestion"] },
  { id: 57, name: "Tapioca", nameHindi: "Tapioca", category: "root", imageEmoji: "⚪", season: "Monsoon",
    benefits: ["High energy", "Fasting food"], freshnessTips: ["Store in cool place", "Use within a week"],
    nutrition: { calories: 160, carbohydrates: 38, protein: 1.4, fat: 0.3, fiber: 1.8, sugars: 1.7, sodium: 14 },
    dadiKiRasoi: "Vrat mein sabudana ki tarah tapioca/kachalu khaya jata hai - quick energy ke liye.",
    healthTags: ["energy"] },
  { id: 58, name: "Water Chestnut", nameHindi: "Singhara", category: "root", imageEmoji: "🟤", season: "Winter",
    benefits: ["Energy boost", "Digestion"], freshnessTips: ["Store in fridge", "Peel before eating"],
    nutrition: { calories: 97, carbohydrates: 24, protein: 2, fat: 0.1, fiber: 3, sugars: 0, sodium: 7 },
    dadiKiRasoi: "Vrat ke aate mein singhare ka aata istemal hota hai - purani vrat parampara hai.",
    healthTags: ["energy", "digestion"],
    packetAlt: { name: "Singhara Atta (Packaged Flour)", note: "Packaged atta mein kabhi milawat ka risk hota hai - taaza singhara grind karna safe hai." } },
  { id: 59, name: "Lotus Root", nameHindi: "Kamal Kakdi", category: "root", imageEmoji: "⚪", season: "Winter",
    benefits: ["Fiber rich", "Digestion"], freshnessTips: ["Store in fridge", "Soak before cooking"],
    nutrition: { calories: 74, carbohydrates: 17, protein: 2.6, fat: 0.1, fiber: 4.9, sugars: 0, sodium: 45 },
    healthTags: ["digestion", "heart"] },
  { id: 60, name: "Arrowroot", nameHindi: "Tikhur", category: "root", imageEmoji: "⚪", season: "Winter",
    benefits: ["Easy digestion", "Fasting food"], freshnessTips: ["Store in cool dry place"],
    nutrition: { calories: 65, carbohydrates: 13.4, protein: 0.7, fat: 0.1, fiber: 1.3, sugars: 0, sodium: 5 },
    dadiKiRasoi: "Tikhur ka halwa bimari ke baad halka khaane ke liye purane zamane se diya jata hai.",
    healthTags: ["digestion", "energy"] },

  // ===== GOURDS (new category) =====
  { id: 61, name: "Bottle Gourd", nameHindi: "Lauki", category: "gourd", imageEmoji: "🥒", season: "All year",
    benefits: ["Hydration", "Heart health"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 14, carbohydrates: 3.4, protein: 0.6, fat: 0.02, fiber: 0.5, sugars: 1.3, sodium: 2 },
    dadiKiRasoi: "Lauki ka juice subah khaali pet peene se weight aur heart health mein madad ki purani salaah hai (zyada matra na le).",
    healthTags: ["heart", "weight", "hydration"],
    packetAlt: { name: "Lauki Juice (Packaged)", note: "Packaged juice mein preservative ho sakte hai - ghar pe taaza juice banana safe hai." } },
  { id: 62, name: "Apple Gourd", nameHindi: "Tinda", category: "gourd", imageEmoji: "🟢", season: "Summer",
    benefits: ["Low calorie", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 16, carbohydrates: 3.7, protein: 1, fat: 0.1, fiber: 1.7, sugars: 0, sodium: 5 },
    healthTags: ["weight", "digestion"] },
  { id: 63, name: "Ridge Gourd", nameHindi: "Turai", category: "gourd", imageEmoji: "🥒", season: "Summer",
    benefits: ["Hydration", "Low calorie"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 20, carbohydrates: 4.4, protein: 1.2, fat: 0.2, fiber: 1.1, sugars: 0, sodium: 20 },
    healthTags: ["hydration", "weight"] },
  { id: 64, name: "Pumpkin", nameHindi: "Kaddu", category: "gourd", imageEmoji: "🎃", season: "Winter",
    benefits: ["Eye health", "Low calorie"], freshnessTips: ["Store in cool dry place", "Refrigerate after cutting"],
    nutrition: { calories: 26, carbohydrates: 6.5, protein: 1, fat: 0.1, fiber: 0.5, sugars: 2.8, sodium: 1 },
    dadiKiRasoi: "Kaddu ki sabzi aankhon ke liye achhi mani jati hai - vitamin A ki wajah se purana gharelu gyaan hai.",
    healthTags: ["weight", "immunity"],
    packetAlt: { name: "Pumpkin Puree (Canned)", note: "Canned puree mein preservative ho sakta hai - taaza kaddu zyada fresh hota hai." } },
  { id: 65, name: "Bitter Gourd", nameHindi: "Karela", category: "gourd", imageEmoji: "🥒", season: "Summer",
    benefits: ["Sugar control", "Liver health"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 17, carbohydrates: 3.7, protein: 1, fat: 0.2, fiber: 2.8, sugars: 0, sodium: 6 },
    dadiKiRasoi: "Sugar patients ke liye karela aur uska juice purane zamane se sabse pehli salaah mana jata hai.",
    healthTags: ["sugar", "liver", "digestion"],
    packetAlt: { name: "Karela Juice (Packaged)", note: "Packaged juice mein additive ho sakte hai - taaza karela ka juice zyada effective mana jata hai." } },
  { id: 66, name: "Sponge Gourd", nameHindi: "Tori", category: "gourd", imageEmoji: "🥒", season: "Summer",
    benefits: ["Hydration", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 20, carbohydrates: 4.5, protein: 1.2, fat: 0.2, fiber: 1.1, sugars: 0, sodium: 11 },
    healthTags: ["hydration", "digestion"] },
  { id: 67, name: "Ash Gourd", nameHindi: "Petha", category: "gourd", imageEmoji: "⚪", season: "Winter",
    benefits: ["Cooling effect", "Digestion"], freshnessTips: ["Store in cool place", "Refrigerate after cutting"],
    nutrition: { calories: 13, carbohydrates: 3, protein: 0.4, fat: 0.2, fiber: 2.9, sugars: 0, sodium: 111 },
    dadiKiRasoi: "Petha ki mithai Agra mein mashhoor hai, par sabzi roop mein bhi pet ke liye achha mana jata hai.",
    healthTags: ["digestion", "hydration"],
    packetAlt: { name: "Petha Mithai (Packaged)", note: "Petha mithai mein sugar bahut zyada hoti hai - taaza petha ki sabzi healthier hai." } },
  { id: 68, name: "Ivy Gourd", nameHindi: "Tindora", category: "gourd", imageEmoji: "🟢", season: "All year",
    benefits: ["Sugar control", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 17, carbohydrates: 3.7, protein: 1.2, fat: 0.4, fiber: 2, sugars: 0, sodium: 11 },
    healthTags: ["sugar", "digestion"] },
  { id: 69, name: "Chayote", nameHindi: "Chow Chow", category: "gourd", imageEmoji: "🟢", season: "Winter",
    benefits: ["Low calorie", "Hydration"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 19, carbohydrates: 4.5, protein: 0.8, fat: 0.1, fiber: 1.7, sugars: 1.7, sodium: 2 },
    healthTags: ["weight", "hydration"] },
  { id: 70, name: "Snake Gourd", nameHindi: "Chichinda", category: "gourd", imageEmoji: "🥒", season: "Summer",
    benefits: ["Hydration", "Liver health"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 18, carbohydrates: 4, protein: 0.5, fat: 0.1, fiber: 1.2, sugars: 0, sodium: 2 },
    healthTags: ["hydration", "liver"] },

  // ===== MASALE & HERBS (new category) =====
  { id: 71, name: "Ginger", nameHindi: "Adrak", category: "masala", imageEmoji: "🫚", season: "All year",
    benefits: ["Digestion aid", "Cold relief"], freshnessTips: ["Store in fridge", "Avoid moisture"],
    nutrition: { calories: 80, carbohydrates: 18, protein: 1.8, fat: 0.8, fiber: 2, sugars: 1.7, sodium: 13 },
    dadiKiRasoi: "Khansi-zukaam mein adrak wali chai peene ki salaah ghar mein roz dadi dete aaye hai.",
    healthTags: ["digestion", "immunity"],
    packetAlt: { name: "Ginger Paste (Packaged)", note: "Packaged paste mein preservative ho sakte hai - taaza adrak peeskar use karna behtar hai." } },
  { id: 72, name: "Garlic", nameHindi: "Lehsun", category: "masala", imageEmoji: "🧄", season: "All year",
    benefits: ["Heart health", "Immunity"], freshnessTips: ["Store in cool dry place", "Avoid fridge"],
    nutrition: { calories: 149, carbohydrates: 33, protein: 6.4, fat: 0.5, fiber: 2.1, sugars: 1, sodium: 17 },
    dadiKiRasoi: "Khaali pet lehsun ki kali khane se cholesterol control hone ki purani gharelu maanyata hai.",
    healthTags: ["heart", "immunity", "bp"],
    packetAlt: { name: "Garlic Paste/Powder (Packaged)", note: "Packaged paste mein preservative aur namak hota hai - taaza lehsun zyada fayda karta hai." } },
  { id: 73, name: "Green Chili", nameHindi: "Hari Mirch", category: "masala", imageEmoji: "🌶️", season: "All year",
    benefits: ["Vitamin C", "Metabolism boost"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 40, carbohydrates: 9, protein: 2, fat: 0.2, fiber: 1.5, sugars: 5, sodium: 9 },
    healthTags: ["immunity", "energy"] },
  { id: 74, name: "Coriander Leaves", nameHindi: "Dhaniya Patta", category: "masala", imageEmoji: "🌿", season: "All year",
    benefits: ["Digestion", "Detox"], freshnessTips: ["Store in fridge wrapped in paper", "Use within a week"],
    nutrition: { calories: 23, carbohydrates: 3.7, protein: 2.1, fat: 0.5, fiber: 2.8, sugars: 0.9, sodium: 46 },
    dadiKiRasoi: "Dhaniye ki chutney khane se khana zyada swaadisht aur pachne mein aasaan ho jata hai.",
    healthTags: ["digestion", "liver"],
    packetAlt: { name: "Dried Dhaniya Powder (Packaged)", note: "Sukha dhaniya powder mein fresh ka taste aur kuch nutrients kam ho jate hai - taaza patte behtar hai." } },
  { id: 75, name: "Mint Leaves", nameHindi: "Pudina", category: "masala", imageEmoji: "🌿", season: "Summer",
    benefits: ["Digestion", "Cooling effect"], freshnessTips: ["Store in fridge wrapped in paper", "Use within a week"],
    nutrition: { calories: 70, carbohydrates: 15, protein: 3.8, fat: 0.9, fiber: 8, sugars: 0, sodium: 31 },
    dadiKiRasoi: "Garmi mein pudina ka sharbat pet thanda rakhta hai - ye purani gaon ki salaah hai.",
    healthTags: ["digestion", "hydration"],
    packetAlt: { name: "Mint Sauce (Packaged)", note: "Packaged sauce mein namak/preservative zyada hota hai - taaza pudine ki chutney healthier hai." } },
  { id: 76, name: "Curry Leaves", nameHindi: "Kadhi Patta", category: "masala", imageEmoji: "🌿", season: "All year",
    benefits: ["Hair health", "Sugar control"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 108, carbohydrates: 18.7, protein: 6.1, fat: 1, fiber: 6.4, sugars: 0, sodium: 4 },
    dadiKiRasoi: "Kadhi patte chabane se baal kaale aur ghane rehte hai - dakshin bharat ki purani salaah hai.",
    healthTags: ["sugar", "skin"],
    packetAlt: { name: "Dried Curry Leaf Powder (Packaged)", note: "Sukhe patton mein kuch poshak tatva kam ho jate hai - taaza patte zyada fayda karte hai." } },
  { id: 77, name: "Fresh Turmeric", nameHindi: "Kacchi Haldi", category: "masala", imageEmoji: "🟡", season: "Winter",
    benefits: ["Anti-inflammatory", "Immunity"], freshnessTips: ["Store in fridge", "Use within 2 weeks"],
    nutrition: { calories: 78, carbohydrates: 20, protein: 3, fat: 1, fiber: 7, sugars: 3, sodium: 20 },
    dadiKiRasoi: "Chot lagne pe haldi wala doodh peene ki salaah ghar mein hamesha di jati hai.",
    healthTags: ["immunity", "liver", "skin"],
    packetAlt: { name: "Turmeric Powder (Packaged)", note: "Packaged haldi powder mein milawat ka risk hota hai - taaza kacchi haldi zyada pure hoti hai." } },
  { id: 78, name: "Lemongrass", nameHindi: "Lemongrass", category: "masala", imageEmoji: "🌿", season: "Summer",
    benefits: ["Digestion", "Stress relief"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 99, carbohydrates: 25.2, protein: 1.8, fat: 0.5, fiber: 0, sugars: 0, sodium: 6 },
    healthTags: ["digestion", "hydration"],
    packetAlt: { name: "Lemongrass Tea Bags (Packaged)", note: "Tea bags mein flavor time ke saath kam ho jata hai - taazi lemongrass zyada aromatic hoti hai." } },
  { id: 79, name: "Holy Basil", nameHindi: "Tulsi", category: "masala", imageEmoji: "🌿", season: "All year",
    benefits: ["Immunity", "Respiratory health"], freshnessTips: ["Use fresh", "Store in fridge briefly"],
    nutrition: { calories: 22, carbohydrates: 2.7, protein: 3.2, fat: 0.6, fiber: 1.6, sugars: 0.3, sodium: 4 },
    dadiKiRasoi: "Roz subah tulsi ke 2-3 patte khane se immunity badhne ki purani gharelu salaah hai.",
    healthTags: ["immunity", "digestion"],
    packetAlt: { name: "Tulsi Tea/Drops (Packaged)", note: "Packaged products mein processing se kuch fayda kam ho jata hai - taaze patte zyada asar karte hai." } },
  { id: 80, name: "Indian Borage", nameHindi: "Ajwain Patta", category: "masala", imageEmoji: "🌿", season: "All year",
    benefits: ["Cold relief", "Digestion"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 50, carbohydrates: 9, protein: 2.6, fat: 0.8, fiber: 2, sugars: 0, sodium: 14 },
    dadiKiRasoi: "Khansi mein ajwain ke patte chabane ya unka pakoda khane ki purani salaah hai.",
    healthTags: ["digestion", "immunity"] },
  { id: 81, name: "Dill", nameHindi: "Suva Bhaji", category: "masala", imageEmoji: "🌿", season: "Winter",
    benefits: ["Digestion", "Bone health"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 43, carbohydrates: 7, protein: 3.5, fat: 1.1, fiber: 3, sugars: 0, sodium: 60 },
    dadiKiRasoi: "Suva bhaji khilane se bachhon ki haddiyan mazboot hone ki purani salaah hai.",
    healthTags: ["digestion", "bp"] },
  { id: 82, name: "Tamarind", nameHindi: "Imli", category: "masala", imageEmoji: "🟤", season: "Winter",
    benefits: ["Digestion", "Antioxidants"], freshnessTips: ["Store in cool dry place", "Refrigerate paste"],
    nutrition: { calories: 239, carbohydrates: 62.5, protein: 2.8, fat: 0.6, fiber: 5.1, sugars: 38, sodium: 28 },
    dadiKiRasoi: "Imli ka pani garmi mein peene se thakaan door hone ki purani salaah hai.",
    healthTags: ["digestion", "energy"],
    packetAlt: { name: "Tamarind Concentrate (Packaged)", note: "Packaged paste mein preservative add hote hai - taazi imli se ghar pe paste banana behtar hai." } },
  { id: 83, name: "Fennel Fronds", nameHindi: "Saunf Patta", category: "masala", imageEmoji: "🌿", season: "Winter",
    benefits: ["Digestion", "Fresh breath"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 31, carbohydrates: 7.3, protein: 1.6, fat: 0.2, fiber: 3.1, sugars: 0, sodium: 4 },
    dadiKiRasoi: "Khana ke baad saunf khane ki purani parampara pet aur taza saans ke liye hai.",
    healthTags: ["digestion"],
    packetAlt: { name: "Saunf/Fennel Seeds (Packaged)", note: "Sukhi saunf mein bhi achha fayda hai, par taazi pattiyan zyada aromatic hoti hai." } },
  { id: 84, name: "Green Garlic", nameHindi: "Hara Lehsun", category: "masala", imageEmoji: "🧄", season: "Winter",
    benefits: ["Heart health", "Immunity"], freshnessTips: ["Store in fridge", "Use within a week"],
    nutrition: { calories: 49, carbohydrates: 9, protein: 2.7, fat: 0.4, fiber: 2.6, sugars: 0, sodium: 20 },
    healthTags: ["heart", "immunity"] },
  { id: 85, name: "Neem Leaves", nameHindi: "Neem Patta", category: "masala", imageEmoji: "🌿", season: "All year",
    benefits: ["Skin health", "Blood purifier"], freshnessTips: ["Use fresh", "Avoid excess consumption"],
    nutrition: { calories: 61, carbohydrates: 9, protein: 7.1, fat: 1, fiber: 6, sugars: 0, sodium: 17 },
    dadiKiRasoi: "Neem ke patte khane se khoon saaf hone aur skin clear hone ki purani gharelu maanyata hai (zyada matra mein na le).",
    healthTags: ["skin", "liver"] },
  { id: 86, name: "Bay Leaf", nameHindi: "Tej Patta", category: "masala", imageEmoji: "🍃", season: "All year",
    benefits: ["Digestion", "Aroma"], freshnessTips: ["Store in cool dry place", "Use fresh for best flavor"],
    nutrition: { calories: 90, carbohydrates: 20, protein: 2, fat: 1, fiber: 4, sugars: 0, sodium: 10 },
    healthTags: ["digestion"],
    packetAlt: { name: "Dried Tej Patta (Packaged)", note: "Sukha tej patta zyada time tak chalta hai par taaza patte zyada khushboo dete hai." } },
  { id: 87, name: "Drumstick Flowers", nameHindi: "Saijan Phool", category: "masala", imageEmoji: "🌼", season: "Summer",
    benefits: ["Iron rich", "Immunity"], freshnessTips: ["Use fresh within a day", "Store in fridge briefly"],
    nutrition: { calories: 65, carbohydrates: 8, protein: 5, fat: 1, fiber: 4, sugars: 0, sodium: 9 },
    healthTags: ["energy", "immunity"] },
  { id: 88, name: "Garden Cress", nameHindi: "Halim/Asaliya", category: "masala", imageEmoji: "🌱", season: "Winter",
    benefits: ["Iron rich", "Bone health"], freshnessTips: ["Use fresh", "Store in fridge briefly"],
    nutrition: { calories: 38, carbohydrates: 5.5, protein: 2.6, fat: 0.6, fiber: 1.1, sugars: 0, sodium: 14 },
    dadiKiRasoi: "Nayi maa aur bachhon ko halim ke laddu dete hai - taakat ke liye purani parampara hai.",
    healthTags: ["energy", "bp"],
    packetAlt: { name: "Halim Laddu (Packaged)", note: "Packaged laddu mein sugar/ghee zyada hota hai - taaza halim se ghar pe banana healthier hai." } },

  // ===== LEGUMES & BEANS (new category) =====
  { id: 89, name: "Moong Sprouts", nameHindi: "Moong Sprouts", category: "legume", imageEmoji: "🌱", season: "All year",
    benefits: ["Protein rich", "Low calorie"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 30, carbohydrates: 6, protein: 3, fat: 0.2, fiber: 1.8, sugars: 1, sodium: 4 },
    dadiKiRasoi: "Subah moong sprouts khane se din bhar halka aur energetic feel hota hai - ye purani diet salaah hai.",
    healthTags: ["weight", "energy", "digestion"],
    packetAlt: { name: "Roasted Moong Snacks (Packaged)", note: "Packaged snacks mein namak/oil zyada hota hai - taaze sprouts healthier hai." } },
  { id: 90, name: "Fresh Green Chickpea", nameHindi: "Hara Chana", category: "legume", imageEmoji: "🟢", season: "Winter",
    benefits: ["Protein rich", "Fiber rich"], freshnessTips: ["Store in fridge", "Boil before eating"],
    nutrition: { calories: 164, carbohydrates: 27, protein: 9, fat: 2.6, fiber: 7.6, sugars: 0, sodium: 24 },
    dadiKiRasoi: "Sardi mein hara chana bhuna khana purani winter snacking tradition hai.",
    healthTags: ["energy", "digestion", "weight"] },
  { id: 91, name: "Flat Beans", nameHindi: "Sem Phali", category: "legume", imageEmoji: "🫛", season: "Winter",
    benefits: ["Fiber rich", "Low calorie"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 31, carbohydrates: 6, protein: 2.8, fat: 0.2, fiber: 3.4, sugars: 0, sodium: 4 },
    healthTags: ["weight", "digestion"] },
  { id: 92, name: "Black-eyed Pea Pods", nameHindi: "Lobia Phali", category: "legume", imageEmoji: "🫛", season: "Summer",
    benefits: ["Protein rich", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 42, carbohydrates: 7.5, protein: 3, fat: 0.3, fiber: 4, sugars: 0, sodium: 4 },
    healthTags: ["energy", "digestion"] },
  { id: 93, name: "Fresh Soybean", nameHindi: "Hari Soyabean", category: "legume", imageEmoji: "🫛", season: "Monsoon",
    benefits: ["High protein", "Heart health"], freshnessTips: ["Store in fridge", "Boil before eating"],
    nutrition: { calories: 122, carbohydrates: 9, protein: 11, fat: 5, fiber: 5, sugars: 2, sodium: 6 },
    healthTags: ["energy", "heart", "weight"],
    packetAlt: { name: "Soya Chunks (Packaged)", note: "Packaged soya chunks processed hote hai - taazi soyabean zyada natural protein source hai." } },
  { id: 94, name: "Hyacinth Bean", nameHindi: "Sem", category: "legume", imageEmoji: "🫛", season: "Winter",
    benefits: ["Protein rich", "Fiber rich"], freshnessTips: ["Store in fridge", "Cook well before eating"],
    nutrition: { calories: 49, carbohydrates: 8.7, protein: 4, fat: 0.3, fiber: 4.2, sugars: 0, sodium: 5 },
    healthTags: ["digestion", "energy"] },
  { id: 95, name: "Fresh Kidney Bean Pods", nameHindi: "Rajma Phali", category: "legume", imageEmoji: "🫛", season: "Winter",
    benefits: ["Fiber rich", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 31, carbohydrates: 7, protein: 1.8, fat: 0.1, fiber: 4, sugars: 1, sodium: 2 },
    healthTags: ["digestion", "weight"] },
  { id: 96, name: "Khejri Beans", nameHindi: "Sangri", category: "legume", imageEmoji: "🟤", season: "Summer",
    benefits: ["Fiber rich", "Energy boost"], freshnessTips: ["Dry well before storing", "Soak before cooking if dried"],
    nutrition: { calories: 107, carbohydrates: 18, protein: 4, fat: 1.5, fiber: 7, sugars: 0, sodium: 25 },
    dadiKiRasoi: "Rajasthan mein sangri ki sabzi registan ke khaane mein purane zamane se khaas mani jati hai.",
    healthTags: ["energy", "digestion"],
    packetAlt: { name: "Dried Sangri (Packaged)", note: "Sukhi sangri zyada time tak chalti hai par taazi sangri ka swaad alag hota hai." } },
  { id: 97, name: "Winged Bean", nameHindi: "Winged Bean", category: "legume", imageEmoji: "🫛", season: "Monsoon",
    benefits: ["High protein", "Fiber rich"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 49, carbohydrates: 4.3, protein: 6.9, fat: 1.1, fiber: 2.8, sugars: 0, sodium: 38 },
    healthTags: ["energy", "digestion"] },
  { id: 98, name: "Black Gram Sprouts", nameHindi: "Urad Sprouts", category: "legume", imageEmoji: "🌱", season: "All year",
    benefits: ["Protein rich", "Digestion"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 105, carbohydrates: 19, protein: 7, fat: 0.6, fiber: 4.5, sugars: 0, sodium: 5 },
    healthTags: ["digestion", "energy"] },
  { id: 99, name: "Horse Gram Sprouts", nameHindi: "Kulthi Sprouts", category: "legume", imageEmoji: "🌱", season: "Winter",
    benefits: ["High protein", "Weight management"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 109, carbohydrates: 20, protein: 17, fat: 0.4, fiber: 5, sugars: 0, sodium: 13 },
    dadiKiRasoi: "Kulthi ka pani peene se kidney stone mein fayda hone ki purani gharelu maanyata hai.",
    healthTags: ["weight", "kidney", "energy"] },
  { id: 100, name: "Chickpea Sprouts", nameHindi: "Chana Sprouts", category: "legume", imageEmoji: "🌱", season: "All year",
    benefits: ["Protein rich", "Fiber rich"], freshnessTips: ["Store in fridge", "Use within 2-3 days"],
    nutrition: { calories: 164, carbohydrates: 28, protein: 8.9, fat: 2.6, fiber: 8, sugars: 0, sodium: 7 },
    healthTags: ["energy", "weight", "digestion"],
    packetAlt: { name: "Roasted Chana (Packaged)", note: "Packaged roasted chana mein namak/oil zyada ho sakta hai - taaze sprouts healthier hai." } },
];

const HEALTH_TAG_META: Record<string, { label: string; emoji: string }> = {
  bp: { label: "BP Control", emoji: "🩺" },
  sugar: { label: "Sugar Control", emoji: "🩸" },
  weight: { label: "Weight Loss", emoji: "⚖️" },
  digestion: { label: "Digestion", emoji: "🌀" },
  immunity: { label: "Immunity", emoji: "🛡️" },
  heart: { label: "Heart Health", emoji: "❤️" },
  liver: { label: "Liver Health", emoji: "🧡" },
  kidney: { label: "Kidney Health", emoji: "🫘" },
  skin: { label: "Skin Health", emoji: "✨" },
  energy: { label: "Energy", emoji: "⚡" },
  hydration: { label: "Hydration", emoji: "💧" },
};

const CATEGORY_LABELS: Record<string, string> = {
  fruit: "🍓 Fruits",
  vegetable: "🥦 Vegetables",
  leafy: "🥬 Leafy Greens",
  root: "🥕 Root Vegetables",
  gourd: "🎃 Gourds",
  masala: "🌿 Masale & Herbs",
  legume: "🫘 Legumes & Beans",
};

const CATEGORY_ORDER = ["fruit", "vegetable", "leafy", "root", "gourd", "masala", "legume"];

function FruitVeggieCard({ item }: { item: FruitVeggie }) {
  const [expanded, setExpanded] = useState(false);
  const n = item.nutrition;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpanded((v) => !v)}>
          <span className="text-3xl w-12 text-center flex-shrink-0">{item.imageEmoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base">{item.nameHindi}</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
            {item.season && <p className="text-xs text-primary/70 mt-0.5">Season: {item.season}</p>}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-sm font-bold text-primary">{n.calories}kcal</p>
            <p className="text-xs text-muted-foreground">per 100g</p>
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-3 pb-3 border-t space-y-3">
                <div className="grid grid-cols-3 gap-2 pt-3">
                  {[
                    { label: "Carbs", val: n.carbohydrates, unit: "g" },
                    { label: "Protein", val: n.protein, unit: "g" },
                    { label: "Fat", val: n.fat, unit: "g" },
                    { label: "Fiber", val: n.fiber, unit: "g" },
                    { label: "Sugar", val: n.sugars, unit: "g" },
                    { label: "Sodium", val: n.sodium, unit: "mg" },
                  ].map(({ label, val, unit }) => (
                    <div key={label} className="text-center bg-muted/50 rounded-lg p-2">
                      <p className="text-sm font-bold">{val}{unit}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                {item.benefits.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Benefits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.benefits.map((b) => <Badge key={b} variant="secondary" className="text-xs bg-green-100 text-green-800">{b}</Badge>)}
                    </div>
                  </div>
                )}
                {item.freshnessTips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Freshness Tips</p>
                    <ul className="space-y-1">
                      {item.freshnessTips.map((tip) => <li key={tip} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-primary">•</span> {tip}</li>)}
                    </ul>
                  </div>
                )}
                {item.dadiKiRasoi && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">👵 Dadi Ki Rasoi</p>
                    <p className="text-xs text-amber-900">{item.dadiKiRasoi}</p>
                  </div>
                )}
                {item.healthTags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Good For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.healthTags.map((tag) => {
                        const meta = HEALTH_TAG_META[tag];
                        if (!meta) return null;
                        return (
                          <Badge key={tag} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {meta.emoji} {meta.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
                {item.packetAlt && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">📦 Packet vs Taaza</p>
                    <p className="text-xs text-purple-900">
                      <span className="font-semibold">{item.packetAlt.name}:</span> {item.packetAlt.note}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function FruitsVeggies() {
  const [query, setQuery] = useState("");

  const items = query.trim().length >= 2
    ? DATA.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.nameHindi.toLowerCase().includes(query.toLowerCase()))
    : DATA;

  const grouped = CATEGORY_ORDER.reduce<Record<string, FruitVeggie[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Leaf className="text-primary" size={24} /> Sabzi Mandi</h1>
        <p className="text-muted-foreground text-sm">Fresh fruits & vegetables ka nutrition</p>
      </header>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input type="search" placeholder="Search fruits & veggies..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 h-11" />
      </div>
      <div className="flex-1 overflow-auto -mx-4 px-4 pb-4 space-y-4">
        {query.trim().length >= 2 ? (
          items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground"><p>Koi item nahi mila "{query}" ke liye</p></div>
          ) : (
            <div className="space-y-2">{items.map((item) => <FruitVeggieCard key={item.id} item={item} />)}</div>
          )
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{CATEGORY_LABELS[cat]}</h2>
              <div className="space-y-2">{catItems.map((item) => <FruitVeggieCard key={item.id} item={item} />)}</div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
