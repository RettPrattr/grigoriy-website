'use client';

import { useState, useEffect } from 'react';
import { renderRichText } from '@/utils/richText';
import Image from 'next/image';
import { getMediaUrl } from '@/utils/config';

export default function ResearchBlock({ 
  title = '',
  subtitle1 = '',
  subtitle2 = '',
  description1 = '',
  description2 = '',
  image1 = null,
  image2 = null,
  image3 = null
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

  const image1Url = extractImageUrl(image1);
  const image2Url = extractImageUrl(image2);
  const image3Url = extractImageUrl(image3);

  return (
    <section className="margin-x padding-y">
      <div className="container">
        {/* Основной заголовок */}
        {title && (
          <h2 
            className="text-[--h2] mb-8"
            dangerouslySetInnerHTML={{ __html: typeof title === 'string' ? title : renderRichText(title) }}
            suppressHydrationWarning
          />
        )}
        
        {/* Верхний блок - 2 колонки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Левая колонка */}
          <div>
            {subtitle1 && (
              <h3 
                className="text-[--h3] mb-4"
                dangerouslySetInnerHTML={{ __html: typeof subtitle1 === 'string' ? subtitle1 : renderRichText(subtitle1) }}
                suppressHydrationWarning
              />
            )}
            
            {description1 && (
              <div 
                className="text-[--p] rich-text-component mb-6" 
                dangerouslySetInnerHTML={{ __html: typeof description1 === 'string' ? description1 : renderRichText(description1) }}
                suppressHydrationWarning
              />
            )}
            
            {image1Url && (
              <div className="aspect-[16/9] relative w-full mb-8">
                <Image
                  src={image1Url}
                  alt={typeof title === 'string' ? title : 'Research image 1'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Правая колонка */}
          <div>
            {subtitle2 && (
              <h3 
                className="text-[--h3] mb-4"
                dangerouslySetInnerHTML={{ __html: typeof subtitle2 === 'string' ? subtitle2 : renderRichText(subtitle2) }}
                suppressHydrationWarning
              />
            )}
            
            {description2 && (
              <div 
                className="text-[--p] rich-text-component mb-6" 
                dangerouslySetInnerHTML={{ __html: typeof description2 === 'string' ? description2 : renderRichText(description2) }}
                suppressHydrationWarning
              />
            )}
            
            {image2Url && (
              <div className="aspect-[16/9] relative w-full mb-8">
                <Image
                  src={image2Url}
                  alt={typeof title === 'string' ? title : 'Research image 2'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Нижний блок - полная ширина */}
        {image3Url && (
          <div className="aspect-[21/9] relative w-full">
            <Image
              src={image3Url}
              alt={typeof title === 'string' ? title : 'Research image 3'}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
