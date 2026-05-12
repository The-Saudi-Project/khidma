import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { notificationsAPI } from '../api'

export function useNotifications() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'feed'],
    queryFn: () => notificationsAPI.getNotifications({ limit: 20 }),
    refetchInterval: 30000,
    select: (d) => d.data.data
  })

  const unreadCount = data?.unreadCount ?? 0
  const notifications = data?.notifications ?? []

  const markAsRead = useMutation({
    mutationFn: (id) => notificationsAPI.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] })
  })

  const markAllAsRead = useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] })
  })

  return {
    unreadCount,
    notifications,
    isLoading,
    markAsRead: markAsRead.mutateAsync,
    markAllAsRead: markAllAsRead.mutateAsync
  }
}
