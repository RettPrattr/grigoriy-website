'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMediaUrl } from '@/utils/config';

export default function ImageBlock({ 
  image = null,
  alt = 'Изображение'
}) {
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиентского рендеринга
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Извлечение URL изображения из разных форматов Strapi
  const extractImageUrl = (imageData) => {
    if (!imageData) return null;
    
    let url = null;
    
    // Проверка всех возможных форматов Strapi
    if (imageData.data) {
      // Формат Strapi v4 с объектом data
      if (imageData.data.attributes?.url) {
        url = imageData.data.attributes.url;
      } 
      // Массив с данными
      else if (Array.isArray(imageData.data) && imageData.data[0]?.attributes?.url) {
        url = imageData.data[0].attributes.url;
      }
    } 
    // Прямой объект с URL
    else if (imageData.url) {
      url = imageData.url;
    }
    // Строка URL
    else if (typeof imageData === 'string') {
      url = imageData;
    }
    // Формат с attributes
    else if (imageData.attributes?.url) {
      url = imageData.attributes.url;
    }
    // Формат массива
    else if (Array.isArray(imageData) && imageData[0]?.url) {
      url = imageData[0].url;
    }
    
    // Если URL найден, получаем полный URL с медиа-сервера
    if (url) {
      try {
        return getMediaUrl(url);
      } catch (error) {
        console.error('Ошибка при обработке URL изображения:', error);
        return null;
      }
    }
    
    return null;
  };

  const imageUrl = extractImageUrl(image);

  if (!imageUrl) return null;

  return (
    <section className="w-full h-[850px] relative">
      <Image
        src={imageUrl}
        fill
        alt={alt}
        className="object-cover"
        priority
      />
    </section>
  );
} 