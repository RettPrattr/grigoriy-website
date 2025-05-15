'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

import { getMediaUrl } from '@/utils/config'
import Button from '@/components/atoms/button'

import Burger from './burger'

export default function Header({
	logoBackground = null,
	internalLinks = [],
	onRequestCallback = null
}) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	
	// Извлечение URL из разных форматов данных Strapi
	let logoUrl = extractLogoUrl(logoBackground);
	
	// Безопасная обработка ссылок
	const links = Array.isArray(internalLinks) ? internalLinks : [];
	
	// Функция для переключения мобильного меню
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};
	
	return (
		<header className='sticky top-0 z-20 w-full bg-white text-black'>
			<div className='container mx-auto'>
				<div className='flex items-center justify-between py-4 md:py-6'>
					{/* Логотип */}
					<div className='flex items-center'>
						{logoUrl ? (
							<Link href='/'>
								<Image
									src={logoUrl}
									width={180}
									height={60}
									alt='Лого'
									className='h-10 w-[125px] md:max-w-[350px] w-auto object-contain md:h-12'
								/>
							</Link>
						) : (
							<Link href='/' className='text-xl font-bold'>
								Григорий
							</Link>
						)}
					</div>
					
					{/* Десктопное меню */}
					<nav className='hidden md:block'>
						<ul className='flex items-center space-x-8 transition-opacity duration-300 group'>
							{links.map((item, index) => {
								const linkText = item.text || item.name || '';
								const linkUrl = item.href || item.url || item.link || '/';
								
								return (
									<li key={index}>
										<Link href={linkUrl} className='transition-opacity duration-300 group-hover:opacity-60 hover:!opacity-100'>
											{linkText}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
					
					{/* Кнопка заявки (десктоп) */}
					<div className='hidden md:block'>
						<Button type="dark" onClick={onRequestCallback} className="">
							Заказать сайт
						</Button>
					</div>
					
					{/* Кнопка мобильного меню */}
					<div className='md:hidden'>
						<Burger className='z-30' />
					</div>
				</div>
				
				{/* Мобильное меню */}
				<div className='mobile-menu fixed left-0 top-0 z-20 h-screen w-full -translate-y-full transform bg-white p-6 transition-transform duration-300 ease-in-out md:hidden'>
					<div className='flex h-full flex-col'>
						<nav className='mt-16'>
							<ul className='flex flex-col space-y-6'>
								{links.map((item, index) => {
									const linkText = item.text || item.name || '';
									const linkUrl = item.href || item.url || item.link || '/';
									
									return (
										<li key={index}>
											<Link href={linkUrl} className='text-2xl font-medium'>
												{linkText}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
						
						<div className='mt-auto'>
							<Button type="dark" onClick={onRequestCallback} className="w-full py-5 px-12">
								Оставить заявку
							</Button>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

// Вспомогательная функция для извлечения URL логотипа из разных форматов данных
function extractLogoUrl(logoData) {
	if (!logoData) return null;
	
	let url = null;
	
	// Проверка всех возможных форматов Strapi
	if (logoData.data) {
		// Формат Strapi v4 с объектом data
		if (logoData.data.attributes?.url) {
			url = logoData.data.attributes.url;
		} 
		// Массив с данными
		else if (Array.isArray(logoData.data) && logoData.data[0]?.attributes?.url) {
			url = logoData.data[0].attributes.url;
		}
	} 
	// Прямой объект с URL
	else if (logoData.url) {
		url = logoData.url;
	}
	// Строка URL
	else if (typeof logoData === 'string') {
		url = logoData;
	}
	// Формат с attributes
	else if (logoData.attributes?.url) {
		url = logoData.attributes.url;
	}
	// Формат массива
	else if (Array.isArray(logoData) && logoData[0]?.url) {
		url = logoData[0].url;
	}
	
	// Если URL найден, получаем полный URL с медиа-сервера
	if (url) {
		try {
			return getMediaUrl(url);
		} catch (error) {
			console.error('Ошибка при обработке URL медиа:', error);
			return null;
		}
	}
	
	console.log('Не удалось извлечь URL логотипа:', logoData);
	return null;
}