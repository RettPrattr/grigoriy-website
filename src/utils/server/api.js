'use server';

import { cache } from 'react';
import { getConfig } from '../config';

// Получаем базовый URL для API
const API_URL = getConfig('API_URL');
console.log('📋 API_URL:', API_URL);

/**
 * Кешированная функция для получения кейса по slug
 * Использует React Cache для запоминания результатов
 */
import qs from 'qs';

export const getCaseBySlug = cache(async (slug) => {
  console.log('📋 Запрос кейса по slug:', slug);

  try {
    // Формируем query с безопасным deep populate
    const query = qs.stringify({
      filters: {
        slug: { $eq: slug },
      },
      populate: {
        categories: true,
        blocks: {
          populate: '*',
        },
      },
    }, { encodeValuesOnly: true });

    const url = `${API_URL}/api/cases?${query}`;
    console.log('📋 URL запроса к API:', url);

    const response = await fetch(
      url,
      {
        next: { revalidate: 3600 },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('📋 Статус ответа API:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка API:', response.status, errorText);
      throw new Error(`Failed to fetch case: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📋 Получены данные:', JSON.stringify(data, null, 2));

    if (!data.data || data.data.length === 0) {
      console.log('❌ Кейс не найден в ответе API');
      return null;
    }

    return data.data[0] || null;
  } catch (error) {
    console.error('❌ Ошибка при получении кейса:', error);
    return null;
  }
});


/**
 * Кешированная функция для получения списка кейсов
 * С возможностью фильтрации и ограничения
 */
export const getCases = cache(async ({ 
  limit = 100, 
  offset = 0, 
  excludeSlug = null,
  categoryId = null
}) => {
  console.log('📋 Параметры запроса кейсов:', { limit, offset, excludeSlug, categoryId });

  try {
    let filters = [];
    
    if (excludeSlug) {
      filters.push(`filters[slug][$ne]=${excludeSlug}`);
    }
    
    if (categoryId) {
      filters.push(`filters[categories][id][$eq]=${categoryId}`);
    }
    
    const populates = [
      'populate[categories]=true'
    ];
    
    const url = `${API_URL}/api/cases?${[
      `pagination[limit]=${limit}`,
      `pagination[start]=${offset}`,
      ...filters,
      ...populates,
      'sort[0]=createdAt:desc'
    ].join('&')}`;

    console.log('📋 URL запроса кейсов:', url);
    
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📋 Статус ответа API:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка API:', response.status, errorText);
      throw new Error(`Failed to fetch cases: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📋 Получены данные:', JSON.stringify(data, null, 2));
    
    return {
      cases: data.data || [],
      meta: data.meta || { pagination: { total: 0 } }
    };
  } catch (error) {
    console.error('❌ Ошибка при получении кейсов:', error);
    return { cases: [], meta: { pagination: { total: 0 } } };
  }
});

/**
 * Кешированная функция для получения категорий кейсов
 */
export const getCaseCategories = cache(async () => {
  console.log('📋 Запрос категорий');

  try {
    const url = `${API_URL}/api/categories?${[
      'pagination[limit]=100',
      'sort[0]=text:asc'  // Исправленный формат сортировки
    ].join('&')}`;

    console.log('📋 URL запроса категорий:', url);
    
    const response = await fetch(url, { 
      next: { revalidate: 86400 },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📋 Статус ответа API:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка API:', response.status, errorText);
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📋 Получены данные:', JSON.stringify(data, null, 2));
    
    return data.data || [];
  } catch (error) {
    console.error('❌ Ошибка при получении категорий:', error);
    return [];
  }
});

/**
 * Получение полных данных всех кейсов и категорий (для страницы кейсов)
 */
export const getCasesAndCategories = cache(async (options = {}) => {
  console.log('📋 Запрос кейсов и категорий с параметрами:', options);

  try {
    // Параллельно запрашиваем кейсы и категории
    const [casesData, categoriesData] = await Promise.all([
      getCases(options),
      getCaseCategories()
    ]);
    
    console.log('📋 Результаты запроса:', {
      casesCount: casesData.cases?.length || 0,
      categoriesCount: categoriesData?.length || 0
    });
    
    return {
      cases: casesData.cases || [],
      categories: categoriesData || []
    };
  } catch (error) {
    console.error('❌ Ошибка при получении кейсов и категорий:', error);
    return { 
      cases: [],
      categories: []
    };
  }
}); 