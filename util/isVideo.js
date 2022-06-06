export default function isVideo(type) {
	if (type?.vimeoVideo?.url) {
		return true
	}
	if (type?.minimumScore) {
		return false
	}
}
