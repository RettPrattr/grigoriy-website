import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/utils/config'

export default function Footer({ logoFooter, links }) {
	// Безопасная обработка пропсов
	const logoUrl = logoFooter?.data?.attributes?.url || logoFooter?.url || null;
	const safeLinks = Array.isArray(links) ? links : [];

	return (
		<footer className=''>
			<div className='container padding-y'>
				<div className='flex flex-col md:flex-row md:justify-between items-center md:items-start'>
					{logoUrl && (
						<div className='md:w-1/2 flex justify-center md:justify-start mb-8 md:mb-0'>
							<Image
								src={getMediaUrl(logoUrl)}
								width={300}
								height={300}
								alt=''
								className='h-auto w-1/2 object-contain md:w-2/5'
							/>
						</div>
					)}

					<div className='md:w-1/2 flex flex-col space-y-6 items-center md:items-end group'>
						{safeLinks.map((item) => {
							// Обрабатываем как старый (link/text), так и новый (href/text) формат
							const linkText = item.text || '';
							const linkUrl = item.href || item.link || '#';

							return (
								<Link
									href={linkUrl}
									key={linkText + linkUrl}
									className='transition-opacity duration-300 group-hover:opacity-60 hover:!opacity-100'>
									{linkText}
								</Link>
							);
						})}
						<Link
							href="/privacy-policy"
							className="text-sm transition-opacity duration-300 group-hover:opacity-60 hover:!opacity-100"
						>
							Политика конфиденциальности
						</Link>

					</div>
				</div>
			</div>
		</footer>
	)
}