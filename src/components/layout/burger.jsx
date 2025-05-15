'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export default function Burger({ className }) {
	const [isOpen, setIsOpen] = useState(false)
	const menuRef = useRef(null)

	const toggleMenu = useCallback((menu, open) => {
		menu.classList.toggle('opened', open)
		document.body.classList.toggle('modal-opened-mobile', open)
	}, [])

	const handleClick = useCallback(() => {
		const { current } = menuRef
		if (current)
			setIsOpen(prev => {
				toggleMenu(current, !prev)
				return !prev
			})
	}, [toggleMenu])

	useEffect(() => {
		menuRef.current = document.querySelector('.mobile-menu')

		const headerLinks =
			document.querySelectorAll('header a') || []

		const handleResize = () => {
			setIsOpen(prev => {
				if (window.innerWidth > 768 && prev) {
					toggleMenu(menuRef.current, false)
					return false
				}
				return prev
			})
		}

		const linkClick = () => {
			toggleMenu(menuRef.current, false)
			setIsOpen(false)
		}

		window.addEventListener('resize', handleResize)

		headerLinks?.forEach(link => {
			link.addEventListener('click', linkClick)
		})

		return () => {
			headerLinks?.forEach(link => {
				link.removeEventListener('click', linkClick)
			})
			window.removeEventListener('resize', handleResize)
		}
	}, [toggleMenu])

	return (
		<button
			type='button'
			onClick={handleClick}
			aria-label='Открыть меню'
			className={`relative size-10 rounded-md bg-black
				focus:outline-none ${className}`}>
			<span className='sr-only'>Открыть меню</span>
			<div
				className='absolute left-1/2 top-1/2 block w-5 -translate-x-1/2
					-translate-y-1/2'>
				<span
					aria-hidden='true'
					className={`absolute block h-0.5 w-4 bg-white transition
						duration-300 ease-linear
						${isOpen ? 'w-5 rotate-45' : '-translate-y-1'}`}
				/>
				<span
					aria-hidden='true'
					className={`absolute block h-0.5 w-5 bg-white transition
						duration-300 ease-linear ${isOpen ? 'w-0 opacity-0' : ''}`}
				/>
				<span
					aria-hidden='true'
					className={`absolute block h-0.5 w-4 bg-white transition
						duration-300 ease-linear
						${isOpen ? 'w-5 -rotate-45' : 'translate-y-1'}`}
				/>
			</div>
		</button>
	)
}