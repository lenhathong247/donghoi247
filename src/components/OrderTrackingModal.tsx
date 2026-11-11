import React, { useState, useEffect } from 'react';
import { Order } from '../types/food';
import { formatVND } from '../utils/orderCalculator';
import {
  X,
  CheckCircle2,
  Clock,
  Phone,
  Bike,
  CookingPot,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Star,
  Sparkles,
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onAdvanceOrderStatus?: (orderId: string, nextStatus: Order['status']) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  order,
  onClose,
  onAdvanceOrderStatus,
}) => {
  if (!isOpen || !order) return null;

  const [currentStatus, setCurrentStatus] = useState<Order['status']>(order.status || 'cooking');
  const [ratingGiven, setRatingGiven] = useState<number>(0);
  const [feedbackDone, setFeedbackDone] = useState(false);

  // Sync internal status with prop
  useEffect(() => {
    if (order.status) {
      setCurrentStatus(order.status);
    }
  }, [order.status]);

  const steps: { key: Order['status']; label: string; sub: string; icon: any }[] = [
    {
      key: 'confirmed',
      label: 'Đã nhận đơn',
      sub: 'Nhà hàng đã xác nhận món',
      icon: CheckCircle2,
    },
    {
      key: 'cooking',
      label: 'Đang nấu bánh nóng',
      sub: 'Hấp bánh lọc, chiên ram giòn rụm',
      icon: CookingPot,
    },
    {
      key: 'delivering',
      label: 'Shipper đang giao',
      sub: 'Đang qua đường Nhật Lệ / Cầu Nhật Lệ',
      icon: Bike,
    },
    {
      key: 'completed',
      label: 'Đã giao thành công',
      sub: 'Chúc bạn ngon miệng!',
      icon: ShieldCheck,
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStatus);

  const handleNextStep = () => {
    const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1);
    const nextStatus = steps[nextIndex].key;
    setCurrentStatus(nextStatus);
    if (onAdvanceOrderStatus) {
      onAdvanceOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-0.5">
              <span>Mã đơn: #{order.id}</span>
              <span aria-hidden="true">·</span>
              <span>Đặt lúc {order.createdAt}</span>
            </div>
            <h2 id="tracking-title" className="text-base sm:text-lg font-bold">
              Theo dõi trực tiếp đơn hàng Đồng Hới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Đóng bảng theo dõi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Tracking Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Estimated time hero banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Thời gian giao dự kiến</p>
                <p className="text-lg font-bold text-stone-900">
                  {currentStatus === 'completed' ? 'Đã giao tới bạn' : `${order.estimatedDeliveryTime}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 font-bold">
                {currentStatus === 'completed'
                  ? 'Hoàn thành'
                  : currentStatus === 'delivering'
                  ? 'Đang trên đường'
                  : 'Đang nấu bánh'}
              </span>
            </div>
          </div>

          {/* Stepper timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Tiến độ giao hàng tại Đồng Hới
            </h3>
            <div className="space-y-4">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isFuture = idx > currentStepIndex;

                return (
                  <div key={st.key} className="flex items-start gap-3 relative">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                          idx < currentStepIndex ? 'bg-amber-800' : 'bg-stone-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${
                        isPassed
                          ? 'bg-amber-800 text-white'
                          : isCurrent
                          ? 'bg-amber-800 text-white ring-4 ring-amber-100'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-amber-900'
                              : isPassed
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {st.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[11px] font-semibold text-amber-800 animate-pulse">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipper Contact Card */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                NV
              </div>
              <div>
                <p className="text-xs text-stone-500">Tài xế giao hàng Đồng Hới</p>
                <p className="text-sm font-bold text-stone-900">{order.driverName}</p>
                <p className="text-[11px] text-stone-500">Biển số: {order.driverPlate}</p>
              </div>
            </div>
            <a
              href={`tel:${order.driverPhone}`}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gọi tài xế</span>
            </a>
          </div>

          {/* Delivery Route Landmark Visual */}
          <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Lộ trình giao hàng nội thành
              </span>
              <span className="text-stone-400 text-[11px]">{order.ward}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-800/80 text-[11px] leading-relaxed text-stone-300">
              Quán Mệ Xuân (Lê Thành Đồng) ➔ Cầu Nhật Lệ ➔ {order.address}, {order.ward}
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-stone-400">
              Chi tiết các món ({order.items.reduce((s, i) => s + i.quantity, 0)} phần)
            </h4>
            <div className="space-y-1.5">
              {order.items.map((it) => (
                <div key={it.cartItemId} className="flex justify-between text-stone-700">
                  <span>
                    {it.quantity}x {it.foodItem.name}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatVND(it.unitPrice * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
              <span>Tổng thanh toán ({order.paymentMethod === 'cod' ? 'COD' : 'VietQR'}):</span>
              <span className="text-amber-900 tabular-nums">{formatVND(order.total)}</span>
            </div>
          </div>

          {/* Rating prompt if completed */}
          {currentStatus === 'completed' && !feedbackDone && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-3">
              <p className="text-xs font-bold text-amber-900">
                Bạn thấy món ăn Đồng Hới hôm nay thế nào?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingGiven(star)}
                    className="p-1 cursor-pointer"
                    aria-label={`${star} sao`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        ratingGiven >= star
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {ratingGiven > 0 && (
                <button
                  type="button"
                  onClick={() => setFeedbackDone(true)}
                  className="px-4 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition-colors"
                >
                  Gửi đánh giá
                </button>
              )}
            </div>
          )}

          {feedbackDone && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold text-center">
              Cảm ơn bạn đã ủng hộ ẩm thực Đồng Hới! Quán sẽ ngày càng hoàn thiện hơn.
            </div>
          )}
        </div>

        {/* Modal Footer with Simulation Button */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {currentStatus !== 'completed' && (
            <button
              onClick={handleNextStep}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Mô phỏng bước kế tiếp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
