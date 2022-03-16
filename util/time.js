/**
 *
 * @param {Seconds you want to convert to MM:SS format} time
 * @returns String in MM:SS format
 */
export default function getMinutes(time) {
	//if we get a number less then 1 minute
	if (time < 60) {
		if (time < 10) {
			return `00:0${time}`
		} else {
			return `00:${time}`
		}
	} else {
		let minutes = Math.floor(time / 60)
		let seconds = time % 60
		console.log(minutes, seconds)
		if (seconds < 10) {
			return `${minutes}:0${seconds}`
		} else {
			return `${minutes}:${seconds}`
		}
	}
}
