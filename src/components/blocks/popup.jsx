'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getMediaUrl } from '@/utils/config';
import Button from '@/components/atoms/button';

export default function Popup({
  isOpen = false,
  onClose,
  title = 'Оставить заявку',
  subtitle = 'Заполните форму ниже',
  image = null
}) {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // Подготовка URL изображения
  const imageUrl = image && image.data && image.data.attributes 
    ? getMediaUrl(image.data.attributes.url)
    : null;

  // Инициализируем портал только на клиенте
  useEffect(() => {
    setMounted(true);
    setPortalContainer(document.body);
    setIsClient(true);
    
    // Блокируем скролл при открытии попапа
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    // Восстанавливаем скролл при закрытии
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Обработчик нажатия ESC для закрытия
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  // Обработчик клика по оверлею для закрытия
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  // Обработчик изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправка формы из попапа:', formData);
    // Здесь можно добавить реальную отправку данных на сервер
    onClose(); // Закрываем попап после отправки
  };
  
  // Если компонент не монтирован или попап закрыт, не рендерим ничего
  if (!mounted || !isOpen || !portalContainer) return null;
  
  // Рендерим попап в портале
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div 
        className="relative bg-white max-w-6xl w-full overflow-auto rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button 
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-gray-800 hover:text-black cursor-pointer"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Основная структура как в form-block */}
        <div className="padding-y margin-x">
          <div className="flex flex-col items-end md:flex-row">
            <div className="flex flex-col md:w-1/2">
              <h2
                className="text-black text-4xl mb-3"
                dangerouslySetInnerHTML={{ __html: "Всегда рад<br />новым клиентам" }}
              />
              <p className="text-black">Просто заполните форму и я свяжусь с вами<br />в течении 5 минут!</p>
            </div>
            
            {isClient && (
              <form
                className="flex flex-col mt-8 md:mt-0 md:w-1/2"
                onSubmit={handleSubmit}
              >
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Имя"
                  className="input w-full mb-6 py-6 px-6 text-base rounded-2xl bg-transparent backdrop-blur-sm border border-gray-300 text-black font-[400] placeholder-gray-500 placeholder:text-lg placeholder:font-[400] leading-tight align-middle"
                  style={{ textAlignVertical: 'center', fontWeight: 400 }}
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Телефон"
                  className="input w-full mb-6 py-6 px-6 text-base rounded-2xl bg-transparent backdrop-blur-sm border border-gray-300 text-black font-[400] placeholder-gray-500 placeholder:text-lg placeholder:font-[400] leading-tight align-middle"
                  style={{ textAlignVertical: 'center', fontWeight: 400 }}
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Опишите кратко свой проект"
                  className="input w-full mb-8 py-6 px-6 text-base rounded-2xl bg-transparent backdrop-blur-sm border border-gray-300 text-black font-[400] placeholder-gray-500 placeholder:text-lg placeholder:font-[400] min-h-[120px] resize-none leading-tight"
                  style={{ textAlignVertical: 'center', fontWeight: 400 }}
                />
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full py-4 px-6 rounded-2xl text-lg bg-[#A3CD39] text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                  style={{ fontWeight: 400 }}
                >
                  <span style={{ fontWeight: 400 }} className="font-[400]">Обсудить мой проект</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    portalContainer
  );
}