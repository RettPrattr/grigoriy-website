'use client';

import { getMediaUrl } from '@/utils/config'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function FormBlock({
	title = '',
	description = '',
	image = null
}) {
	const [isClient, setIsClient] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		message: ''
	});

	// Устанавливаем флаг клиентского рендеринга
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Обработчик изменений в форме
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	// Обработчик отправки формы
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Отправка формы:', formData);
		// Здесь можно добавить реальную отправку данных на сервер
		// например, через fetch API
	};

	// Подготовка URL изображения
	const imageUrl = image && image.data && image.data.attributes
		? getMediaUrl(image.data.attributes.url)
		: null;

	return (
		<section id='form' className='bg-black'>
			<div className='container padding-y'>
				<div className='flex flex-col items-center md:flex-row'>
					<div className='flex flex-col md:w-1/2'>
						<h2
							className='text-white text-4xl mb-3'
							dangerouslySetInnerHTML={{ __html: title }}
						/>
						<p className='text-white'>{description}</p>
					</div>
					{isClient && (
						<form
							className='flex flex-col mt-8 md:mt-0 md:w-1/2'
							onSubmit={handleSubmit}
						>
							<input
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder='Имя'
								className='input w-full mb-6 py-6 px-6 text-base rounded-2xl bg-black/30 backdrop-blur-sm border border-white/20 text-white font-[400] placeholder-white/50 placeholder:text-lg placeholder:font-[400] leading-tight align-middle'
								style={{ textAlignVertical: 'center', fontWeight: 400 }}
							/>
							<input
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								placeholder='Телефон'
								className='input w-full mb-6 py-6 px-6 text-base rounded-2xl bg-black/30 backdrop-blur-sm border border-white/20 text-white font-[400] placeholder-white/50 placeholder:text-lg placeholder:font-[400] leading-tight align-middle'
								style={{ textAlignVertical: 'center', fontWeight: 400 }}
							/>
							<textarea
								name="message"
								value={formData.message}
								onChange={handleChange}
								placeholder='Опишите кратко свой проект'
								className='input w-full mb-8 py-6 px-6 text-base rounded-2xl bg-black/30 backdrop-blur-sm border border-white/20 text-white font-[400] placeholder-white/50 placeholder:text-lg placeholder:font-[400] min-h-[120px] resize-none leading-tight'
								style={{ textAlignVertical: 'center', fontWeight: 400 }}
							/>
							<button
								type="submit"
								onClick={handleSubmit}
								className="w-full py-4 px-6 rounded-2xl text-lg bg-white text-black hover:bg-[#A3CD39] hover:text-black transition-all duration-300 cursor-pointer"

							>
								Обсудить мой проект
							</button>
						</form>
					)}
				</div>
			</div>
		</section>
	)
}