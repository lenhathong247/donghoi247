import React, { useState } from 'react';
import { FoodItem } from '../types/food';
import { formatVND } from '../utils/orderCalculator';
import { Star, Clock, Plus, Utensils } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  onSelect: (item: FoodItem) => void;
  onQuickAdd: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onSelect, onQuickAdd }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-amber-200 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      {/* Product Image slot with fallback container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelect(item)}>
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <Utensils className="w-10 h-10 mb-2 text-stone-300" />
            <span className="text-xs font-medium text-stone-500">{item.name}</span>
          </div>
        )}

        {/* Subtle top indicator - clean unboxed label */}
        {item.isSignature && (
          <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-amber-200 text-[11px] font-semibold px-2.5 py-1 rounded-md">
            Món trứ danh
          </div>
        )}

        {/* Quick add floating button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(item);
          }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-md hover:bg-amber-900 active:scale-95 transition-all opacity-95 group-hover:opacity-100"
          aria-label={`Thêm nhanh món ${item.name}`}
          title="Thêm nhanh vào giỏ hàng"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata with subtle typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 flex-wrap">
            <span className="font-medium text-amber-900/80">{item.restaurantName}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-700 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {item.rating.toFixed(1)} ({item.reviewCount})
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {item.prepTimeMinutes}p
            </span>
          </div>

          <h3
            onClick={() => onSelect(item)}
            className="text-base font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer line-clamp-1 mb-1.5"
          >
            {item.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Pricing and Action row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-amber-900 tabular-nums">
              {formatVND(item.price)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatVND(item.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(item)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Tùy chọn món
          </button>
        </div>
      </div>
    </div>
  );
};
