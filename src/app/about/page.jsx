import BlockManager from '@/components/block-manager'
import getContent from '@/utils/server/requests'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'О компании | Наш сайт',
  description: 'Узнайте больше о нашей компании, нашей команде и наших ценностях'
};

export default async function AboutPage() {
  try {
    // Получаем данные из Strapi
    const data = await getContent('about', 'populate=blocks');
    console.log('Данные страницы о компании:', data);

    // Проверка на наличие блоков
    if (!data?.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) {
      console.error('Блоки не найдены в данных about-page');
      notFound(); // Используем 404 страницу
    }
    
    return (
      <main>
        <div className="container mx-auto">
          <BlockManager blocks={data.blocks} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Ошибка загрузки страницы о компании:', error);
    throw error; // Передаем ошибку Next.js для обработки
  }
}
