// frontend/src/utils/toastUtils.js
import { toast } from 'react-toastify'

export const showLogoutToast = () => {
  toast.success("You have successfully logged out.")
}

export const showRequireLoginToast = () => {
  toast.info("Please login first.")
}
