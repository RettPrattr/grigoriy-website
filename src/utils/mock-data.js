/**
 * Моковые данные для разных частей сайта
 * Используются, когда API недоступно или возвращает ошибку
 */

/**
 * Моковые данные для лейаута сайта
 */
export const mockLayout = {
  logoHeader: { 
    data: { 
      attributes: { 
        url: '/images/logo.svg' // Заменяем на статичное изображение из папки public
      } 
    } 
  },
  logoFooter: null,
  links: [
    { text: 'Главная', href: '/' },
    { text: 'Кейсы', href: '/cases' },
    { text: 'Обо мне', href: '/about' }
  ]
};

/**
 * Моковые данные для главной страницы
 */
export const mockHome = {
  blocks: [
    {
      __component: 'blocks.hero-block',
      id: 1,
      title: 'Студия Григория Белотелова',
      description: [
        {
          type: 'paragraph',
          children: [
            {
              text: '<h2>Приводим клиентов с помощью сайтов,<br /> айдентики и маркетинга</h2>',
              type: 'text',
              code: true
            }
          ]
        }
      ],
      direction: null
    },
    {
      __component: 'blocks.cases-block',
      id: 2,
      title: 'Мои работы'
    }
  ]
};

/**
 * Моковые данные для страницы кейсов
 */
export const mockCases = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'Демо кейс 1',
        slug: 'demo-case-1',
        description: 'Короткое описание кейса 1',
        createdAt: new Date().toISOString()
      }
    },
    {
      id: 2,
      attributes: {
        title: 'Демо кейс 2',
        slug: 'demo-case-2',
        description: 'Короткое описание кейса 2',
        createdAt: new Date().toISOString()
      }
    }
  ]
};

/**
 * Моковые данные для отдельного кейса
 */
export const mockCase = {
  id: 1,
  title: 'Демо кейс',
  description: 'Это демонстрационный кейс.',
  content: 'Подробное описание демонстрационного кейса.'
};

/**
 * Моковые данные для настроек сайта
 */
export const mockSettings = {
  style: {
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    textColor: '#333333',
    backgroundColor: '#ffffff'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  }
}; 