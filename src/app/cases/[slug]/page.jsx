import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCaseBySlug, getCases, getCaseCategories } from '@/utils/server/api';
import BlockManager from '@/components/block-manager';
// import CasesBlock from '@/components/blocks/cases-block'; // если включишь потом

export async function generateStaticParams() {
  try {
    const { cases } = await getCases({ limit: 100 });
    console.log('✅ generateStaticParams - получены кейсы:', cases.map(c => c.slug));

    return cases.map((caseItem) => ({
      slug: caseItem.slug
    }));
  } catch (error) {
    console.error('❌ Ошибка в generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const caseData = await getCaseBySlug(params.slug);
    if (!caseData) {
      return {
        title: 'Кейс не найден',
        description: 'Запрашиваемый кейс не существует'
      };
    }
    return {
      title: `${caseData.title} | Кейс`,
      description: caseData.shortDescription || caseData.title
    };
  } catch (error) {
    console.error('❌ Ошибка в generateMetadata:', error);
    return {
      title: 'Ошибка загрузки кейса',
      description: 'Произошла ошибка при загрузке данных кейса'
    };
  }
}

export default async function CasePage({ params }) {
  console.log('📌 Параметры страницы:', params);

  try {
    const caseData = await getCaseBySlug(params.slug);
    console.log('📦 Данные кейса:', caseData);

    if (!caseData) {
      console.warn(`⚠️ Кейс не найден: ${params.slug}`);
      notFound();
    }

    const categories = await getCaseCategories();
    const { cases } = await getCases({ 
      limit: 3,
      excludeSlug: params.slug
    });

    return (
      <main>
        {/* <section className="margin-x padding-y">
          <div className="container">
            <Link 
              href="/cases"
              className="inline-flex items-center text-[var(--main-color)] mb-4 hover:-translate-x-1 transition-transform"
            >
              <svg className="mr-2 w-4 h-4 rotate-180" viewBox="0 0 24 24">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Назад к проектам
            </Link>

            <h1 className="text-[--h1] mb-4">{caseData.title}</h1>

            {caseData.shortDescription && (
              <p className="text-[--p] opacity-80 max-w-3xl">
                {caseData.shortDescription}
              </p>
            )}
          </div>
        </section> */}

        {caseData.blocks && (
          <BlockManager 
            blocks={caseData.blocks} 
            categories={caseData.categories?.data || categories}
          />
        )}

        {/* Если нужно — раскомментируй ниже */}
        {/* <CasesBlock
          title="Похожие проекты"
          cases={cases}
          categories={categories}
          fetchData={false}
          excludeId={caseData.id}
          limit={3}
        /> */}
      </main>
    );
  } catch (error) {
    console.error('❌ Ошибка в CasePage:', error);
    return (
      <main className="margin-x padding-y">
        <div className="container">
          <h1 className="text-[--h1] mb-4">Ошибка загрузки</h1>
          <p className="text-[--p]">Произошла ошибка при загрузке данных кейса.</p>
          <Link 
            href="/cases"
            className="inline-flex items-center text-[var(--main-color)] mt-4 hover:-translate-x-1 transition-transform"
          >
            Вернуться к списку проектов
          </Link>
        </div>
      </main>
    );
  }
}
