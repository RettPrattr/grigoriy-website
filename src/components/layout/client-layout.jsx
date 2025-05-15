'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/atoms/button';
import Popup from '@/components/blocks/popup';

export default function ClientLayout({ children, style = {}, logoHeader, logoFooter, links, withPopup = false }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <div
        style={{
          '--main-color': style.mainColor || '#000',
          '--second-color': style.secondColor || '#f5f5f5',
          '--background-color': style.backgroundColor || '#fff',
          '--text-color': style.textColor || '#000',
          '--lightening': style.lightening || 'rgba(0, 0, 0, 0.1)',
          '--text-opacity-grade': style.textOpacityGrade || '0.7'
        }}
      >
        <Header
          logoBackground={logoHeader}
          internalLinks={links}
          onRequestCallback={openPopup}
        />
        {children}
        <Footer
          logoFooter={logoFooter}
          links={links}
        />
        
        {/* Фиксированная кнопка */}
        <Button 
          type="fixed"
          onClick={openPopup}
          isFixed={true}
        >
          Обсудить мой проект
        </Button>

        {/* Модальное окно */}
        {withPopup && (
          <Popup
            isOpen={isPopupOpen}
            onClose={closePopup}
            title="Обсудить мой проект"
            subtitle="Заполните форму, чтобы обсудить ваш проект"
          />
        )}
      </div>
    </>
  );
} 