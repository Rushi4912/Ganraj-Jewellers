import { Product, Category, DiscountCode } from '../types/product';

export const products: Product[] = [
  {
    id: 1,
    name: "Sparkle Gemstone Earrings",
    category: "earrings",
    price: 34.21,
    originalPrice: 45.00,
    rating: 4.5,
    reviews: 124,
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: "SALE",
    description: "Stunning gemstone earrings that sparkle with every movement. Perfect for special occasions.",
    inStock: true,
    userReviews: [
      { name: "Sarah M.", rating: 5, comment: "Absolutely beautiful! Worth every penny.", date: "2 days ago" },
      { name: "Emily R.", rating: 4, comment: "Lovely earrings, slight color variation from photo.", date: "1 week ago" }
    ],
    variants: [
      {
        type: 'material',
        label: 'Material',
        required: true,
        options: [
          { id: 'gold', name: 'Gold', value: '18K Gold', inStock: true, priceModifier: 0 },
          { id: 'silver', name: 'Silver', value: 'Sterling Silver', inStock: true, priceModifier: -10 },
          { id: 'rose-gold', name: 'Rose Gold', value: '18K Rose Gold', inStock: true, priceModifier: 5 },
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Daisy Silver Pendant Necklace",
    category: "necklaces",
    price: 123.00,
    rating: 5,
    reviews: 89,
    image: "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: null,
    description: "Elegant silver pendant featuring a delicate daisy design. Handcrafted with attention to detail.",
    inStock: true,
    userReviews: [
      { name: "Jessica L.", rating: 5, comment: "Perfect gift! She loved it.", date: "3 days ago" }
    ],
    variants: [
      {
        type: 'length',
        label: 'Chain Length',
        required: true,
        options: [
          { id: '16', name: '16\"', value: '16 inches', inStock: true, priceModifier: 0 },
          { id: '18', name: '18\"', value: '18 inches', inStock: true, priceModifier: 5 },
          { id: '20', name: '20\"', value: '20 inches', inStock: true, priceModifier: 10 },
          { id: '22', name: '22\"', value: '22 inches', inStock: false, priceModifier: 15 },
        ]
      },
      {
        type: 'material',
        label: 'Material',
        required: true,
        options: [
          { id: 'silver', name: 'Silver', value: 'Sterling Silver', inStock: true, priceModifier: 0 },
          { id: 'gold', name: 'Gold', value: '18K Gold', inStock: true, priceModifier: 50 },
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Classic Solitaire Ring",
    category: "rings",
    price: 87.00,
    rating: 4.8,
    reviews: 156,
    image: "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: "NEW",
    description: "Timeless solitaire ring with brilliant cut stone. A symbol of eternal love.",
    inStock: true,
    userReviews: [],
    variants: [
      {
        type: 'size',
        label: 'Ring Size',
        required: true,
        options: [
          { id: '5', name: '5', value: 'Size 5', inStock: true, priceModifier: 0 },
          { id: '6', name: '6', value: 'Size 6', inStock: true, priceModifier: 0 },
          { id: '7', name: '7', value: 'Size 7', inStock: true, priceModifier: 0 },
          { id: '8', name: '8', value: 'Size 8', inStock: true, priceModifier: 0 },
          { id: '9', name: '9', value: 'Size 9', inStock: false, priceModifier: 0 },
          { id: '10', name: '10', value: 'Size 10', inStock: true, priceModifier: 0 },
        ]
      },
      {
        type: 'material',
        label: 'Material',
        required: true,
        options: [
          { id: 'white-gold', name: 'White Gold', value: '18K White Gold', inStock: true, priceModifier: 0 },
          { id: 'yellow-gold', name: 'Yellow Gold', value: '18K Yellow Gold', inStock: true, priceModifier: 10 },
          { id: 'platinum', name: 'Platinum', value: 'Platinum', inStock: true, priceModifier: 50 },
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Rose Gold Circle Pendant",
    category: "necklaces",
    price: 65.21,
    rating: 4.3,
    reviews: 78,
    image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: null,
    description: "Modern rose gold circle pendant symbolizing infinity and endless possibilities.",
    inStock: true,
    userReviews: []
  },
  {
    id: 5,
    name: "Blue Sapphire Earrings",
    category: "earrings",
    price: 203.55,
    rating: 4.9,
    reviews: 92,
    image: "https://images.pexels.com/photos/1456221/pexels-photo-1456221.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/1456221/pexels-photo-1456221.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: null,
    description: "Exquisite blue sapphire earrings set in white gold. Royal elegance at its finest.",
    inStock: true,
    userReviews: []
  },
  {
    id: 6,
    name: "Elegant Pearl Ring",
    category: "rings",
    price: 67.00,
    originalPrice: 89.00,
    rating: 4.6,
    reviews: 203,
    image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: "SALE",
    description: "Graceful pearl ring combining classic beauty with contemporary design.",
    inStock: true,
    userReviews: [],
    variants: [
      {
        type: 'size',
        label: 'Ring Size',
        required: true,
        options: [
          { id: '5', name: '5', value: 'Size 5', inStock: true, priceModifier: 0 },
          { id: '6', name: '6', value: 'Size 6', inStock: true, priceModifier: 0 },
          { id: '7', name: '7', value: 'Size 7', inStock: true, priceModifier: 0 },
          { id: '8', name: '8', value: 'Size 8', inStock: true, priceModifier: 0 },
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Ruby Heart Bracelet",
    category: "bracelets",
    price: 77.00,
    originalPrice: 95.00,
    rating: 4.8,
    reviews: 167,
    image: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=400",
    images: [
      "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    badge: "SALE",
    description: "Romantic ruby heart bracelet expressing love and passion. Perfect for gifting.",
    inStock: true,
    userReviews: [],
    variants: [
      {
        type: 'length',
        label: 'Bracelet Length',
        required: true,
        options: [
          { id: '6.5', name: '6.5\"', value: '6.5 inches', inStock: true, priceModifier: 0 },
          { id: '7', name: '7\"', value: '7 inches', inStock: true, priceModifier: 0 },
          { id: '7.5', name: '7.5\"', value: '7.5 inches', inStock: true, priceModifier: 5 },
          { id: '8', name: '8\"', value: '8 inches', inStock: true, priceModifier: 5 },
        ]
      }
    ]
  },
  {
    id: 11,
    name: "Emerald Statement Ring",
    category: "rings",
    price: 189.00,
    rating: 4.9,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
    ],
    badge: "NEW",
    description: "Bold emerald statement ring that commands attention. For the confident woman.",
    inStock: true,
    userReviews: [],
    variants: [
      {
        type: 'size',
        label: 'Ring Size',
        required: true,
        options: [
          { id: '6', name: '6', value: 'Size 6', inStock: true, priceModifier: 0 },
          { id: '7', name: '7', value: 'Size 7', inStock: true, priceModifier: 0 },
          { id: '8', name: '8', value: 'Size 8', inStock: true, priceModifier: 0 },
        ]
      }
    ]
  }
];

export const categories: Category[] = [
  { id: 'all', name: 'All Jewellery' },
  { id: 'rings', name: 'Rings' },
  { id: 'necklaces', name: 'Necklaces' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'bracelets', name: 'Bracelets' }
];

export const discountCodes: Record<string, DiscountCode> = {
  'WELCOME10': { discount: 0.10, description: '10% off your order' },
  'SAVE20': { discount: 0.20, description: '20% off your order' },
  'LUXURY30': { discount: 0.30, description: '30% off luxury items' }
};
