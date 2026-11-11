import { CartItem, DongHoiWard, Voucher } from '../types/food';

export const DONG_HOI_WARDS: DongHoiWard[] = [
  { id: 'dong-my', name: 'Phường Đồng Mỹ', deliveryFee: 12000, estMinutes: '15-20', description: 'Trung tâm thành phố, gần Quảng Bình Quan' },
  { id: 'hai-thanh', name: 'Phường Hải Thành', deliveryFee: 12000, estMinutes: '15-20', description: 'Bờ sông Nhật Lệ, Tượng đài Mẹ Suốt' },
  { id: 'dong-hai', name: 'Phường Đồng Hải', deliveryFee: 15000, estMinutes: '20-25', description: 'Khu thương mại chợ Đồng Hới' },
  { id: 'bac-ly', name: 'Phường Bắc Lý', deliveryFee: 18000, estMinutes: '25-30', description: 'Gần ga Đồng Hới, Đại học Quảng Bình' },
  { id: 'nam-ly', name: 'Phường Nam Lý', deliveryFee: 18000, estMinutes: '20-25', description: 'Khu dân cư ga tàu, Chợ Công Đoàn' },
  { id: 'bao-ninh', name: 'Xã Bảo Ninh', deliveryFee: 20000, estMinutes: '25-35', description: 'Bên kia Cầu Nhật Lệ, bãi tắm Bảo Ninh' },
  { id: 'quang-phu', name: 'Xã Quang Phú', deliveryFee: 25000, estMinutes: '30-40', description: 'Gần sân bay Đồng Hới, bãi biển Quang Phú' },
];

export const AVAILABLE_VOUCHERS: Record<string, Voucher> = {
  'DONGHOI2026': {
    code: 'DONGHOI2026',
    description: 'Giảm 25.000đ cho đơn hàng từ 100.000đ tại Đồng Hới',
    discountType: 'fixed',
    discountValue: 25000,
    minOrderValue: 100000,
  },
  'QUANGBINH': {
    code: 'QUANGBINH',
    description: 'Giảm 15% tối đa 30.000đ cho đơn từ 80.000đ',
    discountType: 'percent',
    discountValue: 15,
    minOrderValue: 80000,
  },
  'FREESHIP': {
    code: 'FREESHIP',
    description: 'Miễn phí giao hàng toàn thành phố Đồng Hới đơn từ 120.000đ',
    discountType: 'freeship',
    discountValue: 0,
    minOrderValue: 120000,
  },
};

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateItemUnitPrice(cartItem: CartItem): number {
  const optionsTotal = (cartItem.selectedOptions || []).reduce((sum, opt) => sum + opt.price, 0);
  return cartItem.foodItem.price + optionsTotal;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const unitPrice = calculateItemUnitPrice(item);
    return sum + unitPrice * item.quantity;
  }, 0);
}

export function calculateDeliveryFee(wardId: string, subtotal: number): number {
  // Free delivery threshold: orders over 250k get automatic free shipping
  if (subtotal >= 250000) {
    return 0;
  }
  const ward = DONG_HOI_WARDS.find((w) => w.id === wardId);
  return ward ? ward.deliveryFee : 15000;
}

export function calculateDiscount(voucherCode: string | undefined, subtotal: number, deliveryFee: number): {
  discountAmount: number;
  isValid: boolean;
  message?: string;
} {
  if (!voucherCode || !voucherCode.trim()) {
    return { discountAmount: 0, isValid: true };
  }

  const cleanCode = voucherCode.trim().toUpperCase();
  const voucher = AVAILABLE_VOUCHERS[cleanCode];

  if (!voucher) {
    return { discountAmount: 0, isValid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
  }

  if (subtotal < voucher.minOrderValue) {
    return {
      discountAmount: 0,
      isValid: false,
      message: `Đơn tối thiểu ${formatVND(voucher.minOrderValue)} để áp dụng mã này.`,
    };
  }

  if (voucher.discountType === 'fixed') {
    return { discountAmount: Math.min(voucher.discountValue, subtotal), isValid: true };
  }

  if (voucher.discountType === 'percent') {
    const rawDiscount = Math.round((subtotal * voucher.discountValue) / 100);
    // Cap percentage discount at 30,000 VND
    return { discountAmount: Math.min(rawDiscount, 30000), isValid: true };
  }

  if (voucher.discountType === 'freeship') {
    return { discountAmount: deliveryFee, isValid: true };
  }

  return { discountAmount: 0, isValid: true };
}

export function calculateOrderTotal(subtotal: number, deliveryFee: number, discountAmount: number): number {
  return Math.max(0, subtotal + deliveryFee - discountAmount);
}

export function validateCustomerInfo(name: string, phone: string, address: string): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Vui lòng nhập tên người nhận.' };
  }
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
    return { isValid: false, error: 'Số điện thoại không hợp lệ (VD: 0912345678).' };
  }
  if (!address.trim() || address.trim().length < 5) {
    return { isValid: false, error: 'Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường).' };
  }
  return { isValid: true };
}
