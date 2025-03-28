import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Choose an option',
  options,
  value,
  onChange,
  disabled = false,
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOptionSelected(true);
    onChange(event.target.value);
  };

  return (
    <div className="">
      {label && (
        <label className="mb-1 block text-black text-xs md:text-sm dark:text-white">
          {label}
        </label>
      )}

      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={value}
          onChange={handleSelection}
          disabled={disabled}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 md:py-3 px-3 text-xs md:text-sm outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="text-body dark:text-bodydark"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Select;
