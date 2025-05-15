// Импортируем необходимые утилиты
import { api, fetchConfig } from './config';
import getContent from './server/requests';

/**
 * Получение данных о компании
 * @returns {Promise<Object>} Данные о компании
 */
export async function getAboutData() {
  try {
    const data = await getContent('about', 'populate=*');
    return data;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

/**
 * Получение кейсов и категорий
 * @returns {Promise<Object>} Объект с кейсами и категориями
 */
export async function getCasesAndCategories() {
  try {
    // Запрашиваем кейсы и категории с исправленным форматом параметров
    const casesData = await getContent('cases', 'populate[thumbnail]=true&populate[categories]=true&pagination[limit]=100&sort[0]=createdAt:desc');
    const categoriesData = await getContent('categories', 'pagination[limit]=100&sort[0]=name:asc');
    
    return {
      cases: { data: casesData, meta: { pagination: { total: casesData?.length || 0 } } },
      categories: categoriesData
    };
  } catch (error) {
    console.error('Error fetching cases and categories:', error);
    return { 
      cases: { data: [], meta: { pagination: { total: 0 } } },
      categories: { data: [] }
    };
  }
}

/**
 * Функция для работы с изображениями
 * @param {Object} image - Объект изображения из Strapi
 * @returns {string} - URL изображения
 */
export function getImageUrl(image) {
  if (!image || !image.data || !image.data.attributes) {
    return '/placeholder.jpg';
  }
  
  // Добавляем базовый URL API для изображений из Strapi
  const url = image.data.attributes.url;
  return url.startsWith('http') ? url : `${api}${url}`;
}

/**
 * Адаптер данных для компонента (преобразует данные из Strapi-формата в формат пропсов компонента)
 * @param {Object} data - Данные из API
 * @returns {Object} - Данные в формате пропсов компонента
 */
export function adaptAboutData(data) {
  if (!data || !data.attributes) {
    return {};
  }
  
  const { attributes } = data;
  
  return {
    title: attributes.title || '',
    description: attributes.description || '',
    buttonText: attributes.buttonText || 'Узнать больше',
    buttonLink: attributes.buttonLink || '/about',
    image: attributes.image || null,
    socialLinks: attributes.socialLinks || [],
    reverse: attributes.reverse || false
  };
} 