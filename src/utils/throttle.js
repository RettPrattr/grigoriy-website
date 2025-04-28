/**
 * Creates a throttled function that only invokes the provided function at most once per every wait milliseconds.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} wait - The number of milliseconds to throttle invocations to.
 * @returns {Function} - A new throttled function.
 */
export default function throttle(func, wait) {
	let lastTime = 0

	return (...args) => {
		const context = this
		const now = new Date().getTime()

		if (now - lastTime >= wait) {
			func.apply(context, args)
			lastTime = now
		}
	}
}
