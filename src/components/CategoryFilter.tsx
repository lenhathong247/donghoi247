import React from 'react';
import { CATEGORIES } from '../data/dongHoiData';
import { Filter, Star, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onlySignature: boolean;
  onToggleSignature: () => void;
  sortBy: 'popular' | 'rating' | 'price-asc' | 'prep-time';
  onSortChange: (sort: 'popular' | 'rating' | 'price-asc' | 'prep-time') => void;
  itemCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  onlySignature,
  onToggleSignature,
  sortBy,
  onSortChange,
  itemCount,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Category Segmented Control */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary filters & Sort */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onToggleSignature}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              onlySignature
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Chỉ món trứ danh</span>
          </button>

          <div className="flex items-center bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
            <span className="text-stone-400 mr-1.5">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="popular">Nổi bật nhất</option>
              <option value="rating">Đánh giá cao (4.8+)</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="prep-time">Chuẩn bị nhanh nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <div className="flex items-center gap-2">
          <span>Tìm thấy <strong className="text-stone-900 font-semibold">{itemCount}</strong> món ăn</span>
          <span aria-hidden="true">·</span>
          <span>Đóng hộp giữ nhiệt giao tận tay</span>
        </div>
      </div>
    </div>
  );
};
