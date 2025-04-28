/**
 * Sends a message to a specified Telegram chat using the Telegram Bot API.
 *
 * @param {string} message - The message to be sent.
 * @returns {Promise<boolean>} - Returns true if the message was sent successfully, otherwise false.
 */
export default async function sendMessage(message) {
	try {
		return (
			(
				await fetch(
					`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							chat_id: process.env.TG_BOT_CHAT_ID,
							text: message,
							parse_mode: 'Markdown'
						})
					}
				)
			).status === 200
		)
	} catch {
		return false
	}
}
