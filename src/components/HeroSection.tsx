import React from 'react';
import { Search, MapPin, Clock, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/dongHoiData';
import { DONG_HOI_WARDS } from '../utils/orderCalculator';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedWardId: string;
  onSelectWard: (wardId: string) => void;
  onQuickExplore: () => void;
  onOpenMap: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedWardId,
  onSelectWard,
  onQuickExplore,
  onOpenMap,
}) => {
  const currentWard = DONG_HOI_WARDS.find((w) => w.id === selectedWardId) || DONG_HOI_WARDS[0];

  return (
    <section className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Đại tiệc ẩm thực Đồng Hới bên sông Nhật Lệ"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          {/* Subtle unboxed metadata lead-in */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-300 mb-3 tracking-wide">
            <span>Thành phố Đồng Hới, Quảng Bình</span>
            <span aria-hidden="true">·</span>
            <span>Giao nhanh giữ nóng 15-25 phút</span>
            <span aria-hidden="true">·</span>
            <span>Món ngon chính gốc</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance mb-4">
            Ẩm Thực Đồng Hới Đậm Đà, Giao Nóng Tận Nhà
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-xl">
            Thưởng thức trọn vẹn Bánh lọc Mệ Xuân trong veo nhân tôm thịt, Cháo canh cá lóc ram giòn hay Hải sản mực nhảy tươi roi rói ven bờ biển Nhật Lệ.
          </p>

          {/* Search & Location Bar */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-stone-100">
            {/* Ward selector */}
            <div className="relative flex items-center min-w-[200px] border-b sm:border-b-0 sm:border-r border-stone-200 pb-2 sm:pb-0 sm:pr-3">
              <MapPin className="w-4 h-4 text-amber-700 ml-2 shrink-0" />
              <select
                value={selectedWardId}
                onChange={(e) => onSelectWard(e.target.value)}
                className="w-full pl-2 pr-6 py-1.5 text-xs sm:text-sm font-semibold text-stone-800 bg-transparent focus:outline-none appearance-none cursor-pointer"
                aria-label="Chọn phường/xã giao hàng tại Đồng Hới"
              >
                {DONG_HOI_WARDS.map((ward) => (
                  <option key={ward.id} value={ward.id} className="text-stone-900">
                    {ward.name} ({ward.estMinutes}p)
                  </option>
                ))}
              </select>
              <span className="absolute right-2 text-stone-400 pointer-events-none text-xs">▼</span>
            </div>

            {/* Dish Search Input */}
            <div className="flex-1 flex items-center relative">
              <Search className="w-4 h-4 text-stone-400 ml-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm bánh lọc, cháo canh, ram giòn, mực nhảy..."
                className="w-full pl-2.5 pr-3 py-1.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
                aria-label="Tìm kiếm món ăn Đồng Hới"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-2 text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5"
                  aria-label="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Action CTA */}
            <button
              onClick={onQuickExplore}
              className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>Khám phá món</span>
            </button>
          </div>

          {/* Quick trust metrics row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-stone-800/80 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">15 - 25 Phút</p>
                <p className="text-[11px] text-stone-400 hidden sm:block">Giao nhanh thùng giữ nhiệt</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Chính Gốc 100%</p>
                <p className="text-[11px] text-stone-400 hidden sm:block">Quán gia truyền lâu năm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Freeship từ 120k</p>
                <p className="text-[11px] text-stone-400 hidden sm:block">Mã giảm: FREESHIP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
