import React from 'react';
import { RESTAURANTS } from '../data/dongHoiData';
import { Restaurant } from '../types/food';
import { MapPin, Clock, Star, Utensils, Award } from 'lucide-react';

interface RestaurantsListSectionProps {
  onSelectRestaurantFilter: (restaurantId: string | null) => void;
  activeRestaurantFilter: string | null;
  onOpenMap: () => void;
}

export const RestaurantsListSection: React.FC<RestaurantsListSectionProps> = ({
  onSelectRestaurantFilter,
  activeRestaurantFilter,
  onOpenMap,
}) => {
  return (
    <section id="restaurants-section" className="py-12 border-t border-stone-200/80">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Award className="w-4 h-4" />
            <span>Địa chỉ uy tín gia truyền</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Quán Ăn Nổi Tiếng Nhất TP. Đồng Hới
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {activeRestaurantFilter && (
            <button
              onClick={() => onSelectRestaurantFilter(null)}
              className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              Hiện tất cả quán
            </button>
          )}
          <button
            onClick={onOpenMap}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Xem trên bản đồ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {RESTAURANTS.map((rest) => {
          const isSelected = activeRestaurantFilter === rest.id;

          return (
            <div
              key={rest.id}
              onClick={() =>
                onSelectRestaurantFilter(isSelected ? null : rest.id)
              }
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-800 ring-2 ring-amber-800/20 shadow-md'
                  : 'bg-white border-stone-200/80 hover:border-amber-400 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-amber-900">{rest.ward}</span>
                  <span className="flex items-center gap-1 font-bold text-stone-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {rest.rating} ({rest.reviewCount})
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {rest.name}
                </h3>

                <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{rest.address}</span>
                </p>

                <p className="text-[11px] text-stone-400 italic mb-4">
                  Tọa độ: {rest.landmark}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-stone-600">
                  <Clock className="w-3 h-3 text-stone-400" />
                  Giao trong {rest.deliveryTime}
                </span>

                <span
                  className={`font-semibold ${
                    isSelected ? 'text-amber-900 underline' : 'text-stone-700'
                  }`}
                >
                  {isSelected ? 'Đang lọc món quán này' : 'Xem món ăn →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
