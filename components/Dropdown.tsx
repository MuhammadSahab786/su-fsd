'use client';
import { useState } from 'react';

import { DropdownProps, SortByType } from '@/interfaces';

const Dropdown: React.FC<DropdownProps> = ({
  buttonLabel,
  items,
  selectedValue,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClick = (newValue: SortByType) => {
    onClick(newValue);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={toggleDropdown}
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        type='button'
      >
        {selectedValue || buttonLabel}
        <svg
          className='ml-2 w-4 h-4'
          aria-hidden='true'
          fill='none'
          viewBox='0 0 20 20'
        >
          <path
            d='M6 8l4 4 4-4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {isOpen && (
        <div className='absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-max dark:bg-gray-700'>
          <ul className='py-1 text-sm text-gray-700 dark:text-gray-200'>
            {items.map((item, index) => (
              <li key={index} onClick={() => handleClick(item.value)}>
                <span className='block px-4 py-2 hover:bg-gray-100 cursor-pointer w-full dark:hover:bg-gray-600 dark:hover:text-white'>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
