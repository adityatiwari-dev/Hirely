import { useCallback, useMemo, useState } from 'react'

let idCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 3500 }) => {
      const id = ++idCounter
      setToasts((prev) => [{ id, title, description, variant, duration }, ...prev].slice(0, 5))
      return { id, dismiss: () => dismiss(id) }
    },
    [dismiss],
  )

  return useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss])
}

