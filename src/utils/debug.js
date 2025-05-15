/**
 * Debug utilities for API and data handling
 * Логирование отключено для чистой консоли
 */

/**
 * Logs API request details for debugging (disabled)
 */
export function logApiRequest() {
  // Функция отключена
}

/**
 * Logs API response for debugging (disabled)
 */
export async function logApiResponse() {
  // Функция отключена
}

/**
 * Logs API error for debugging (disabled)
 */
export function logApiError() {
  // Функция отключена
}

/**
 * Creates a simplified preview of data for logging (disabled)
 */
function getDataPreview() {
  // Функция отключена
  return null;
}

/**
 * Test all API endpoints to verify connectivity (disabled)
 */
export async function testApiEndpoints() {
  // Функция отключена
}

/**
 * Проверка CORS настроек
 */
export async function testCORS() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const endpoints = [
    { path: 'api/main-page', params: '?populate=*' }
  ];
  
  console.log('🔄 Тестирование CORS...');
  
  for (const endpoint of endpoints) {
    const url = `${apiUrl}/${endpoint.path}${endpoint.params || ''}`;
    try {
      // Добавляем origin заголовок для проверки CORS
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      
      console.log(`CORS для ${endpoint.path}:`);
      console.log(` - Status: ${response.status} ${response.statusText}`);
      console.log(` - Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
      console.log(` - Access-Control-Allow-Credentials: ${response.headers.get('Access-Control-Allow-Credentials')}`);
      
      if (response.ok) {
        console.log(' - Данные получены успешно');
      } else {
        console.log(' - Ошибка получения данных');
      }
    } catch (error) {
      console.error(`${endpoint.path}: Ошибка - ${error.message}`);
    }
  }
  
  console.log('🔄 Тестирование CORS завершено');
} 