import BlockManager from '@/components/block-manager'
import getContent from '@/utils/server/requests'
import { notFound } from 'next/navigation'
import { getCaseCategories } from '@/utils/server/api'

export default async function HomePage() {
	try {
		// Получаем данные из Strapi
		const data = await getContent('index', 'populate=blocks');
		console.log('Данные главной страницы:', data);

		// Получаем категории для тегов
		const categories = await getCaseCategories();

		// Проверка на наличие блоков
		if (!data?.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) {
			console.error('Блоки не найдены в данных');
			notFound(); // Используем 404 страницу
		}
		
		return <BlockManager blocks={data.blocks} categories={categories} />;
	} catch (error) {
		console.error('Ошибка загрузки главной страницы:', error);
		throw error; // Передаем ошибку Next.js для обработки
	}
}