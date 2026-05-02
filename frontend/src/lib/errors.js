export function toErrorMessage(err, fallback = 'Something went wrong.') {
  if (!err) return fallback

  const data = err?.response?.data
  if (typeof data === 'string') return data
  if (data && typeof data === 'object') {
    const msg =
      data.message ||
      data.error ||
      data.details ||
      (Array.isArray(data.errors) ? data.errors.join(', ') : null)
    if (typeof msg === 'string' && msg.trim()) return msg
    try {
      return JSON.stringify(data)
    } catch {
      return fallback
    }
  }

  if (typeof err?.message === 'string' && err.message.trim()) return err.message
  if (typeof err === 'string' && err.trim()) return err
  return fallback
}

