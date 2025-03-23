import React, { useState, useEffect, useRef } from 'react';

interface Option {
    id: number;
    value: string;
    label: string;
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
    const [positionDropdown, setPositionDropdown] = useState<'bottom' | 'top'>('bottom'); // Nuevo estado para la posición del dropdown
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

    useEffect(() => {
        if (show) {
            // Calcula la posición del dropdown solo cuando se muestra
            calculateDropdownPosition();
        }
    }, [show]); // Dependencia de 'show' para recalcular al mostrar/ocultar

    const calculateDropdownPosition = () => {
        if (!dropdownRef.current || !triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const dropdownElement = dropdownRef.current;
        const dropdownHeight = dropdownElement.offsetHeight; // Altura real del dropdown

        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            setPositionDropdown('top');
        } else {
            setPositionDropdown('bottom');
        }
    };


    const toggleDropdown = () => {
        setShow(!show);
    };

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
                                                <span>{options[index].label}</span>
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
                                        className={`absolute z-10 left-0 w-full max-h-60 overflow-y-auto rounded bg-white shadow dark:bg-form-input ${positionDropdown === 'bottom' ? 'top-full' : 'bottom-full'}`} // Posicionamiento condicional
                                        ref={dropdownRef}
                                        style={{ top: positionDropdown === 'top' ? 'auto' : undefined, bottom: positionDropdown === 'top' ? '100%' : undefined }} // Ajuste fino para 'top'
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
                                                {option.label}
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