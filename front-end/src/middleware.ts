import { AnyAction, isRejected, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// type predicate function
function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
    status: number
  }
} {
  return typeof payload === 'object' && payload !== null && typeof (payload as any).data?.error === 'string'
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  /**
   * `isRejectedWithValue` là một function giúp chúng ta kiểm tra những action có rejectedWithValue = true từ createAsyncThunk
   * RTK Query sử dụng `createAsyncThunk` bên trong nên chúng ta có thể dùng `isRejectedWithValue` để kiểm tra lỗi 🎉
   */

  // Optional, trong thuc ko bat buoc phai lam ky ntn
  if (isRejected(action)) {
    if (action.error.name === 'CustomError') {
      // Day la nhung loi lien quan den qua trinh thuc thi
      toast.warn(action.error.message)
    }
  }

  if (isRejectedWithValue(action)) {
    /**
     * Mỗi khi thực hiện query hoặc mutation mà bị lỗi thì nó sẽ chạy vào đây
     * Những lỗi từ server thì action nó mới có rejectedWithValue = true
     * Còn những action liên quan đến việc caching mà bị rejected thì rejectedWithValue = false, nên đừng lo lắng, nó không lọt vào đây được
     */
    if (isPayloadErrorMessage(action.payload)) {
      // Lỗi reject từ server ma chỉ có message
      toast.warn(action.payload.data.error)
    }
  }
  return next(action)
}
