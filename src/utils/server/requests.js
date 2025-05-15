/**
 * Fetches data from Strapi.
 *
 * @param {string} path - API ID for the collection or single type.
 * @param {string} [params] - request parameters.
 * @param {object} [next] - Next fetch parameters for the request.
 * @returns {object|null} promise that resolves to the fetched data or null if an error occurs.
 */

export default async function getContent(
	path = '',
	params = '',
	next = {}
) {
	try {
		// URL для Strapi API
		const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
		const apiPrefix = 'api';

		// Структура Strapi может отличаться, адаптируем пути под реальную структуру
		let actualPath = path;
		let actualParams = params;

		// Маппинг путей между ожидаемой и фактической структурой
		// Адаптация под реальную структуру Strapi
		switch (path) {
			case 'setting':
				actualPath = 'layout'; 
				// Если параметр populate не указан, добавляем параметр для style
				if (!params.includes('populate=')) {
					actualParams = 'populate=style';
				}
				break;
			case 'layout': 
				actualPath = 'layout'; 
				// Если параметр populate не указан, добавляем необходимые параметры
				if (!params.includes('populate=')) {
					actualParams = 'populate=*';
				}
				break;
			case 'index':
				actualPath = 'main-page';
				// Параметр populate для получения блоков
				if (!params.includes('populate=')) {
					actualParams = 'populate=blocks';
				}
				break;
			case 'cases':
				// Используем коллекцию case для получения кейсов
				actualPath = 'case';
				if (!params.includes('populate=')) {
					actualParams = 'populate=*';
				}
				break;
			case 'about':
				actualPath = 'about-page';
				if (!params.includes('populate=')) {
					actualParams = 'populate=*';
				}
				break;
			default:
				// Без изменений
		}

		// Исправляем форматирование параметров сортировки, если они есть
		if (actualParams.includes('sort=')) {
			actualParams = actualParams.replace(/sort=([^&]+)/g, 'sort[0]=$1');
		}

		// Формируем URL с учетом параметров
		const url = `${apiUrl}/${apiPrefix}/${actualPath}${actualParams ? `?${actualParams}` : ''}`;
		
		// Подготавливаем опции запроса
		const fetchOptions = {
			headers: {
				'Content-Type': 'application/json'
			},
			next: {
				revalidate: 1, // Кешируем данные на 1 секунду
				...next
			}
		};
		
		// Выполняем запрос
		const req = await fetch(url, fetchOptions);

		// Проверяем статус ответа
		if (!req.ok) {
			console.error(`Ошибка запроса к API (${req.status}): ${req.statusText}`);
			throw new Error(`Ошибка запроса: ${req.status} ${req.statusText}`);
		}

		// Парсим JSON
		const res = await req.json();
		
		// Адаптируем ответ к ожидаемой структуре
		const adaptedData = adaptResponseData(path, res);
		return adaptedData;
	} catch (error) {
		console.error('Ошибка API запроса:', error.message);
		throw error; // Передаем ошибку дальше
	}
}

/**
 * Адаптация данных от Strapi к ожидаемой структуре
 */
function adaptResponseData(originalPath, data) {
	if (!data) {
		throw new Error('Нет данных в ответе API');
	}

	// Извлекаем данные из обертки Strapi API v4
	const extractData = (input) => {
		if (input && input.data) {
			// Поддержка формата Strapi v4
			if (input.data.attributes) {
				return { ...input.data.attributes, id: input.data.id };
			}
			// Массив данных
			if (Array.isArray(input.data)) {
				return input.data.map(item => 
					item.attributes ? { ...item.attributes, id: item.id } : item
				);
			}
			return input.data;
		}
		return input;
	};

	const extractedData = extractData(data);

	switch (originalPath) {
		case 'layout':
			// Для Strapi получаем actual layout данные
			// Если в Strapi нет необходимых данных, это должно быть исправлено там
			return extractedData;
		
		case 'index':
			// Для main-page извлекаем блоки
			if (!extractedData.blocks) {
				throw new Error('Блоки не найдены в данных main-page');
			}
			return {
				blocks: extractedData.blocks
			};

		case 'about':
			// Для about-page извлекаем блоки
			if (!extractedData.blocks) {
				throw new Error('Блоки не найдены в данных about-page');
			}
			return {
				blocks: extractedData.blocks
			};

		case 'setting':
			// Настройки
			return extractedData;
			
		default:
			// Возвращаем данные как есть
			return extractedData;
	}
}
