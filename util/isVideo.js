export default function isVideo(type) {
	if (type.url) {
		return true
	}
	if (type.minimumScore) {
		return false
	}
}
