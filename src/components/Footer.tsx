import React from 'react';
import { Phone, MapPin, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-white block">
              Đồng Hới Food
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dịch vụ đặt và giao đồ ăn đặc sản Quảng Bình số 1 tại Thành phố Đồng Hới. Mang hương vị quê hương nóng hổi đến từng căn nhà.
            </p>
            <div className="text-xs text-amber-300 font-semibold pt-1">
              Phục vụ: 06:30 - 23:00 hàng ngày
            </div>
          </div>

          {/* Delivery areas */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white">
              Khu Vực Giao Hàng
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Phường Đồng Mỹ & Hải Thành</li>
              <li>Phường Bắc Lý & Nam Lý</li>
              <li>Phường Đồng Hải & Phú Hải</li>
              <li>Bán đảo Bảo Ninh & Bãi tắm</li>
              <li>Đường ven biển Trương Pháp</li>
            </ul>
          </div>

          {/* Iconic Dishes */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white">
              Đặc Sản Nổi Bật
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Bánh bột lọc trần & gói lá Mệ Xuân</li>
              <li>Cháo canh cá lóc ram giòn</li>
              <li>Bánh khoái giòn rụm chấm nước lèo</li>
              <li>Mực nhảy & hải sản tươi Nhật Lệ</li>
              <li>Cà phê muối ven sông mát lành</li>
            </ul>
          </div>

          {/* Contact and hotline */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white">
              Tổng Đài Hỗ Trợ Đơn Hàng
            </h4>
            <div className="flex items-center gap-2 text-stone-300">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-white text-sm">0232.3828.789</span>
            </div>
            <div className="flex items-start gap-2 text-stone-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Đường Quách Xuân Kỳ, P. Đồng Mỹ, TP. Đồng Hới, Tỉnh Quảng Bình</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Đảm bảo giao giữ nhiệt trong thùng chuyên dụng bảo quản độ nóng giòn.
            </p>
          </div>
        </div>

        {/* Quiet copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© 2026 Đồng Hới Food. Tất cả các quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Tự hào lan tỏa tinh hoa ẩm thực Đồng Hới, Quảng Bình
          </p>
        </div>
      </div>
    </footer>
  );
};
