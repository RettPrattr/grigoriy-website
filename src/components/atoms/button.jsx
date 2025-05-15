'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Button({
  type = 'default',
  href = null,
  className = '',
  onClick = null,
  children,
  isFixed = false,
  inverted = false,
  icon = null
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Слушатель прокрутки для фиксированной кнопки
  useEffect(() => {
    if (!isFixed) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Показываем кнопку после прокрутки на 300px
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFixed]);

  // Определение стилей в зависимости от типа кнопки
  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 text-center cursor-pointer';
    
    switch (type) {
      case 'fixed': // Белый фон, черный текст или инвертированный вариант
        return inverted 
          ? `${baseStyles} bg-black text-white py-5 px-8 rounded-xl hover:bg-[#A3CD39] hover:text-black`
          : `${baseStyles} bg-white text-black py-5 px-8 rounded-xl hover:bg-[#A3CD39] hover:text-black`;
      
      case 'more': // Как fixed + легкая тень
        return `${baseStyles} bg-white text-black py-2 px-4 border border-black shadow-sm hover:bg-[#A3CD39] hover:text-black`;
      
      case 'dark': // Черный фон, белый текст, 100% rounded
        return `${baseStyles} bg-black text-white py-3 px-7 rounded-full hover:bg-[#A3CD39] hover:text-black`;
      
      case 'default': // Стандартный стиль как fixed
      default:
        return `${baseStyles} bg-white text-black py-2 px-4 border hover:bg-[#A3CD39] hover:text-black`;
    }
  };

  // Содержимое кнопки
  const buttonContent = (
    <>
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </>
  );

  // Если кнопка фиксированная, добавляем специальные стили
  if (isFixed) {
    return (
      <div 
        className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {href ? (
          <Link href={href} className={`${getButtonStyles()} ${className}`}>
            {buttonContent}
          </Link>
        ) : (
          <button className={`${getButtonStyles()} ${className}`} onClick={onClick}>
            {buttonContent}
          </button>
        )}
      </div>
    );
  }

  // Обычная кнопка
  return href ? (
    <Link href={href} className={`${getButtonStyles()} ${className}`}>
      {buttonContent}
    </Link>
  ) : (
    <button className={`${getButtonStyles()} ${className}`} onClick={onClick}>
      {buttonContent}
    </button>
  );
} 