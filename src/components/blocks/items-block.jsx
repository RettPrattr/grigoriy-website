'use client';

import { useState, useEffect } from 'react';

export default function ItemsBlock({ 
  title = 'Заголовок блока',
  items = []
}) {
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиентского рендеринга
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="margin-x padding-y">
      <div className="container">
        {/* Заголовок */}
        <h2 className="md:mb-8 mb-4">{title}</h2>
        
        {/* Список айтемов */}
        <div className="flex flex-col">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row py-8 md:py-10 ${
                index !== items.length - 1 ? 'border-b border-[--text-color]/15' : ''
              }`}
            >
              {/* Подзаголовок (слева) */}
              <div className="md:w-1/3 mb-4 md:mb-0">
                {typeof item.subtitle === 'string' ? (
                  <h3 className="text-[--h3]">{item.subtitle}</h3>
                ) : (
                  <h3
                    className="text-[--h3] rich-text-component"
                    dangerouslySetInnerHTML={{ __html: item.subtitle }}
                    suppressHydrationWarning
                  />
                )}
              </div>
              
              {/* Описание (справа) */}
              <div className="md:w-2/3 md:ml-auto md:text-right">
                {typeof item.description === 'string' ? (
                  <p className="text-[--p] opacity-[var(--text-opacity-grade)]">{item.description}</p>
                ) : (
                  <div
                    className="text-[--p] opacity-[var(--text-opacity-grade)] rich-text-component"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    suppressHydrationWarning
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}