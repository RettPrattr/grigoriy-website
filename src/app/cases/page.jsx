import getContent from '@/utils/server/requests';
import { getCases, getCaseCategories } from '@/utils/server/api';
import BlockManager from '@/components/block-manager';

export default async function CasesPage() {
  try {
    const pageData = await getContent('cases-page', 'populate[blocks][populate]=*');
    const { cases } = await getCases({ limit: 100 });
    const categories = await getCaseCategories();

    // Прокидываем кейсы в blocks, если компонент нуждается
    const enhancedBlocks = pageData.blocks.map((block) => {
      if (block.__component === 'blocks.cases-block') {
        return { ...block, cases }; // 👈 добавляем кейсы внутрь пропов
      }
      return block;
    });

    return <BlockManager blocks={enhancedBlocks} categories={categories} />;
  } catch (error) {
    console.error('❌ Ошибка загрузки страницы кейсов:', error);
    return <p className="container">Ошибка загрузки страницы кейсов</p>;
  }
}
