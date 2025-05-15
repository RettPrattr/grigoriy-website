'use client';

import { useState, useEffect } from 'react';
import { renderRichText } from '@/utils/richText';

export default function StagesBlock({ 
  title = 'Этапы работ',
  stages = [],
  stageItem = [] // поддержка обоих вариантов именования пропсов
}) {
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиентского рендеринга
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Используем тот массив, который не пустой
  const stagesData = stages.length > 0 ? stages : stageItem;

  return (
    <section className="margin-x padding-y">
      <div className="container">
        {/* Заголовок */}
        <h2 
          className="md:mb-8 mb-4"
          dangerouslySetInnerHTML={{ __html: title }}
          suppressHydrationWarning
        />
        
        {/* Сетка этапов */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {Array.isArray(stagesData) && stagesData.slice(0, 5).map((stage, index) => (
            <div key={index} className="flex flex-col">
              {/* Номер этапа и заголовок */}
              <div className="flex items-baseline mb-4">
                <span className="text-5xl opacity-15 mr-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                <div className="flex-grow text-[--p] relative top-[10px]">
                  {typeof stage.text === 'string' ? (
                    <p>{stage.text}</p>
                  ) : (
                    <div
                      className="rich-text-component"
                      dangerouslySetInnerHTML={{ __html: renderRichText(stage.text) }}
                      suppressHydrationWarning
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 