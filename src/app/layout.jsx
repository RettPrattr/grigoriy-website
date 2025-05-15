import '@/styles/global.css'
import '@/styles/utils.css'
import '@/styles/rich-text.css'

// eslint-disable-next-line camelcase

import { revalidateTime } from '@/utils/config'

import localFont from 'next/font/local'


import Header from '@/components/layout/header'
import getContent from '@/utils/server/requests'
import Footer from '@/components/layout/footer'
import ClientLayout from '@/components/layout/client-layout'

// Подключаем локальный шрифт Helvetica Neue
export const helveticaNeue = localFont({
	src: [
		{
			path: '../fonts/HelveticaNeue-Medium.woff2',
			weight: '400',
			style: 'normal'
		}
	],
	variable: '--font-hn'
})

// Вспомогательные функции для извлечения данных из разных структур Strapi

// Получение логотипа для шапки
function getLogoFromLayout(data) {
	if (!data) return null;
	
	// Проверка всех возможных структур данных
	if (data.data?.attributes?.logoHeader) {
		return data.data.attributes.logoHeader;
	}
	
	if (data.attributes?.logoHeader) {
		return data.attributes.logoHeader;
	}
	
	if (data.logoHeader) {
		return data.logoHeader;
	}
	
	// Fallback для logo вместо logoHeader
	if (data.data?.attributes?.logo) {
		return data.data.attributes.logo;
	}
	
	if (data.attributes?.logo) {
		return data.attributes.logo;
	}
	
	if (data.logo) {
		return data.logo;
	}
	
	return null;
}

// Получение логотипа для футера
function getFooterLogoFromLayout(data) {
	if (!data) return null;
	
	// Проверка всех возможных структур данных
	if (data.data?.attributes?.logoFooter) {
		return data.data.attributes.logoFooter;
	}
	
	if (data.attributes?.logoFooter) {
		return data.attributes.logoFooter;
	}
	
	if (data.logoFooter) {
		return data.logoFooter;
	}
	
	return null;
}

// Получение навигационных ссылок
function getLinksFromLayout(data) {
	if (!data) return null;
	
	// Проверка всех возможных структур данных
	if (data.data?.attributes?.links && Array.isArray(data.data.attributes.links)) {
		return data.data.attributes.links;
	}
	
	if (data.attributes?.links && Array.isArray(data.attributes.links)) {
		return data.attributes.links;
	}
	
	if (data.links && Array.isArray(data.links)) {
		return data.links;
	}
	
	// Проверка меню вместо links
	if (data.data?.attributes?.menu && Array.isArray(data.data.attributes.menu)) {
		return data.data.attributes.menu;
	}
	
	if (data.attributes?.menu && Array.isArray(data.attributes.menu)) {
		return data.attributes.menu;
	}
	
	if (data.menu && Array.isArray(data.menu)) {
		return data.menu;
	}
	
	return null;
}

export const revalidate = revalidateTime

export const metadata = {
	title: 'Grigoriy Website',
	description: 'Personal website',
}

export default async function RootLayout({ children }) {
	// Загружаем данные из Strapi
	const layoutResult = await getContent('layout', 'populate=*');
	const settingsResult = await getContent('setting', 'populate=*');
	
	// Если данных нет, создаем дефолтные ссылки для корректной работы
	const defaultLinks = [
		{ text: 'Главная', href: '/' },
		{ text: 'Кейсы', href: '/cases' },
		{ text: 'Обо мне', href: '/about' },
	];

	// Деструктурируем данные для стилей
	const { style = {} } = settingsResult || {};
	
	// Прямое получение logo и links из layoutResult, простой подход без множества проверок
	const logoHeader = getLogoFromLayout(layoutResult);
	const logoFooter = getFooterLogoFromLayout(layoutResult);
	const links = getLinksFromLayout(layoutResult) || defaultLinks;

	return (
		<html lang='ru'>
			<body className={`mx-auto min-w-80 ${helveticaNeue.variable}`}>
				<ClientLayout 
					style={style}
					logoHeader={logoHeader}
					logoFooter={logoFooter}
					links={links}
					withPopup={true}
				>
					{children}
				</ClientLayout>
			</body>
		</html>
	)
}