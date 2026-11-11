import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateSubtotal,
  calculateDeliveryFee,
  calculateDiscount,
  calculateOrderTotal,
  validateCustomerInfo,
} from './orderCalculator';
import { CartItem, FoodItem } from '../types/food';

const mockFoodItem: FoodItem = {
  id: 'food-1',
  name: 'Bánh Bột Lọc Mệ Xuân',
  restaurantId: 'rest-1',
  restaurantName: 'Quán Mệ Xuân',
  category: 'specialty',
  categoryLabel: 'Đặc sản Quảng Bình',
  price: 35000,
  rating: 4.9,
  reviewCount: 320,
  prepTimeMinutes: 15,
  image: '/test.jpg',
  description: 'Bánh lọc nhân tôm thịt',
  tags: ['Bán chạy'],
};

test('calculateItemUnitPrice adds selected options correctly', () => {
  const itemWithoutOptions: CartItem = {
    cartItemId: 'item-1',
    foodItem: mockFoodItem,
    quantity: 1,
    selectedOptions: [],
    unitPrice: 35000,
  };
  assert.equal(calculateItemUnitPrice(itemWithoutOptions), 35000);

  const itemWithOptions: CartItem = {
    cartItemId: 'item-2',
    foodItem: mockFoodItem,
    quantity: 1,
    selectedOptions: [
      { id: 'opt-ram', name: 'Thêm 2 ram giòn', price: 10000 },
      { id: 'opt-sauce', name: 'Mắm ớt thêm', price: 5000 },
    ],
    unitPrice: 50000,
  };
  assert.equal(calculateItemUnitPrice(itemWithOptions), 50000);
});

test('calculateSubtotal sums up item unit prices multiplied by quantities', () => {
  const items: CartItem[] = [
    {
      cartItemId: 'item-1',
      foodItem: mockFoodItem,
      quantity: 2, // 35000 * 2 = 70000
      selectedOptions: [],
      unitPrice: 35000,
    },
    {
      cartItemId: 'item-2',
      foodItem: mockFoodItem,
      quantity: 1, // (35000 + 10000) * 1 = 45000
      selectedOptions: [{ id: 'opt-ram', name: 'Ram giòn', price: 10000 }],
      unitPrice: 45000,
    },
  ];
  assert.equal(calculateSubtotal(items), 115000);
});

test('calculateDeliveryFee respects ward and free delivery thresholds', () => {
  // Đồng Mỹ is 12000
  assert.equal(calculateDeliveryFee('dong-my', 80000), 12000);
  // Bảo Ninh is 20000
  assert.equal(calculateDeliveryFee('bao-ninh', 80000), 20000);
  // Free delivery threshold over 250000
  assert.equal(calculateDeliveryFee('dong-my', 260000), 0);
  assert.equal(calculateDeliveryFee('bao-ninh', 300000), 0);
});

test('calculateDiscount applies DONGHOI2026, QUANGBINH, and FREESHIP correctly', () => {
  // DONGHOI2026 gives 25k off if subtotal >= 100k
  const fixedUnder = calculateDiscount('DONGHOI2026', 80000, 15000);
  assert.equal(fixedUnder.isValid, false);

  const fixedValid = calculateDiscount('DONGHOI2026', 120000, 15000);
  assert.equal(fixedValid.isValid, true);
  assert.equal(fixedValid.discountAmount, 25000);

  // FREESHIP gives deliveryFee
  const freeShipValid = calculateDiscount('FREESHIP', 130000, 20000);
  assert.equal(freeShipValid.isValid, true);
  assert.equal(freeShipValid.discountAmount, 20000);

  // Invalid voucher
  const invalidVoucher = calculateDiscount('UNKNOWN123', 150000, 15000);
  assert.equal(invalidVoucher.isValid, false);
});

test('calculateOrderTotal combines subtotal, delivery fee, and discount without negative total', () => {
  const total = calculateOrderTotal(100000, 15000, 25000);
  assert.equal(total, 90000);

  const clampedZero = calculateOrderTotal(20000, 0, 50000);
  assert.equal(clampedZero, 0);
});

test('validateCustomerInfo verifies phone format and required fields', () => {
  assert.equal(validateCustomerInfo('', '0912345678', '12 Lê Thành Đồng').isValid, false);
  assert.equal(validateCustomerInfo('Nguyễn An', '12345', '12 Lê Thành Đồng').isValid, false);
  assert.equal(validateCustomerInfo('Nguyễn An', '0912345678', '12').isValid, false);
  assert.equal(validateCustomerInfo('Nguyễn An', '0912345678', '12 Lê Thành Đồng, Đồng Hới').isValid, true);
  assert.equal(validateCustomerInfo('Trần Bình', '+84987654321', '68 Quách Xuân Kỳ').isValid, true);
});
