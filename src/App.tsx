/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { FoodCard } from './components/FoodCard';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { DongHoiFoodMapModal } from './components/DongHoiFoodMapModal';
import { RestaurantsListSection } from './components/RestaurantsListSection';
import { LocalStorySection } from './components/LocalStorySection';
import { Footer } from './components/Footer';

import { FOOD_ITEMS, RESTAURANTS } from './data/dongHoiData';
import { FoodItem, FoodOption, CartItem, Order } from './types/food';
import {
  calculateSubtotal,
  DONG_HOI_WARDS,
  formatVND,
} from './utils/orderCalculator';
import { Check, Flame, MapPin } from 'lucide-react';

export default function App() {
  // Application State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => [
    // Pre-populate with 1 signature item so first-time visitors can instantly see and test the cart!
    {
      cartItemId: 'sample-1',
      foodItem: FOOD_ITEMS[0],
      quantity: 1,
      spicyLevel: 'Cay chuẩn Quảng Bình (cay nồng)',
      selectedOptions: [
        { id: 'size-standard', name: 'Đĩa tiêu chuẩn (15 cái)', price: 0 },
        { id: 'extra-ram', name: 'Thêm 3 cuốn ram giòn rụm', price: 15000 },
      ],
      specialInstructions: 'Nước mắm ớt hiểm cay nhiều',
      unitPrice: 55000,
    },
  ]);

  const [selectedWardId, setSelectedWardId] = useState<string>('hai-thanh');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlySignature, setOnlySignature] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'prep-time'>('popular');
  const [activeRestaurantFilter, setActiveRestaurantFilter] = useState<string | null>(null);

  // Modals & Drawers state
  const [detailModalItem, setDetailModalItem] = useState<FoodItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedWard =
    DONG_HOI_WARDS.find((w) => w.id === selectedWardId) || DONG_HOI_WARDS[0];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (
    item: FoodItem,
    quantity: number,
    spicyLevel: string,
    selectedOptions: FoodOption[],
    note: string
  ) => {
    const optionsTotal = selectedOptions.reduce((s, o) => s + o.price, 0);
    const unitPrice = item.price + optionsTotal;

    const newItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      foodItem: item,
      quantity,
      spicyLevel,
      selectedOptions,
      specialInstructions: note || undefined,
      unitPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(`Đã thêm ${quantity}x "${item.name}" vào giỏ hàng`);
  };

  const handleQuickAdd = (item: FoodItem) => {
    // Default fast-add with standard options
    const defaultSpicy = item.spicyLevels ? item.spicyLevels[0] : undefined;
    const defaultOptions: FoodOption[] = [];
    if (item.optionGroups) {
      item.optionGroups.forEach((g) => {
        if (g.required && g.options.length > 0) {
          defaultOptions.push(g.options[0]);
        }
      });
    }

    const optionsTotal = defaultOptions.reduce((s, o) => s + o.price, 0);
    const unitPrice = item.price + optionsTotal;

    const newItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      foodItem: item,
      quantity: 1,
      spicyLevel: defaultSpicy,
      selectedOptions: defaultOptions,
      unitPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCartItems([]);
    setIsCartOpen(false);
    setIsTrackingOpen(true);
    showToast('Đặt món thành công! Quán đang bắt đầu chế biến.');
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status: nextStatus });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and Sort dishes
  const filteredDishes = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Signature filter
      if (onlySignature && !item.isSignature) {
        return false;
      }
      // Restaurant filter
      if (activeRestaurantFilter && item.restaurantId !== activeRestaurantFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesRest = item.restaurantName.toLowerCase().includes(query);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesRest && !matchesTag) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'prep-time') {
        return a.prepTimeMinutes - b.prepTimeMinutes;
      }
      // Default: popular
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [selectedCategory, onlySignature, activeRestaurantFilter, searchQuery, sortBy]);

  const cartSubtotal = calculateSubtotal(cartItems);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-700 selection:text-white">
      {/* Top Navigation */}
      <Header
        cartItemCount={cartItemCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        activeOrderCount={activeOrder ? 1 : 0}
        selectedWardName={selectedWard.name}
        onSelectWardModal={() => setIsCartOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Hero with Dong Hoi atmosphere */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedWardId={selectedWardId}
        onSelectWard={setSelectedWardId}
        onQuickExplore={() => handleScrollToSection('menu-section')}
        onOpenMap={() => setIsMapOpen(true)}
      />

      {/* Main Content Area */}
      <main id="menu-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Active Restaurant Filter Banner (if selected) */}
        {activeRestaurantFilter && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900">
                Đang xem thực đơn từ:
              </span>
              <span className="font-semibold text-stone-900">
                {RESTAURANTS.find((r) => r.id === activeRestaurantFilter)?.name}
              </span>
            </div>
            <button
              onClick={() => setActiveRestaurantFilter(null)}
              className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
            >
              Xem tất cả quán Đồng Hới ✕
            </button>
          </div>
        )}

        {/* Section Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Flame className="w-4 h-4" />
            <span>Thực đơn giao nóng tận nhà</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Món Ngon Đặc Sản Đồng Hới - Quảng Bình
          </h2>
        </div>

        {/* Categories, Sort and Filters */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onlySignature={onlySignature}
          onToggleSignature={() => setOnlySignature((v) => !v)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemCount={filteredDishes.length}
        />

        {/* Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDishes.map((dish) => (
              <FoodCard
                key={dish.id}
                item={dish}
                onSelect={(item) => setDetailModalItem(item)}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/80 p-8">
            <p className="text-base font-bold text-stone-800 mb-1">
              Không tìm thấy món ăn phù hợp
            </p>
            <p className="text-xs text-stone-500 mb-4">
              Thử tìm kiếm với từ khóa khác như "bánh lọc", "cháo canh", "hải sản" hoặc chọn lại danh mục.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlySignature(false);
                setActiveRestaurantFilter(null);
              }}
              className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Featured Restaurants List */}
        <RestaurantsListSection
          onSelectRestaurantFilter={(id) => {
            setActiveRestaurantFilter(id);
            handleScrollToSection('menu-section');
          }}
          activeRestaurantFilter={activeRestaurantFilter}
          onOpenMap={() => setIsMapOpen(true)}
        />

        {/* Dong Hoi Cultural Gastronomy Story */}
        <LocalStorySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Food Customization Modal */}
      <FoodDetailModal
        item={detailModalItem}
        onClose={() => setDetailModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        selectedWardId={selectedWardId}
        onSelectWard={setSelectedWardId}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        order={activeOrder}
        onClose={() => setIsTrackingOpen(false)}
        onAdvanceOrderStatus={handleAdvanceOrderStatus}
      />

      {/* Interactive Dong Hoi Food Map Modal */}
      <DongHoiFoodMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectFoodItem={(item) => setDetailModalItem(item)}
      />

      {/* Floating Action Button for active order if modal is closed */}
      {activeOrder && !isTrackingOpen && (
        <button
          onClick={() => setIsTrackingOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-amber-950 transition-all active:scale-95 text-xs font-bold border border-amber-700/60"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Đơn #{activeOrder.id} đang giao</span>
        </button>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
