import React from 'react';
import { ProductVariantOption, SelectedVariants } from '../../types/product';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariantOption[];
  selectedVariants: SelectedVariants;
  onChange: (type: string, value: string) => void;
}

export default function VariantSelector({ variants, selectedVariants, onChange }: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      {variants.map((variantOption) => (
        <div key={variantOption.type}>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            {variantOption.label}
            {variantOption.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {variantOption.options.map((option) => {
              const isSelected = selectedVariants[variantOption.type] === option.id;
              const isAvailable = option.inStock;

              return (
                <button
                  key={option.id}
                  onClick={() => isAvailable && onChange(variantOption.type, option.id)}
                  disabled={!isAvailable}
                  className={`
                    relative px-4 py-3 border-2 rounded-lg font-semibold text-sm transition-all
                    ${isSelected
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : isAvailable
                      ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <div>{option.name}</div>
                  {option.priceModifier !== undefined && option.priceModifier !== 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {option.priceModifier > 0 ? '+' : ''}{' '}${Math.abs(option.priceModifier)}
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs font-bold text-red-500">Out</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}