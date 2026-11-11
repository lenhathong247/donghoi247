import React, { useState } from 'react';
import { RESTAURANTS, FOOD_ITEMS } from '../data/dongHoiData';
import { Restaurant, FoodItem } from '../types/food';
import { formatVND } from '../utils/orderCalculator';
import { X, MapPin, Star, Clock, Navigation, Utensils, Check } from 'lucide-react';

interface DongHoiFoodMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFoodItem: (item: FoodItem) => void;
}

export const DongHoiFoodMapModal: React.FC<DongHoiFoodMapModalProps> = ({
  isOpen,
  onClose,
  onSelectFoodItem,
}) => {
  if (!isOpen) return null;

  const [activeRestaurantId, setActiveRestaurantId] = useState<string>(RESTAURANTS[0].id);

  const selectedRestaurant =
    RESTAURANTS.find((r) => r.id === activeRestaurantId) || RESTAURANTS[0];

  const restaurantDishes = FOOD_ITEMS.filter(
    (item) => item.restaurantId === selectedRestaurant.id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-700/80 text-amber-200 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 id="map-title" className="text-base sm:text-lg font-bold">
                Bản Đồ Ẩm Thực Đồng Hới - Quảng Bình
              </h2>
              <p className="text-xs text-stone-300">
                Khám phá các tọa độ ăn uống trứ danh ven sông & biển Nhật Lệ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Đóng bản đồ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view (SVG interactive Map on left/top, Restaurant details on right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 bg-stone-100">
          {/* Interactive Map Canvas (SVG Schematic of Dong Hoi River & Coast) */}
          <div className="md:col-span-7 bg-stone-900 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[340px]">
            {/* Visual SVG Map */}
            <svg
              viewBox="0 0 500 380"
              className="w-full h-auto max-h-[340px] rounded-2xl bg-stone-950/70 border border-stone-800"
            >
              {/* Coastline / East Sea (Biển Đông - Biển Nhật Lệ) */}
              <path
                d="M 360,0 C 370,120 380,240 400,380 L 500,380 L 500,0 Z"
                fill="#0e3a53"
                opacity="0.4"
              />
              <text x="410" y="40" fill="#38bdf8" fontSize="11" fontWeight="bold">
                BIỂN NHẬT LỆ
              </text>

              {/* Sông Nhật Lệ (River) */}
              <path
                d="M 280,0 C 270,90 260,180 280,260 C 295,310 320,380 320,380 L 260,380 C 240,310 225,250 225,180 C 225,90 240,0 240,0 Z"
                fill="#1e3a5f"
              />
              <text
                x="240"
                y="150"
                fill="#7dd3fc"
                fontSize="10"
                fontWeight="semibold"
                transform="rotate(-85 240,150)"
              >
                SÔNG NHẬT LỆ
              </text>

              {/* Cầu Nhật Lệ 1 */}
              <line
                x1="225"
                y1="190"
                x2="280"
                y2="200"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeDasharray="4,2"
              />
              <text x="180" y="215" fill="#fcd34d" fontSize="9">
                Cầu Nhật Lệ 1
              </text>

              {/* Bán đảo Bảo Ninh */}
              <text x="310" y="280" fill="#a8a29e" fontSize="10">
                Bán đảo Bảo Ninh
              </text>

              {/* Phường Hải Thành / Đồng Mỹ (City Center) */}
              <rect x="70" y="80" width="130" height="90" rx="8" fill="#292524" opacity="0.6" />
              <text x="80" y="105" fill="#e7e5e4" fontSize="10" fontWeight="bold">
                Trung tâm TP. Đồng Hới
              </text>
              <text x="80" y="125" fill="#a8a29e" fontSize="8">
                Quảng Bình Quan · Chợ Đồng Hới
              </text>

              {/* Restaurant Pins */}
              {/* 1. Mệ Xuân (Gần biển Nhật Lệ, Lê Thành Đồng) */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRestaurantId('rest-me-xuan')}
              >
                <circle
                  cx="250"
                  cy="70"
                  r={activeRestaurantId === 'rest-me-xuan' ? '12' : '8'}
                  fill={activeRestaurantId === 'rest-me-xuan' ? '#d97706' : '#b45309'}
                  className="transition-all"
                />
                <circle cx="250" cy="70" r="4" fill="#ffffff" />
                <text x="268" y="74" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  Bánh Lọc Mệ Xuân
                </text>
              </g>

              {/* 2. Cháo Canh Gia Bảo (Lý Thường Kiệt) */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRestaurantId('rest-gia-bao')}
              >
                <circle
                  cx="140"
                  cy="145"
                  r={activeRestaurantId === 'rest-gia-bao' ? '12' : '8'}
                  fill={activeRestaurantId === 'rest-gia-bao' ? '#d97706' : '#b45309'}
                />
                <circle cx="140" cy="145" r="4" fill="#ffffff" />
                <text x="60" y="155" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  Cháo Canh Gia Bảo
                </text>
              </g>

              {/* 3. Hải Sản Lương Chinh (Đường Trương Pháp - Biển) */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRestaurantId('rest-luong-chinh')}
              >
                <circle
                  cx="330"
                  cy="40"
                  r={activeRestaurantId === 'rest-luong-chinh' ? '12' : '8'}
                  fill={activeRestaurantId === 'rest-luong-chinh' ? '#d97706' : '#b45309'}
                />
                <circle cx="330" cy="40" r="4" fill="#ffffff" />
                <text x="345" y="44" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  Hải Sản Lương Chinh
                </text>
              </g>

              {/* 4. Bánh Khoái Tứ Quý Cô Tám */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRestaurantId('rest-tu-quy')}
              >
                <circle
                  cx="190"
                  cy="200"
                  r={activeRestaurantId === 'rest-tu-quy' ? '12' : '8'}
                  fill={activeRestaurantId === 'rest-tu-quy' ? '#d97706' : '#b45309'}
                />
                <circle cx="190" cy="200" r="4" fill="#ffffff" />
                <text x="110" y="225" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  Bánh Khoái Cô Tám
                </text>
              </g>

              {/* 5. Cà Phê Muối Nhật Lệ (Quách Xuân Kỳ bờ sông) */}
              <g
                className="cursor-pointer group"
                onClick={() => setActiveRestaurantId('rest-nhat-le-cafe')}
              >
                <circle
                  cx="235"
                  cy="175"
                  r={activeRestaurantId === 'rest-nhat-le-cafe' ? '12' : '8'}
                  fill={activeRestaurantId === 'rest-nhat-le-cafe' ? '#d97706' : '#b45309'}
                />
                <circle cx="235" cy="175" r="4" fill="#ffffff" />
                <text x="250" y="180" fill="#fef3c7" fontSize="10" fontWeight="bold">
                  Cà Phê Muối Bờ Sông
                </text>
              </g>
            </svg>

            {/* Quick Map Legend */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-3 pt-2 border-t border-stone-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                Nhấp vào điểm ghim để xem món của từng quán
              </span>
              <span>Đồng Hới, Quảng Bình</span>
            </div>
          </div>

          {/* Right Panel: Selected Restaurant Details and Dishes */}
          <div className="md:col-span-5 bg-white p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-800">
                  {selectedRestaurant.ward}
                </span>
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {selectedRestaurant.rating} ({selectedRestaurant.reviewCount})
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 mb-1">
                {selectedRestaurant.name}
              </h3>

              <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                {selectedRestaurant.address}
              </p>

              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 mb-4 border border-stone-100 flex items-center justify-between">
                <span>Mở cửa: {selectedRestaurant.openingHours}</span>
                <span className="font-semibold text-stone-900">
                  {selectedRestaurant.deliveryTime}
                </span>
              </div>

              {/* Dish list for this restaurant */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                Món ăn giao tận nơi từ quán này
              </h4>

              <div className="space-y-2.5">
                {restaurantDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => {
                      onClose();
                      onSelectFoodItem(dish);
                    }}
                    className="p-3 rounded-xl border border-stone-200 hover:border-amber-700 bg-stone-50 hover:bg-amber-50/40 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{dish.name}</p>
                      <p className="text-xs font-semibold text-amber-900 tabular-nums">
                        {formatVND(dish.price)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 shrink-0">
                      Chọn món →
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <p className="text-[11px] text-stone-500 text-center">
                Vị trí: {selectedRestaurant.landmark}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
