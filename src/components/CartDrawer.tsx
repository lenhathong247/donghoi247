import React, { useState } from 'react';
import { CartItem, DongHoiWard, Order } from '../types/food';
import {
  formatVND,
  calculateSubtotal,
  calculateDeliveryFee,
  calculateDiscount,
  calculateOrderTotal,
  validateCustomerInfo,
  DONG_HOI_WARDS,
  AVAILABLE_VOUCHERS,
} from '../utils/orderCalculator';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CreditCard,
  Banknote,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  selectedWardId: string;
  onSelectWard: (wardId: string) => void;
  onPlaceOrder: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  selectedWardId,
  onSelectWard,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Trần Văn Bình');
  const [customerPhone, setCustomerPhone] = useState('0912345678');
  const [address, setAddress] = useState('Số 45 Đường Quách Xuân Kỳ');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('cod');
  const [voucherCodeInput, setVoucherCodeInput] = useState('DONGHOI2026');
  const [appliedVoucher, setAppliedVoucher] = useState<string>('DONGHOI2026');
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(selectedWardId, subtotal);
  const discountResult = calculateDiscount(appliedVoucher, subtotal, deliveryFee);
  const discount = discountResult.isValid ? discountResult.discountAmount : 0;
  const total = calculateOrderTotal(subtotal, deliveryFee, discount);

  const currentWard = DONG_HOI_WARDS.find((w) => w.id === selectedWardId) || DONG_HOI_WARDS[0];

  const handleApplyVoucher = (code: string) => {
    setVoucherCodeInput(code);
    setAppliedVoucher(code);
    setFormError(null);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const validation = validateCustomerInfo(customerName, customerPhone, address);
    if (!validation.isValid) {
      setFormError(validation.error || 'Vui lòng kiểm tra lại thông tin giao hàng.');
      return;
    }

    const newOrder: Order = {
      id: `DH-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      subtotal,
      deliveryFee,
      discount,
      total,
      customerName,
      customerPhone,
      ward: currentWard.name,
      address,
      paymentMethod,
      voucherCode: appliedVoucher || undefined,
      status: 'cooking',
      driverName: 'Nguyễn Văn Hùng',
      driverPhone: '0912.839.247',
      driverPlate: '73B1-889.26 (Đồng Hới)',
      estimatedDeliveryTime: `${currentWard.estMinutes} phút`,
    };

    onPlaceOrder(newOrder);
  };

  // Free shipping progress calculation (threshold: 250k)
  const freeShipThreshold = 250000;
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShipThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md sm:max-w-lg bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between shrink-0 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-800" />
            <h2 id="cart-title" className="text-base sm:text-lg font-bold text-stone-900">
              Giỏ hàng của bạn ({items.length} món)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Ship Banner Indicator */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/60 shrink-0 text-xs">
          <div className="flex items-center justify-between text-amber-900 font-semibold mb-1">
            <span>
              {remainingForFreeShip > 0
                ? `Thêm ${formatVND(remainingForFreeShip)} để Freeship nội thành!`
                : ' Bạn đã được Miễn phí giao hàng tại Đồng Hới!'}
            </span>
            <span className="tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-700 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 text-stone-300 stroke-[1.5]" />
              <p className="text-base font-semibold text-stone-700 mb-1">Giỏ hàng đang trống</p>
              <p className="text-xs text-stone-500 mb-6">
                Hãy chọn món bánh lọc mệ Xuân, cháo canh cá lóc nóng hổi nhé!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-amber-800 text-white text-xs font-semibold rounded-xl hover:bg-amber-900 transition-colors"
              >
                Xem thực đơn ngay
              </button>
            </div>
          ) : (
            <>
              {/* Item list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Món đã chọn
                </h3>
                {items.map((cartItem) => {
                  const itemUnitPrice =
                    cartItem.foodItem.price +
                    (cartItem.selectedOptions || []).reduce((s, o) => s + o.price, 0);

                  return (
                    <div
                      key={cartItem.cartItemId}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex gap-3 text-stone-900"
                    >
                      <img
                        src={cartItem.foodItem.image}
                        alt={cartItem.foodItem.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {cartItem.foodItem.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(cartItem.cartItemId)}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                            aria-label={`Xóa món ${cartItem.foodItem.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Options / Spicy badge */}
                        <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                          {cartItem.spicyLevel && <div>· {cartItem.spicyLevel}</div>}
                          {cartItem.selectedOptions && cartItem.selectedOptions.map((opt) => (
                            <div key={opt.id}>+ {opt.name} ({formatVND(opt.price)})</div>
                          ))}
                          {cartItem.specialInstructions && (
                            <div className="italic text-stone-400">Ghi chú: {cartItem.specialInstructions}</div>
                          )}
                        </div>

                        {/* Quantity and Price row */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-200/60">
                          <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                              aria-label="Giảm 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                              aria-label="Tăng 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-amber-900 tabular-nums">
                            {formatVND(itemUnitPrice * cartItem.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Information Form */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Địa chỉ giao tại Đồng Hới
                </h3>

                <div className="space-y-2.5">
                  {/* Ward selection */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      Phường / Xã tại Đồng Hới
                    </label>
                    <select
                      value={selectedWardId}
                      onChange={(e) => onSelectWard(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                    >
                      {DONG_HOI_WARDS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} — Phí ship: {formatVND(w.deliveryFee)} (Dự kiến {w.estMinutes}p)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street address */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Số nhà & Tên đường
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="VD: 15 Lê Thành Đồng / 88 Lý Thường Kiệt"
                      className="w-full p-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  {/* Recipient info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-stone-400" />
                        Tên người nhận
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Vouchers */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Mã ưu đãi
                </h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá..."
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm uppercase tracking-wider bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800 font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher(voucherCodeInput)}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Quick Voucher Suggestions */}
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {Object.keys(AVAILABLE_VOUCHERS).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyVoucher(code)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        appliedVoucher === code
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>

                {discountResult.message && (
                  <p className="text-xs text-amber-700 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {discountResult.message}
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Phương thức thanh toán
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-50 border-amber-800 text-amber-900'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Tiền mặt (COD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'vietqr'
                        ? 'bg-amber-50 border-amber-800 text-amber-900'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Chuyển khoản VietQR</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Price breakdown & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            {formError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} phần):</span>
                <span className="font-semibold text-stone-900 tabular-nums">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng ({currentWard.name}):</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">Miễn phí</strong> : formatVND(deliveryFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Ưu đãi voucher ({appliedVoucher}):</span>
                  <span className="tabular-nums font-bold">-{formatVND(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-bold text-stone-900">
                <span>Tổng thanh toán:</span>
                <span className="text-amber-900 text-lg tabular-nums">{formatVND(total)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              className="w-full py-3.5 px-4 bg-amber-800 hover:bg-amber-900 active:scale-98 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-between cursor-pointer"
            >
              <span>Đặt đơn giao ngay</span>
              <span className="tabular-nums">{formatVND(total)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
