import React from 'react';
import { ShoppingBag, MapPin, Search } from 'lucide-react';
import { formatVND } from '../utils/orderCalculator';

interface HeaderProps {
  cartItemCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenMap: () => void;
  onOpenTracking: () => void;
  activeOrderCount: number;
  selectedWardName: string;
  onSelectWardModal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartSubtotal,
  onOpenCart,
  onOpenMap,
  onOpenTracking,
  activeOrderCount,
  selectedWardName,
  onSelectWardModal,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Về đầu trang Đồng Hới Food"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-900 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                Đồng Hới Food
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-stone-500 uppercase -mt-0.5">
                Ẩm Thực Quảng Bình
              </span>
            </button>

            {/* Quick Delivery Ward selector button */}
            <button
              onClick={onSelectWardModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 transition-colors border border-stone-200/60"
              title="Đổi khu vực giao hàng tại Đồng Hới"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="font-semibold text-stone-900 truncate max-w-[140px]">
                {selectedWardName}
              </span>
              <span className="text-stone-400">· Đổi</span>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => onScrollToSection('menu-section')}
              className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              Thực đơn đặc sản
            </button>
            <button
              onClick={() => onScrollToSection('restaurants-section')}
              className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              Quán nổi tiếng
            </button>
            <button
              onClick={onOpenMap}
              className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              Bản đồ quán
            </button>
            <button
              onClick={() => onScrollToSection('story-section')}
              className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              Hương vị Nhật Lệ
            </button>
            {activeOrderCount > 0 && (
              <button
                onClick={onOpenTracking}
                className="text-amber-800 font-semibold hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                Theo dõi đơn hàng ({activeOrderCount})
              </button>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action (Shopping Cart with item count) */}
          <div className="flex items-center gap-3 shrink-0">
            {activeOrderCount > 0 && (
              <button
                onClick={onOpenTracking}
                className="md:hidden px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors whitespace-nowrap"
              >
                Đơn hàng ({activeOrderCount})
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-800 text-white hover:bg-amber-900 active:scale-98 transition-all shadow-sm font-medium text-sm whitespace-nowrap shrink-0"
              aria-label={`Giỏ hàng: ${cartItemCount} món, tổng tiền ${formatVND(cartSubtotal)}`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartSubtotal > 0 && (
                <span className="hidden sm:inline text-xs font-semibold bg-amber-950/40 px-2 py-0.5 rounded-md tabular-nums">
                  {formatVND(cartSubtotal)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
