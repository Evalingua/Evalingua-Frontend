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
    const [positionDropdown, setPositionDropdown] = useState<'bottom' | 'top'>('bottom');
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
            calculateDropdownPosition();
        }
    }, [show]);

    const calculateDropdownPosition = () => {
        if (!dropdownRef.current || !triggerRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const dropdownElement = dropdownRef.current;
        const dropdownHeight = dropdownElement.offsetHeight;
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

    const handleSelect = (index: number, event: React.MouseEvent) => {
        // Detener la propagación para evitar que el clic en el checkbox cierre el dropdown
        event.stopPropagation();
        
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

    // Función para seleccionar o deseleccionar todas las opciones
    const handleSelectAll = (event: React.MouseEvent) => {
        event.stopPropagation();
        
        const areAllSelected = options.every(option => option.selected);
        const updatedOptions = [...options].map(option => ({
            ...option,
            selected: !areAllSelected
        }));
        
        setOptions(updatedOptions);
        
        const newSelected = !areAllSelected 
            ? updatedOptions.map((_, idx) => idx) 
            : [];
        
        setSelected(newSelected);
        onSelectionChange?.(newSelected.map((idx) => updatedOptions[idx].value));
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
                                        className={`absolute z-10 left-0 w-full max-h-60 overflow-y-auto rounded bg-white shadow dark:bg-form-input ${positionDropdown === 'bottom' ? 'top-full' : 'bottom-full'}`}
                                        ref={dropdownRef}
                                        style={{ top: positionDropdown === 'top' ? 'auto' : undefined, bottom: positionDropdown === 'top' ? '100%' : undefined }}
                                    >
                                        {/* Opción "Seleccionar todos" */}
                                        <div
                                            className="flex items-center p-2 cursor-pointer border-b border-stroke dark:border-strokedark"
                                            onClick={(e) => handleSelectAll(e)}
                                        >
                                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                                                {options.length > 0 && options.every(option => option.selected) && (
                                                    <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="font-medium">Seleccionar todos</span>
                                        </div>
                                        
                                        {/* Lista de opciones con checkboxes */}
                                        {options.map((option, index) => (
                                            <div
                                                key={option.value}
                                                onClick={(e) => handleSelect(index, e)}
                                                className={`flex items-center p-2 cursor-pointer ${
                                                    option.selected
                                                        ? 'dark:bg-primary/20 bg-primary/10'
                                                        : 'hover:bg-primary/5'
                                                }`}
                                            >
                                                <div className="mr-2 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                                                    {option.selected && (
                                                        <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    )}
                                                </div>
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