'use client'

import { getMediaUrl } from '@/utils/config'
import Image from 'next/image'
import Link from 'next/link'
import { renderRichText } from '@/utils/richText'
import { useState, useEffect } from 'react'

export default function AboutBlock({
  title = '',
  description = '',
  buttonText = 'Узнать больше',
  buttonLink = '/about',
  image = null,
  socialLinks = [],
  reverse = false
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
    <section className='bg-[var(--background-color)]'>
      <div className='margin-x padding-y'>
        <div className='container flex flex-col items-start md:flex-row gap-8'>
          {/* Изображение (50% ширины) */}
          <div
            className={`${
              reverse ? 'order-2 md:ml-6' : 'order-1 md:mr-6'
            } mb-8 md:mb-0 md:w-1/2 h-[500px] w-full relative`}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                fill
                alt={typeof title === 'string' ? title : 'Изображение'}
                className='object-cover'
              />
            )}
          </div>

          {/* Контент (50% ширины) */}
          <div
            className={`${
              reverse ? 'order-1' : 'order-2'
            } flex flex-col justify-center md:w-1/2`}
          >
            <div className="flex flex-col">
              {/* Заголовок */}
              {title && (
                <h2 
                  className='text-[var(--text-color)] mb-8'
                  dangerouslySetInnerHTML={{ __html: typeof title === 'string' ? title : renderRichText(title) }}
                  suppressHydrationWarning
                />
              )}
              
              {/* Описание */}
              {description && (
                <div 
                  className='text-[var(--text-color)] opacity-[var(--text-opacity-grade)] mb-8 rich-text-component'
                  dangerouslySetInnerHTML={{ __html: typeof description === 'string' ? description : renderRichText(description) }}
                  suppressHydrationWarning
                />
              )}
              
              {/* Кнопка */}
              {buttonText && (
                <div className="mb-8">
                  <Link 
                    href={buttonLink} 
                    className="py-3 px-6 bg-black text-white hover:bg-gray-800 transition-colors rounded-md inline-block"
                  >
                    {buttonText}
                  </Link>
                </div>
              )}
            </div>
            
            {/* Иконки соцсетей */}
            {isClient && socialLinks && socialLinks.length > 0 && (
              <div className="flex flex-row items-center gap-4">
                {socialLinks.map((link) => (
                  <Link 
                    key={link.id || index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--text-color)] hover:text-[var(--main-color)] transition-colors"
                  >
                    {link.icon ? (
                      <span dangerouslySetInnerHTML={{ __html: link.icon }} suppressHydrationWarning />
                    ) : (
                      <span>{link.name}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}