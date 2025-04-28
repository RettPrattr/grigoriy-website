import '@/styles/global.css'

export default function RootLayout({ children }) {
	return (
		<html lang='ru'>
			<body className='mx-auto min-w-80'>{children}</body>
		</html>
	)
}
