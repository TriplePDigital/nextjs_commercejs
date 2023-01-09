import toast from '@/components/util/Notification'
import React from 'react'

type NotificationProp = {
	type: 'error' | 'info' | 'success' | 'warning'
	message: string
	ID: string
}

export const notify = (type, message, ID): React.FC<NotificationProp> => toast({ type, message, ID })
