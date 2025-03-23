import React, { useRef, useState } from 'react';

interface ModalProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  isSearch?: boolean;
  onSearchClick?: (value: string) => any;
  value?: string;
  classSize?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showCopyButton?: boolean; // Nueva prop para mostrar el botón de copiar
}

const Input: React.FC<ModalProps> = ({
  label = '',
  placeholder = '',
  disabled = false,
  type = 'text',
  isSearch = false,
  onSearchClick = () => {},
  value = '',
  classSize,
  maxLength,
  onChange,
  showCopyButton = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);


  const handleCopyToClipboard = () => {
    if (inputRef.current) {
      const textToCopy = inputRef.current.value;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setShowTooltip(true); // Mostrar el tooltip
          setTimeout(() => setShowTooltip(false), 2000);
        })
        .catch((err) => {
          console.error('Error al copiar el texto: ', err);
        });
    }
  };

  return (
    <div className={`relative  ${classSize}`}>
      {label && (
        <label className="mb-1 block text-xs xl:text-sm text-black dark:text-white">
          {label}
        </label>
      )}
      <div className={`flex items-center border-[1.5px] border-stroke bg-transparent rounded-lg dark:border-strokedark [contain:content]`}>
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`w-full py-2 md:py-3 px-3 text-black text-xs md:text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
           `}
        />
        {isSearch && (
          <div className='relative bg-primary hover:bg-primary/85 transition-colors'>
            <button
              type="button"
              onClick={() => onSearchClick(value)}
              className="text-white w-10 h-11 flex items-center justify-center"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0"
                />
              </svg>
            </button>
          </div>
        )}
        {showCopyButton && (
          <div className='relative bg-primary hover:bg-primary/85 transition-colors'>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="text-white w-10 h-11 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2"
                />
              </svg>
            </button>
            {showTooltip && (
              <div className="absolute z-9999 -right-5 -top-8 bg-black text-white text-xs px-2 py-1 rounded-md">
                Copiado
              </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Input;