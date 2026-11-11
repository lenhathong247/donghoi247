export interface FoodOption {
  id: string;
  name: string;
  price: number;
}

export interface FoodOptionGroup {
  id: string;
  title: string;
  required?: boolean;
  options: FoodOption[];
}

export interface FoodItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  category: 'specialty' | 'noodle' | 'seafood' | 'streetfood' | 'drink' | 'rice';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  image: string;
  description: string;
  spicyLevels?: string[];
  optionGroups?: FoodOptionGroup[];
  isPopular?: boolean;
  isSignature?: boolean;
  tags: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  ward: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  openingHours: string;
  deliveryTime: string;
  landmark: string;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  spicyLevel?: string;
  selectedOptions: FoodOption[];
  specialInstructions?: string;
  unitPrice: number;
}

export interface Voucher {
  code: string;
  description: string;
  discountType: 'fixed' | 'percent' | 'freeship';
  discountValue: number;
  minOrderValue: number;
}

export interface DongHoiWard {
  id: string;
  name: string;
  deliveryFee: number;
  estMinutes: string;
  description: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customerName: string;
  customerPhone: string;
  ward: string;
  address: string;
  paymentMethod: 'cod' | 'vietqr' | 'momo';
  voucherCode?: string;
  status: 'confirmed' | 'cooking' | 'delivering' | 'completed';
  driverName?: string;
  driverPhone?: string;
  driverPlate?: string;
  estimatedDeliveryTime: string;
}
