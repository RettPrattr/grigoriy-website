/**
 * Базовый URL для Strapi API
 */
export const api = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.API_LINK || 'http://localhost:1337';

/**
 * Настройки для запросов к API
 */
export const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  next: { revalidate: 60 } // Кэшировать данные на 60 секунд
};

/**
 * Время обновления кеша страниц (в секундах)
 */
export const revalidateTime = 60;

/**
 * Возвращает конфигурационные значения по ключу
 * @param {string} key - ключ конфигурации
 * @returns {string} - значение конфигурации
 */
export function getConfig(key) {
  const configs = {
    API_URL: api, // Используем переменную api в качестве API_URL
    REVALIDATE_TIME: 3600,
    API_LINK: process.env.API_LINK || api,
    MEDIA_URL: api
  };
  
  if (!configs[key]) {
    console.error(`❌ Конфигурация для ключа "${key}" не найдена`);
    // Возвращаем значение по умолчанию, чтобы избежать ошибок
    return api;
  }
  
  return configs[key];
}

/**
 * Формирует URL для медиа-файлов из Strapi
 * @param {string} url - относительный путь к файлу
 * @returns {string} - полный URL
 */
export const getMediaUrl = (url) => {
  // Проверяем, что URL существует
  if (!url) {
    throw new Error('URL изображения отсутствует');
  }
  
  // Если это уже полный URL, просто возвращаем его
  if (url.startsWith('http')) return url;
  
  // Если это относительный путь в /public директории
  if (url.startsWith('/')) {
    // Если это изображение из Strapi, добавляем хост
    if (url.includes('/uploads/')) {
      return `${api}${url}`;
    }
    
    // Иначе это статичное изображение из /public
    return url;
  }
  
  // Если это путь без слеша в начале, добавляем API URL
  return `${api}/uploads/${url}`;
};
