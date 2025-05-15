'use client';

import { useState, useEffect } from 'react';
import '@/styles/rich-text.css';

/**
 * Утилита для обработки richText из Strapi и подготовки к безопасному отображению
 * в React-компонентах с использованием dangerouslySetInnerHTML
 */

/**
 * Преобразует richText из Strapi в HTML-строку
 * @param {any} content - содержимое richText (объект, массив или строка)
 * @returns {string} - HTML-строка для использования в dangerouslySetInnerHTML
 */
export function renderRichText(content) {
  if (!content) return '';
  
  // Если это строка, возвращаем как есть
  if (typeof content === 'string') return content;
  
  // Если это массив (формат richText из Strapi)
  if (Array.isArray(content)) {
    return content.map((block, index) => {
      // Проверка типа блока и его содержимого
      if (block.type === 'paragraph') {
        return `<p class="rich-text-p">${block.children?.map(child => renderTextWithStyle(child)).join('') || ''}</p>`;
      } else if (block.type === 'heading') {
        const text = block.children?.map(child => renderTextWithStyle(child)).join('') || '';
        return `<h${block.level} class="rich-text-h${block.level}">${text}</h${block.level}>`;
      } else if (block.type === 'list') {
        const listTag = block.format === 'ordered' ? 'ol' : 'ul';
        const listItems = block.children?.map(item => {
          if (item.type === 'list-item') {
            const itemText = item.children?.map(child => renderTextWithStyle(child)).join('') || '';
            return `<li class="rich-text-li">${itemText}</li>`;
          }
          return '';
        }).join('') || '';
        
        return `<${listTag} class="rich-text-list">${listItems}</${listTag}>`;
      } else if (block.type === 'quote') {
        const text = block.children?.map(child => renderTextWithStyle(child)).join('') || '';
        return `<blockquote class="rich-text-quote">${text}</blockquote>`;
      } else if (block.type === 'code') {
        const codeContent = block.children?.map(child => child.text).join('') || '';
        return `<pre class="rich-text-pre"><code class="rich-text-code">${codeContent}</code></pre>`;
      }
      return '';
    }).join('');
  }
  
  // Если это объект с children (возможный вариант)
  if (content.children) {
    return content.children.map(child => renderTextWithStyle(child)).join('');
  }
  
  // Если это объект с прямым текстом (еще один вариант)
  if (content.text) {
    return renderTextWithStyle(content);
  }
  
  // Для старого формата Strapi (v3)
  if (content.data && content.data.content) {
    return content.data.content;
  }
  
  // Для формата со свойством data
  if (content.data && typeof content.data === 'string') {
    return content.data;
  }
  
  // Если это объект с Markdown-разметкой
  if (content.markdown) {
    return content.markdown;
  }
  
  // Для других форматов - просто преобразуем в строку, но сначала логируем для отладки
  console.log('Неизвестный формат richText:', content);
  try {
    return JSON.stringify(content);
  } catch (e) {
    console.error('Ошибка при преобразовании richText в строку:', e);
    return 'Ошибка отображения текста';
  }
}

/**
 * Обрабатывает текстовый узел с учетом стилей (bold, italic, etc.)
 * @param {Object} node - узел текста
 * @returns {string} - HTML с примененными стилями
 */
function renderTextWithStyle(node) {
  if (!node || !node.text) return '';
  
  let text = node.text;
  
  // Применяем стили к тексту
  if (node.bold) {
    text = `<strong class="rich-text-bold">${text}</strong>`;
  }
  
  if (node.italic) {
    text = `<em class="rich-text-italic">${text}</em>`;
  }
  
  if (node.underline) {
    text = `<u class="rich-text-underline">${text}</u>`;
  }
  
  if (node.strikethrough) {
    text = `<s class="rich-text-strikethrough">${text}</s>`;
  }
  
  if (node.code) {
    text = `<code class="rich-text-inline-code">${text}</code>`;
  }
  
  // Если есть URL, создаем ссылку
  if (node.url) {
    text = `<a href="${node.url}" class="rich-text-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
  
  return text;
}

/**
 * Применяет обертку ко всем элементам HTML для обеспечения правильного шрифта
 * @param {string} html - HTML-строка
 * @returns {string} - Обработанная HTML-строка
 */
function wrapWithFontStyles(html) {
  return `<div style="font-family: var(--font-hn, 'Helvetica Neue', sans-serif) !important; font-weight: 400 !important;" class="rich-text-wrapper">
    ${html}
  </div>`;
}

/**
 * React-компонент для отображения richText
 * @param {Object} props - свойства компонента
 * @param {any} props.content - содержимое richText
 * @param {string} props.className - дополнительные CSS-классы
 * @param {string} props.as - HTML-тег, который будет использоваться (div, span и т.д.)
 * @returns {JSX.Element} - React-компонент
 */
export function RichText({ content, className = '', as = 'div' }) {
  const [isClient, setIsClient] = useState(false);
  const [html, setHtml] = useState('');
  
  // Переносим обработку контента на клиентскую сторону
  useEffect(() => {
    setIsClient(true);
    
    try {
      let renderedHtml = renderRichText(content);
      // Оборачиваем весь контент стилями шрифта
      renderedHtml = wrapWithFontStyles(renderedHtml);
      setHtml(renderedHtml);
    } catch (e) {
      console.error('Ошибка при обработке richText:', e);
      setHtml('<p>Ошибка отображения текста</p>');
    }
  }, [content]);
  
  if (!content) return null;
  if (!isClient) return null; // Не рендерим ничего на сервере

  // Стили по умолчанию для компонента с более прямым указанием шрифта
  const defaultClass = 'helvetica-text rich-text-content';
  const combinedClassName = `${defaultClass} ${className}`.trim();
  
  // Определяем, какой HTML-тег использовать
  const Component = as || 'div';
  
  // Добавляем инлайн-стили напрямую
  const inlineStyle = {
    fontFamily: 'var(--font-hn, "Helvetica Neue", sans-serif) !important',
    fontWeight: '400 !important',
    "--internal-font": 'var(--font-hn, "Helvetica Neue", sans-serif)',
    "--internal-weight": '400',
    // Принудительное применение шрифта
    "--forced-font": 'var(--font-hn, "Helvetica Neue", sans-serif)',
    "--forced-weight": '400',
    // Дополнительные стили для всех дочерних элементов
    "& *": {
      fontFamily: 'var(--font-hn, "Helvetica Neue", sans-serif) !important',
      fontWeight: '400 !important',
    }
  };
  
  // Используем suppressHydrationWarning для предотвращения ошибок гидратации
  // и рендерим только на клиенте
  return (
    <Component 
      className={combinedClassName} 
      style={inlineStyle}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
} 