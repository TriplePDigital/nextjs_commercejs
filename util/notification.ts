import toast from '@/components/util/Notification'

export const notify = (type, message, ID) => toast({ type, message, ID })
