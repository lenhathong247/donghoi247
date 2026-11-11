import React from 'react';
import { Sparkles, Utensils, Heart } from 'lucide-react';

export const LocalStorySection: React.FC = () => {
  return (
    <section id="story-section" className="py-14 border-t border-stone-200/80 bg-stone-100/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12 rounded-3xl">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Văn Hóa Ẩm Thực Miền Cát Trắng</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 mb-3">
          Bí Quyết Ẩm Thực Đồng Hới - “Răng Mà Ngon Rứa!”
        </h2>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Người Quảng Bình yêu cái vị cay nồng xé lưỡi của ớt hiểm, ngọt thanh của tôm đất, và giòn rụm của ram chiên vàng. Mỗi món ăn giao đến bạn đều được giữ trọn vẹn hơi nóng và tinh hoa bến nước sông Nhật Lệ.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-stone-200/80 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Bánh Bột Lọc Trong Veo
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Nhào từ tinh bột sắn lọc kỹ, vỏ bánh mỏng tang ôm trọn con tôm đất đỏ au và lát thịt ba chỉ đậm vị rim tiêu. Ăn lúc còn bốc khói, chấm mắm ớt nguyên chất là ngon đúng điệu.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200/80 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Cháo Canh Kèm Ram Giòn
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Điểm độc đáo chỉ có ở Đồng Hới: tô cháo canh cá lóc nấu với sợi mì dẻo mềm nhất định phải ăn kèm vài cuốn ram giòn tan ngập trong nước dùng béo ngọt.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-stone-200/80 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Mực Nhảy Biển Nhật Lệ
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Mực vừa câu ngoài khơi về bờ, thân trong suốt lấp lánh nướng trên than hoa rực hồng, phết mỡ hành thơm nức, chấm muối ớt xanh cay tê đầu lưỡi.
          </p>
        </div>
      </div>
    </section>
  );
};
