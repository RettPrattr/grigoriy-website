'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CasesBlock({
  title = 'Наши проекты',
  cases = null,
  categories = null,
  excludeId = null,
  limit = null,
  fetchData = true
}) {
  const [loadedCases, setLoadedCases] = useState(cases);
  const [loadedCategories, setLoadedCategories] = useState(categories);
  const [loading, setLoading] = useState(!cases || !categories);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (fetchData && (!loadedCases || !loadedCategories)) {
      async function fetchCasesAndCategories() {
        try {
          const { getCasesAndCategories } = await import('@/utils/api');
          const { cases, categories } = await getCasesAndCategories();
          setLoadedCases(cases.data || []);
          setLoadedCategories(categories.data || []);
          setLoading(false);
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
          setLoading(false);
        }
      }

      fetchCasesAndCategories();
    }
  }, [fetchData, loadedCases, loadedCategories]);

  const casesData = cases || loadedCases || [];
  const categoriesData = categories || loadedCategories || [];

  const filters = useMemo(() => {
    return [
      { id: 'all', name: 'Все проекты' },
      ...categoriesData.map(category => ({
        id: category.id,
        name: category.text || category.attributes?.name
      }))
    ];
  }, [categoriesData]);

  const filteredCases = useMemo(() => {
    if (!casesData || loading) return [];
    let filtered = [...casesData];

    if (excludeId) {
      filtered = filtered.filter(item => item.id !== excludeId);
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item =>
        (item.categories || item.attributes?.categories?.data)?.some(
          cat => cat.id === activeFilter
        )
      );
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [casesData, activeFilter, excludeId, limit, loading]);

  const getCategoryNames = (caseItem) => {
    const cats = caseItem.categories || caseItem.attributes?.categories?.data || [];
    return cats.map(cat => cat.text || cat.attributes?.name).filter(Boolean);
  };

  return (
    <section className="w-full">
      <div className="w-full">
        {/* Заголовок */}
        <h2 className="text-[--h2] mb-6 md:mb-10">{title}</h2>

        {/* Фильтры */}
        <div className="flex flex-wrap justify-start gap-3 mb-10">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                transition-all text-base font-medium 
                ${activeFilter === filter.id
                  ? 'bg-black text-white rounded-full px-7 py-3 hover:bg-[#A3CD39] hover:text-black'
                  : 'bg-white text-black border border-gray-300 rounded-full px-7 py-3 hover:bg-[#A3CD39] hover:text-black'}
              `}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Сетка кейсов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {filteredCases.map(project => {
            const title = project.title || project.attributes?.title || '';
            const slug = project.slug || project.attributes?.slug || '';
            const imageUrl =
              project.thumbnail?.url || project.attributes?.thumbnail?.data?.attributes?.url || '';
            const description =
              project.description || project.attributes?.description || [];

            return (
              <Link
                key={project.id}
                href={`/cases/${slug}`}
                className="relative block w-full group"
              >
                {/* Категории на картинке */}
                <div className="absolute top-4 left-4 z-10 max-w-[40%] flex flex-wrap gap-2">
                  {getCategoryNames(project).map((name, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/10 border border-gray-400 text-white text-base font-medium backdrop-blur-sm"
                      style={{ borderRadius: '6px' }}
                    >
                      {name}
                    </span>
                  ))}
                </div>

                {/* Картинка */}
                <div className="aspect-[3/2] relative w-full">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full" />
                  )}
                </div>

                {/* Текст */}
                <div className="bg-white px-4 py-5 text-black">
                  <h4 className="text-[28px] font-semibold mb-2">{title}</h4>
                  {Array.isArray(description) && (
                    <p
                      className="text-[15px] opacity-80"
                      dangerouslySetInnerHTML={{
                        __html: description
                          .map(block => block.children?.map(child => child.text).join(''))
                          .join('<br/>')
                      }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
