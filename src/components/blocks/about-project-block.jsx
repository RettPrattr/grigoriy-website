'use client';

import Image from 'next/image';
import { getMediaUrl } from '@/utils/config';
import { renderRichText } from '@/utils/richText';
import { useState, useEffect } from 'react';

export default function AboutProjectBlock({ 
  title = 'О проекте',
  description = '',
  image = null
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

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 
          className="mb-12"
          dangerouslySetInnerHTML={{ __html: typeof title === 'string' ? title : renderRichText(title) }}
          suppressHydrationWarning
        />
        
        <div className="flex items-end gap-8">
          <div className="w-1/2">
            {imageUrl && (
              <Image 
                src={imageUrl}
                alt={typeof title === 'string' ? title : 'О проекте'}
                width={800}
                height={500}
                className="w-full h-[500px] object-cover"
              />
            )}
          </div>
          
          <div className="w-1/2">
            {description && (
              <div 
                className="rich-text-component"
                dangerouslySetInnerHTML={{ __html: typeof description === 'string' ? description : renderRichText(description) }}
                suppressHydrationWarning
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}