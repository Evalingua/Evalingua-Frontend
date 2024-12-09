// Input.js
import React from 'react';

interface ModalProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  value?: string;
  classSize?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<ModalProps> = ({
  label = '',
  placeholder = '',
  disabled = false,
  rows = 2,
  value,
  classSize,
  onChange,
}) => {
  return (
    <div className={`relative ${classSize}`}>
      {label && (
        <label className=" mb-1 block text-black text-xs md:text-sm dark:text-white">
          {label}
        </label>
      )}
      <div className="flex items-center">
        <textarea
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          rows={rows}
          onChange={onChange}
          className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 md:py-3 px-3 text-black text-xs md:text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
            ${disabled ? 'cursor-not-allowed bg-gray-200 dark:bg-black' : ''}`}
        />
      </div>
    </div>
  );
};

export default TextArea;
