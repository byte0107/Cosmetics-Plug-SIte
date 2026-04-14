export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  benefits?: string[];
  ingredients?: string[];
  isNew?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isRecommended?: boolean;
}

export const products: Product[] = [
  { 
    id: '1', name: 'Ultra Braid - Expression', category: 'Haircare', price: 45, image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600',
    description: 'Premium synthetic braiding hair, perfect for long-lasting protective styles. Tangle-free and easy to hot water set.',
    benefits: ['Lightweight', 'Tangle-free', 'Hot water friendly'],
    ingredients: ['100% Kanekalon Synthetic Fiber'],
    isActive: true, isFeatured: true
  },
  { 
    id: '2', name: 'One Million Hairpiece', category: 'Haircare', price: 55, image: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?auto=format&fit=crop&q=80&w=600',
    description: 'High-quality hairpiece for voluminous and natural-looking styles. Soft texture that mimics natural African hair.',
    benefits: ['Natural look', 'Voluminous', 'Easy to style'],
    ingredients: ['Premium Synthetic Fiber'],
    isActive: true, isNew: true
  },
  { 
    id: '16', name: 'Eco Styler Olive Oil Gel', category: 'Haircare', price: 95, image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=600',
    description: 'Maximum hold styling gel made with 100% pure olive oil. Helps your scalp regulate its natural moisture system.',
    benefits: ['Max hold 10/10', 'No flaking', 'Moisturizing'],
    ingredients: ['Water', 'Olive Oil', 'Glycerin', 'Carbomer'],
    isActive: true, isRecommended: true
  },
  { 
    id: '4', name: 'Cerave Foaming Face Wash', category: 'Skincare', price: 320, image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=600',
    description: 'Developed with dermatologists, this foaming gel cleanser deeply cleanses, removes excess oil, and refreshes the skin without disrupting the skin barrier.',
    benefits: ['Removes excess oil', 'Protects skin barrier', 'Non-comedogenic'],
    ingredients: ['Ceramides 1, 3, 6-II', 'Hyaluronic Acid', 'Niacinamide'],
    isActive: true, isFeatured: true, isRecommended: true
  },
  { 
    id: '17', name: "Pond's Perfect Colour Complex", category: 'Skincare', price: 65, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
    description: 'Beauty cream formulated to fade dark marks and blemishes, giving you an even-toned, radiant complexion.',
    benefits: ['Fades dark marks', 'Even skin tone', 'Matte finish'],
    ingredients: ['Vitamin B3', 'Glycerin', 'Stearic Acid'],
    isActive: true, isOnSale: true
  },
  { 
    id: '18', name: 'Nivea Perfect & Radiant', category: 'Skincare', price: 85, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600',
    description: 'Even tone day cream enriched with Eventone Pure Active and Vitamin E to gradually enhance skin complexion.',
    benefits: ['SPF 15 protection', 'Restores even tone', 'Deeply moisturizes'],
    ingredients: ['Vitamin E', 'Eventone Pure Active', 'SPF 15'],
    isActive: true, isRecommended: true
  },
  { 
    id: '8', name: '3D Mink Lashes - NUL Glow', category: 'Makeup', price: 90, image: 'https://images.unsplash.com/photo-1512496015851-a1cbfc192ea5?auto=format&fit=crop&q=80&w=600',
    description: 'Luxurious, fluffy 3D mink lashes designed for the perfect dramatic yet elegant look. Reusable up to 20 times.',
    benefits: ['Lightweight band', 'Reusable 20x', 'Cruelty-free'],
    ingredients: ['Faux Mink Fibers', 'Cotton Band'],
    isActive: true, isNew: true, isFeatured: true
  },
  { 
    id: '12', name: 'Ruby Rose Matte Foundation', category: 'Makeup', price: 110, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=600',
    description: 'High coverage matte foundation that controls oil and lasts all day. Perfect for the Roma climate.',
    benefits: ['Full coverage', 'Matte finish', 'Oil control'],
    ingredients: ['Aqua', 'Cyclopentasiloxane', 'Titanium Dioxide'],
    isActive: true, isRecommended: true
  },
  { 
    id: '6', name: 'Organic African Black Soap', category: 'Body', price: 45, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=600',
    description: '100% natural and organic soap sourced from West Africa. Excellent for clearing acne, eczema, and blemishes.',
    benefits: ['Clears blemishes', 'Soothes eczema', '100% Natural'],
    ingredients: ['Plantain Skin Ash', 'Cocoa Pod Ash', 'Palm Oil', 'Shea Butter'],
    isActive: true, isOnSale: true
  },
  { 
    id: '19', name: 'Vaseline Cocoa Radiant', category: 'Body', price: 75, image: 'https://images.unsplash.com/photo-1556228720-1c2a4624dcfa?auto=format&fit=crop&q=80&w=600',
    description: 'Made with pure cocoa butter, this rich lotion heals dry skin for a natural, radiant glow.',
    benefits: ['Heals dry skin', 'Non-greasy', 'Rich cocoa scent'],
    ingredients: ['Pure Cocoa Butter', 'Micro-droplets of Vaseline Jelly'],
    isActive: true, isFeatured: true
  },
  { 
    id: '20', name: 'Seduction Body Spray', category: 'Body', price: 35, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    description: 'A long-lasting, captivating fragrance that keeps you feeling fresh and confident all day.',
    benefits: ['Long-lasting scent', 'Refreshing', 'Travel-friendly'],
    ingredients: ['Alcohol Denat', 'Parfum', 'Aqua'],
    isActive: true, isNew: true, isOnSale: true
  },
];
