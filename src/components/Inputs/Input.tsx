// Input.js
import React from 'react';

interface ModalProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  isSearch?: boolean;
  onSearchClick?: any;
  value?: string;
  classSize?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<ModalProps> = ({
  label = '',
  placeholder = '',
  disabled = false,
  type = 'text',
  isSearch = false,
  onSearchClick,
  value,
  classSize,
  maxLength,
  onChange,
}) => {
  return (
    <div className={`relative ${classSize}`}>
      {label && (
        <label className="mb-1 block text-xs xl:text-sm text-black dark:text-white">
          {label}
        </label>
      )}
      <div className="flex items-center">
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 md:py-3 px-3 text-black text-xs md:text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
            ${disabled ? 'cursor-not-allowed bg-gray-200 dark:bg-black' : ''}`}
        />
        {isSearch && (
          <button
            type="button"
            onClick={() => onSearchClick(value)}
            className="absolute right-3 text-gray-500 dark:text-white hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
