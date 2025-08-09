import { toast } from 'react-toastify'

// shared look (matches the container style)
const base =
  '!bg-white !text-gray-900 border !border-gray-200 rounded-xl shadow-lg ' +
  '!text-sm sm:!text-base px-3 py-2 sm:px-4 sm:py-3'

const tint = {
  success: '!bg-green-50 !text-green-800 !border-green-200',
  error:   '!bg-rose-50  !text-rose-800  !border-rose-200',
  info:    '!bg-blue-50  !text-blue-800  !border-blue-200',
  warning: '!bg-amber-50 !text-amber-900 !border-amber-200',
}

const defaults = { icon: false, closeOnClick: true, autoClose: 5000 }
const opts = (extra) => ({ ...defaults, ...(extra || {}) })

// Force-dismiss after the effective autoClose to avoid rare stuck timers
const withForcedDismiss = (id, autoCloseMs) => {
  const ms = typeof autoCloseMs === 'number' ? autoCloseMs : defaults.autoClose
  setTimeout(() => toast.dismiss(id), ms + 250) // small buffer after the built-in timer
}

export const showSuccessToast = (msg, options) => {
  const o = opts(options)
  const id = toast.success(msg, { className: `${base} ${tint.success}`, ...o })
  withForcedDismiss(id, o.autoClose)
  return id
}

export const showErrorToast = (msg, options) => {
  const o = opts(options)
  const id = toast.error(msg, { className: `${base} ${tint.error}`, ...o })
  withForcedDismiss(id, o.autoClose)
  return id
}

export const showInfoToast = (msg, options) => {
  const o = opts(options)
  const id = toast.info(msg, { className: `${base} ${tint.info}`, ...o })
  withForcedDismiss(id, o.autoClose)
  return id
}

export const showWarningToast = (msg, options) => {
  const o = opts(options)
  const id = toast.warning(msg, { className: `${base} ${tint.warning}`, ...o })
  withForcedDismiss(id, o.autoClose)
  return id
}

export const showToast = (msg, options) => {
  const o = opts(options)
  const id = toast(msg, { className: base, ...o })
  withForcedDismiss(id, o.autoClose)
  return id
}

export const showToastPromise = (promise, msgs, options) => {
  const o = opts(options)
  const id = toast.promise(
    promise,
    {
      pending: { render: () => msgs?.pending || 'Working…', className: base },
      success: { render: () => msgs?.success || 'Done!', className: `${base} ${tint.success}` },
      error:   { render: () => msgs?.error || 'Something went wrong', className: `${base} ${tint.error}` },
    },
    o
  )
  // promise toasts usually self-manage; this is a safety net
  withForcedDismiss(id, o.autoClose)
  return id
}

// Named helpers
export const showLogoutToast = () =>
  showSuccessToast('You have successfully logged out.')

export const showRequireLoginToast = () =>
  showInfoToast('Please login first.')
