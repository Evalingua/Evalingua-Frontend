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
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Choose an option',
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOptionSelected(true);
    onChange(event.target.value);
  };

  // Referencia al elemento select
  const selectRef = React.useRef<HTMLSelectElement>(null);

  // Función para abrir el select al hacer clic en el wrapper o en el icono
  const handleWrapperClick = (event: React.MouseEvent) => {
    if (selectRef.current && !disabled) {
      // Si el clic fue en el SVG o su contenedor, enfocamos el select
      if (!event.target || !(event.target as HTMLElement).closest('select')) {
        event.preventDefault();
        selectRef.current.focus();
        // En algunos navegadores, el focus no es suficiente para abrir el dropdown
        // Esta técnica simula un clic en el select
        const clickEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        selectRef.current.dispatchEvent(clickEvent);
      }
    }
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="mb-1 block text-black text-xs md:text-sm dark:text-white">
          {label}
        </label>
      )}

      <div 
        className="relative z-20 bg-transparent dark:bg-form-input cursor-pointer"
        onClick={handleWrapperClick}
      >
        <select
          ref={selectRef}
          value={value}
          onChange={handleSelection}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`relative z-20 w-full appearance-none rounded border disabled:bg-slate-100 border-stroke bg-transparent py-2 md:py-3 px-3 text-xs md:text-sm outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="text-black dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 pointer-events-none">
          <svg
            className={`fill-current transition-transform duration-200 ${isFocused ? 'transform rotate-180' : ''}`}
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