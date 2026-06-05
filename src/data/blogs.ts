export interface Blog {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  tag?: string;
}

export const fallbackBlogs: Blog[] = [
  {
    _id: "6a227afceb0607fc889f622c",
    title: "Complete Guide to Thornova Sea Buckthorn Capsules – Benefits, Nutrition, and Daily Wellness",
    description: "Introduction\r\n\r\nHealth-conscious individuals are increasingly turning to natural supplements to support their wellness goals. Among the many options available today, Sea Buckthorn has earned a reputation as one of the most nutrient-rich botanical ingredients.\r\n\r\nThornova Sea Buckthorn Capsules provide a practical way to enjoy the nutritional benefits of Sea Buckthorn while supporting a healthy and active lifestyle.\r\n\r\nUnderstanding the Nutritional Power of Sea Buckthorn\r\n\r\nSea Buckthorn contains a wide range of beneficial nutrients including:\r\n\r\nOmega-3 fatty acids\r\nOmega-6 fatty acids\r\nOmega-7 fatty acids\r\nOmega-9 fatty acids\r\nVitamin C\r\nVitamin E\r\nCarotenoids\r\nPolyphenols\r\n\r\nThis combination makes Sea Buckthorn unique among plant-based ingredients.\r\n\r\nSkin Wellness Benefits\r\nHydration Support\r\n\r\nHealthy skin begins with proper hydration. Sea Buckthorn's fatty acids help support moisture balance and skin comfort.\r\n\r\nElasticity Support\r\n\r\nNutrients found in Sea Buckthorn contribute to maintaining healthy-looking skin and overall skin resilience.\r\n\r\nAntioxidant Defense\r\n\r\nEnvironmental pollutants and daily stress can affect skin appearance. Antioxidants help support healthy skin by protecting cells from oxidative stress.\r\n\r\nHair and Scalp Support\r\n\r\nHealthy hair starts with a healthy scalp. Sea Buckthorn provides nutritional support that may contribute to:\r\n\r\nHair vitality\r\nNatural shine\r\nScalp nourishment\r\nStronger-looking strands\r\nImmune Wellness\r\n\r\nThe vitamins and antioxidants present in Sea Buckthorn support the body's natural defense mechanisms and contribute to overall health.\r\n\r\nHealthy Aging Support\r\n\r\nHealthy aging is influenced by nutrition, lifestyle, and cellular health. The antioxidant compounds found in Sea Buckthorn help support healthy aging and long-term wellness.\r\n\r\nDaily Wellness Tips\r\n\r\nTo maximize the benefits of Thornova Sea Buckthorn Capsules:\r\n\r\nTake them consistently.\r\nMaintain a balanced diet.\r\nDrink sufficient water daily.\r\nExercise regularly.\r\nGet adequate sleep.\r\nFrequently Asked Questions\r\nWhat is Sea Buckthorn?\r\n\r\nSea Buckthorn is a nutrient-rich berry known for containing essential fatty acids, vitamins, antioxidants, and plant compounds.\r\n\r\nCan Sea Buckthorn be taken daily?\r\n\r\nMany people include Sea Buckthorn supplements as part of their regular wellness routine. Always follow the product label instructions.\r\n\r\nWhy is Omega-7 important?\r\n\r\nOmega-7 is a relatively rare fatty acid that has gained attention for its role in supporting skin hydration and overall wellness.\r\n\r\nFinal Thoughts\r\n\r\nThornova Sea Buckthorn Capsules combine convenience, nutrition, and wellness support in one daily supplement. Whether your goal is healthier-looking skin, stronger hair, antioxidant support, or overall vitality, Sea Buckthorn offers a natural solution backed by an impressive nutritional profile.",
    images: [
      "https://paskin-media-storage.s3.ap-south-1.amazonaws.com/blog%2F1780644604366-img3.jpg"
    ],
    createdBy: {
      _id: "69fb2594d5c57e1cafca3c69",
      name: "Paskin",
      "email": "paskin.info@gmail.com",
      "role": "admin"
    },
    isPublished: true,
    createdAt: "2026-06-05T07:30:04.427Z",
    updatedAt: "2026-06-05T07:30:04.427Z",
    __v: 0,
    tag: "Wellness"
  }
];
