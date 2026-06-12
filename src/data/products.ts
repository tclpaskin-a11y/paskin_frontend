import type { Product } from "@/components/site/ProductCard";
import capsulesImg from "@/assets/sea-buckthorn-capsules.png";
import pulpImg from "@/assets/sea-buckthorn-pulp.png";
import pAntibiotic from "@/assets/prod-antibiotic.png";
import pDerma from "@/assets/prod-derma.png";
import pDental from "@/assets/prod-dental.png";
import pVitamin from "@/assets/prod-vitamin.png";

export interface DetailedProduct extends Product {
  description: string;
  benefits: string[];
  usage: string;
  ingredients: string;
}

export const products: DetailedProduct[] = [
  // Herbal Products
  {
    id: "sea-buckthorn-capsules",
    name: "Sea Buckthorn Capsules",
    category: "Herbal Wellness",
    price: 32,
    rating: 4.9,
    reviews: 1240,
    image: capsulesImg,
    badge: "Organic",
    description:
      "Our Sea Buckthorn Capsules are a powerhouse of nutrients, containing over 190 bioactive compounds including rare Omega-7. Hand-picked from high-altitude regions, these capsules are designed to boost your vitality from within.",
    benefits: [
      "Boosts Immune System",
      "Promotes Skin Elasticity",
      "Supports Heart Health",
      "Rich in Omega 3, 6, 7 & 9",
    ],
    usage: "Take 1-2 capsules daily with a meal or as directed by your healthcare professional.",
    ingredients: "Pure Sea Buckthorn Oil Extract, Vegan Capsule Shell.",
  },
  {
    id: "sea-buckthorn-pulp",
    name: "Sea Buckthorn Pulp",
    category: "Herbal Wellness",
    price: 28,
    rating: 4.8,
    reviews: 960,
    image: pulpImg,
    badge: "100% Pure",
    description:
      "Experience the raw energy of high-altitude sea buckthorn berries. Our pulp is cold-pressed to retain its natural enzymes and vitamins, providing a potent dose of antioxidants for your daily wellness routine.",
    benefits: [
      "Natural Energy Booster",
      "Rich in Vitamin C & E",
      "Supports Digestive Health",
      "Anti-inflammatory Properties",
    ],
    usage: "Mix 1-2 tablespoons with water, juice, or smoothies daily in the morning.",
    ingredients: "100% Pure Sea Buckthorn Berry Pulp.",
  },

  // Antibiotics
  {
    id: "amoxicillin-500",
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    price: 15,
    rating: 5,
    reviews: 1420,
    image: pAntibiotic,
    badge: "Essential",
    description:
      "A high-potency antibiotic used to treat various bacterial infections. Manufactured under strict GMP guidelines to ensure maximum purity and effectiveness.",
    benefits: [
      "Treats Respiratory Infections",
      "Effective against Skin Infections",
      "Broad-spectrum Action",
    ],
    usage: "Take one capsule every 8 hours as prescribed by your doctor.",
    ingredients: "Amoxicillin Trihydrate 500mg.",
  },
  {
    id: "azithromycin-250",
    name: "Azithromycin 250mg",
    category: "Antibiotics",
    price: 18,
    rating: 4.8,
    reviews: 980,
    image: pAntibiotic,
    description:
      "A macrolide antibiotic used for a wide variety of bacterial infections. Known for its convenient dosage schedule and effectiveness.",
    benefits: ["Treats Sinusitis", "Effective for Bronchitis", "Once-daily Dosing"],
    usage: "As directed by physician. Usually once daily for 3 to 5 days.",
    ingredients: "Azithromycin 250mg.",
  },

  // Derma
  {
    id: "retinol-night-cream",
    name: "Retinol Night Cream",
    category: "Derma",
    price: 45,
    oldPrice: 60,
    rating: 4.9,
    reviews: 2110,
    image: pDerma,
    badge: "Best Seller",
    description:
      "A dermatologically tested night cream that targets fine lines and uneven skin tone. Infused with pure retinol and soothing herbal extracts.",
    benefits: ["Reduces Fine Lines", "Improves Skin Texture", "Deep Hydration"],
    usage: "Apply to clean, dry skin in the evening.",
    ingredients: "Pure Retinol, Hyaluronic Acid, Vitamin E.",
  },
  {
    id: "hydrocortisone-1",
    name: "Hydrocortisone 1% Cream",
    category: "Derma",
    price: 12,
    rating: 4.7,
    reviews: 760,
    image: pDerma,
    description:
      "Fast-acting relief for skin irritation, itching, and rashes. A staple for any first-aid kit, providing soothing comfort for minor skin issues.",
    benefits: ["Relieves Itching", "Reduces Redness", "Soothes Inflammation"],
    usage: "Apply a thin layer to the affected area 2 to 3 times daily.",
    ingredients: "Hydrocortisone 10mg/g.",
  },

  // Dental
  {
    id: "advanced-cavity-protection",
    name: "Advanced Cavity Protection",
    category: "Dental",
    price: 8,
    rating: 4.9,
    reviews: 1840,
    image: pDental,
    badge: "New",
    description:
      "A clinically proven formula that strengthens enamel and prevents tooth decay. Fresh mint flavor for long-lasting breath confidence.",
    benefits: ["Strengthens Enamel", "Prevents Plaque Buildup", "Fresh Breath"],
    usage: "Brush thoroughly twice a day.",
    ingredients: "Sodium Fluoride, Hydrated Silica.",
  },
  {
    id: "sensitivity-relief-paste",
    name: "Sensitivity Relief Paste",
    category: "Dental",
    price: 10,
    rating: 4.6,
    reviews: 1320,
    image: pDental,
    description:
      "Specially formulated for sensitive teeth. Builds a protective layer over exposed dentin to block pain and sensitivity at the source.",
    benefits: ["Blocks Sensitivity Pain", "Gently Whitens", "Protects Gums"],
    usage: "Use daily as your regular toothpaste.",
    ingredients: "Potassium Nitrate, Fluoride.",
  },

  // Vitamins
  {
    id: "multivitamin-complex",
    name: "Multivitamin Complex",
    category: "Vitamins & Supplements",
    price: 24,
    oldPrice: 30,
    rating: 4.8,
    reviews: 1670,
    image: pVitamin,
    badge: "Best Seller",
    description:
      "A comprehensive blend of 24 essential vitamins and minerals designed to fill nutritional gaps and support overall health.",
    benefits: ["Supports Energy Levels", "Maintains Bone Health", "Improves Focus"],
    usage: "Take one tablet daily with water.",
    ingredients: "Vitamins A, C, D, E, B-Complex, Zinc.",
  },
  {
    id: "vitamin-c-1000",
    name: "Vitamin C 1000mg",
    category: "Vitamins & Supplements",
    price: 15,
    rating: 4.7,
    reviews: 890,
    image: pVitamin,
    description:
      "High-dose Vitamin C for powerful immune support and antioxidant protection. Essential for collagen production and overall wellness.",
    benefits: ["Immune Support", "Antioxidant Protection", "Collagen Production"],
    usage: "Take one tablet daily.",
    ingredients: "Ascorbic Acid 1000mg.",
  },
];
