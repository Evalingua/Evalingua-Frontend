import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  text: string;
  selected?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  label?: string;
  onSelectionChange?: (selectedValues: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options: initialOptions,
  label,
  onSelectionChange,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOptions(initialOptions);
    const newSelected = initialOptions
      .map((option, idx) => (option.selected ? idx : -1))
      .filter((idx) => idx !== -1);

    setSelected(newSelected);
  }, [initialOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = () => setShow(!show);

  const handleSelect = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index].selected = !updatedOptions[index].selected;

    setOptions(updatedOptions);

    const newSelected = updatedOptions
      .map((option, idx) => (option.selected ? idx : -1))
      .filter((idx) => idx !== -1);

    setSelected(newSelected);
    onSelectionChange?.(newSelected.map((idx) => updatedOptions[idx].value));
  };

  const handleRemove = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index].selected = false;

    setOptions(updatedOptions);
    const newSelected = selected.filter((i) => i !== index);

    setSelected(newSelected);
    onSelectionChange?.(newSelected.map((i) => updatedOptions[i].value));
  };

  return (
    <div className="relative">
      {label && (
        <label className="mb-1 block text-xs md:text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <div>
        <div className="flex flex-col items-center">
          <div className="relative inline-block w-full">
            <div className="flex flex-col items-center">
              <div ref={triggerRef} onClick={toggleDropdown} className="w-full">
                <div className="flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                  <div className="flex flex-auto flex-wrap gap-3">
                    {selected.map((index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2 text-sm font-medium dark:border-strokedark dark:bg-white/10"
                      >
                        <span>{options[index].text}</span>
                        <button
                          onClick={() => handleRemove(index)}
                          className="pl-2 hover:text-danger"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    {selected.length === 0 && (
                      <span className="flex-1">Selecciona una opción</span>
                    )}
                  </div>
                  <button onClick={toggleDropdown} className="ml-auto">
                    &#x25BC;
                  </button>
                </div>
              </div>
              <div className="w-full px-4">
                {show && (
                  <div
                    className="absolute z-10 top-full left-0 w-full max-h-60 overflow-y-auto rounded bg-white shadow dark:bg-form-input"
                    ref={dropdownRef}
                  >
                    {options.map((option, index) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(index)}
                        className={`flex items-center p-2 cursor-pointer ${
                          option.selected
                            ? 'dark:bg-primary bg-primary/30'
                            : 'hover:bg-primary/10'
                        }`}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
