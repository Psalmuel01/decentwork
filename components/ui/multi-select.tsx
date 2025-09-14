'use client';

import { LucideSearch, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface MultiSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
}

export const MultiSelector = ({
  selected,
  onChange,
  maxSelections = 5,
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission

      if (inputValue.trim() && selected.length < maxSelections) {
        if (!selected.includes(inputValue.trim())) {
          onChange([...selected, inputValue.trim()]);
        }
        setInputValue('');
      }
    } else if (inputValue === '' && selected.length > 0) {
      // Remove the last item when backspace is pressed on empty input
      const newSelected = [...selected];
      newSelected.pop();
      onChange(newSelected);
    }
  };

  const removeItem = (itemToRemove: string) => {
    onChange(selected.filter((item) => item !== itemToRemove));
  };

  return (
    <>
      <div className="relative h-max">
        <div className="flex flex-wrap items-center gap-2 w-full p-3 border min-h-14 rounded-lg">
          <LucideSearch color={'gray'} strokeWidth={1.5} />
          {selected.length < maxSelections && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[50px] outline-none bg-transparent px-1 rounded-md"
              placeholder="Enter skills here"
            />
          )}
        </div>
        {selected.length === maxSelections && (
          <div className="absolute top-[50%] left-[50px] translate-y-[-50%] text-gray-400">
            Skill limit reached
          </div>
        )}
      </div>
      <div className="flex gap-3 flex-wrap mt-2">
        {selected.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm border-[#E4E4E7] border-[1px]"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <p className="font-circular text-sm text-[#7E8082]">Max 5 skills</p>
      </div>
    </>
  );
};
