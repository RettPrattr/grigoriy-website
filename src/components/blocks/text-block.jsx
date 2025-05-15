'use client';

import { useState, useEffect } from 'react';

export default function TextBlock({ 
  title = 'Заголовок',
  description = ''
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
        {title && (
          <h2 className="mb-8">{title}</h2>
        )}
        
        {/* Описание */}
        {description && (
          typeof description === 'string' ? (
            <p className="text-[--p]">{description}</p>
          ) : (
            <div
              className="text-[--p] rich-text-component"
              dangerouslySetInnerHTML={{ __html: description }}
              suppressHydrationWarning
            />
          )
        )}
      </div>
    </section>
  );
}