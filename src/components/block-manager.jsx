'use client';

import HeroBlock from './blocks/hero-block';
import AboutProjectBlock from './blocks/about-project-block';
import AboutBlock from './blocks/about-block';
import TextBlock from './blocks/text-block';
import ImageBlock from './blocks/image-block';
import ItemsBlock from './blocks/items-block';
import StagesBlock from './blocks/stages-block';
import ResearchBlock from './blocks/research-block';
import FormBlock from './blocks/form-block';
import CasesBlock from './blocks/cases-block';


export default function BlockManager({ blocks, categories = [] }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks.map((block, index) => {
    console.log(`📦 Рендер блока: ${block.__component}`, block);

    switch (block.__component) {
      case 'blocks.hero-block':
        return (
          <HeroBlock
            key={index}
            title={block.title}
            subtitle={block.subtitle}
            video={block.video}
            image={block.image}
            direction={block.direction}
            tags={
              Array.isArray(categories) && categories.length > 0 
                ? categories.map(cat => cat.text || cat.attributes?.name || cat.attributes?.text)
                : (Array.isArray(block.tags) ? block.tags : [])
            }
            mediaType={block.image ? 'image' : 'video'}
          />
        );

      case 'cases.about-project':
        return (
          <AboutProjectBlock
            key={index}
            title={block.title}
            description={block.description}
            image={block.image}
          />
        );

      case 'cases.about-block':
        return (
          <AboutBlock
            key={index}
            title={block.title}
            description={block.description}
            image={block.image}
          />
        );

      case 'cases.textBlock':
        return (
          <TextBlock
            key={index}
            title={block.title}
            description={block.description}
          />
        );

      case 'cases.image':
        return (
          <ImageBlock
            key={index}
            image={block.image100}
          />
        );

      case 'cases.items':
        return (
          <ItemsBlock
            key={index}
            title={block.title}
            items={block.item}
          />
        );

      case 'cases.stages':
        return (
          <StagesBlock
            key={index}
            title={block.title}
            stages={block.stageItem || block.stages || []}
          />
        );

      case 'cases.research':
        return (
          <ResearchBlock
            key={index}
            title={block.title}
            subtitle1={block.subtitle1}
            subtitle2={block.subtitle2}
            description1={block.description1}
            description2={block.description2}
            image1={block.image1}
            image2={block.image2}
            image3={block.image3}
          />
        );

      case 'blocks.form':
        return (
          <FormBlock
            key={index}
            title={block.title}
            description={block.description}
          />
        );

      case 'blocks.cases-block':
      case 'cases.cases-block':
        return (
          <CasesBlock
            key={index}
            title={block.title}
            cases={block.cases}
            categories={block.categories}
            limit={block.limit}
          />
        );

      default:
        console.warn(`❌ Неизвестный тип блока: ${block.__component}`, block);
        return null;
    }
  });
}
