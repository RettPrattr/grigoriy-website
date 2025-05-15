'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/atoms/button';
import Popup from '@/components/blocks/popup';

export default function HeroBlock({ title, subtitle, video, tags = [], poster, direction, mediaType = 'video', image }) {
  const videoRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    setIsClient(true);
    if (videoRef.current && mediaType === 'video') {
      videoRef.current.play().catch(() => {});
    }
  }, [mediaType]);

  return (
    <>
      <section className="relative w-full min-h-screen flex flex-col mt-8">
        <div className="container relative z-10 mb-[--gap-pc] flex flex-col items-start">
          <h1 className="text-[--h1] mb-4 md:mb-[--gap-pc]">
            {title}
          </h1>
          <h2
            className="md:mb-8 mb-4"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />

          {/* Медиа блок */}
          <div className="relative w-full h-[600px] rounded-3xl shadow-inner bg-black/40 overflow-hidden flex items-end">
            {/* Категории */}
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-3">
                {tags.filter(Boolean).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 border border-gray-400 text-white text-base font-medium backdrop-blur-sm"
                    style={{borderRadius: '6px'}}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Кнопка */}
            <div className="absolute right-10 bottom-10 z-20">
              <Button type="fixed" onClick={openPopup}>Обсудить мой проект</Button>
            </div>

            {/* Медиа */}
            {mediaType === 'video' && isClient && video && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                poster={poster}
                style={{ boxShadow: 'inset 0 0 80px 10px rgba(0,0,0,0.35)' }}
              >
                <source src={video} type="video/mp4" />
              </video>
            )}
            {mediaType === 'image' && image && (
              <Image
                src={image}
                alt="Hero media"
                fill
                className="object-cover"
                priority
                style={{ boxShadow: 'inset 0 0 80px 10px rgba(0,0,0,0.35)' }}
              />
            )}
          </div>

          {/* Направление — под картинкой */}
          {direction && (
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Направление:</span>
                <span className="text-sm text-black">{direction}</span>
              </div>
            </div>
          )}
        </div>

        {/* Фоновое видео */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[--text-color]/30 z-[1]" />
          {isClient && video && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              poster={poster}
              style={{ opacity: 0.3 }}
            >
              <source src={video} type="video/mp4" />
            </video>
          )}
        </div>
      </section>

      {/* Модалка */}
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title="Обсудить мой проект"
        subtitle="Заполните форму, чтобы обсудить ваш проект"
      />
    </>
  );
}
