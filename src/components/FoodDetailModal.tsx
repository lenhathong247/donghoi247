import React, { useState } from 'react';
import { FoodItem, FoodOption } from '../types/food';
import { formatVND } from '../utils/orderCalculator';
import { X, Star, Clock, Plus, Minus, Check, Flame } from 'lucide-react';

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, spicyLevel: string, selectedOptions: FoodOption[], note: string) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const defaultSpicy = item.spicyLevels && item.spicyLevels.length > 0 ? item.spicyLevels[1] || item.spicyLevels[0] : 'Cay vừa';
  const [selectedSpicy, setSelectedSpicy] = useState<string>(defaultSpicy);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, FoodOption>>(() => {
    const initial: Record<string, FoodOption> = {};
    if (item.optionGroups) {
      item.optionGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          initial[group.id] = group.options[0];
        }
      });
    }
    return initial;
  });
  const [specialNote, setSpecialNote] = useState<string>('');

  const handleOptionSelect = (groupId: string, option: FoodOption, isMulti: boolean = false) => {
    setSelectedOptions((prev) => {
      const updated = { ...prev };
      if (isMulti) {
        const key = `${groupId}-${option.id}`;
        if (updated[key]) {
          delete updated[key];
        } else {
          updated[key] = option;
        }
      } else {
        updated[groupId] = option;
      }
      return updated;
    });
  };

  const optionsList = Object.values(selectedOptions);
  const optionsTotal = optionsList.reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = item.price + optionsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, selectedSpicy, optionsList, specialNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header Image */}
        <div className="relative h-56 sm:h-64 bg-stone-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
              <span>{item.restaurantName}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {item.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {item.prepTimeMinutes} phút
              </span>
            </div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold leading-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Body / Scrollable configuration */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          <p className="text-sm text-stone-600 leading-relaxed">
            {item.description}
          </p>

          {/* Spicy level selector - Authentic Dong Hoi */}
          {item.spicyLevels && item.spicyLevels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Flame className="w-4 h-4 text-red-600" />
                <h4 className="text-sm font-bold text-stone-900">
                  Độ cay nước chấm & ớt Đồng Hới
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {item.spicyLevels.map((lvl) => {
                  const isSelected = selectedSpicy === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSpicy(lvl)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl text-left transition-colors border cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 border-amber-800 text-amber-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{lvl}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-800 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Option groups (portion size, add-ons) */}
          {item.optionGroups && item.optionGroups.map((group) => (
            <div key={group.id} className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-sm font-bold text-stone-900">
                  {group.title}
                </h4>
                {group.required && (
                  <span className="text-[11px] font-medium text-amber-800">
                    Bắt buộc chọn 1
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {group.options.map((opt) => {
                  const isSelected = group.required
                    ? selectedOptions[group.id]?.id === opt.id
                    : !!selectedOptions[`${group.id}-${opt.id}`];

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionSelect(group.id, opt, !group.required)}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-800 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-${group.required ? 'full' : 'md'} border flex items-center justify-center ${
                            isSelected
                              ? 'border-amber-800 bg-amber-800 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>
                      <span className="font-semibold text-stone-900 tabular-nums">
                        {opt.price === 0 ? 'Miễn phí' : `+${formatVND(opt.price)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special note */}
          <div>
            <label htmlFor="food-note" className="block text-xs font-bold text-stone-700 mb-1.5">
              Ghi chú cho quán (không hành, để riêng nước chấm,...)
            </label>
            <input
              id="food-note"
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="Ví dụ: Đóng riêng ớt hiểm, bánh lấy nóng giòn..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-800 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Modal Footer / Quantity & Add to Cart button */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Giảm số lượng"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-stone-900 tabular-nums text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Tăng số lượng"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 active:scale-98 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-between cursor-pointer"
          >
            <span>Thêm vào giỏ hàng</span>
            <span className="tabular-nums font-bold">{formatVND(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
