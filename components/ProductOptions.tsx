"use client";
import { useState } from 'react';

interface ProductOptionsProps {
    options: any[];
    onOptionsChange: (selectedOptions: Record<string, string[]>) => void;
}

export default function ProductOptions({ options, onOptionsChange }: ProductOptionsProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

    if (!options || options.length === 0) {
        return null;
    }

    const handleOptionChange = (optionName: string, choiceLabel: string, isMultiple: boolean) => {
        setSelectedOptions((prev) => {
            const newOptions = { ...prev };

            if (isMultiple) {
                // Toggle selection for multiple choice
                if (!newOptions[optionName]) {
                    newOptions[optionName] = [choiceLabel];
                } else if (newOptions[optionName].includes(choiceLabel)) {
                    newOptions[optionName] = newOptions[optionName].filter(c => c !== choiceLabel);
                    if (newOptions[optionName].length === 0) {
                        delete newOptions[optionName];
                    }
                } else {
                    newOptions[optionName] = [...newOptions[optionName], choiceLabel];
                }
            } else {
                // Single choice - replace
                newOptions[optionName] = [choiceLabel];
            }

            onOptionsChange(newOptions);
            return newOptions;
        });
    };

    return (
        <div className="space-y-6">
            {options.map((option, index) => (
                <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                            {option.name}
                            {option.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        {option.multiple && (
                            <span className="text-xs text-foreground/60">(Múltiples opciones)</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {option.choices?.map((choice: any, choiceIndex: number) => {
                            const isSelected = selectedOptions[option.name]?.includes(choice.label);

                            return (
                                <button
                                    key={choiceIndex}
                                    type="button"
                                    onClick={() => handleOptionChange(option.name, choice.label, option.multiple)}
                                    className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${isSelected
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-white text-foreground hover:border-primary/50'
                                        }`}
                                >
                                    <div>{choice.label}</div>
                                    {choice.extraPrice > 0 && (
                                        <div className="text-xs mt-1">
                                            +L. {choice.extraPrice.toFixed(2)}
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
