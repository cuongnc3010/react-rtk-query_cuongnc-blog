import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rtkQueryErrorLogger } from 'middleware'
import { blogApi } from 'pages/blog/blog.service'
import blogReducer from 'pages/blog/blog.slice'
// ...

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer // them reducer duoc tao tu api Slice
  },
  // Them middleware de enable cac tinh nang catching, invalidation, polling
  // va cac tinh nang khac cua rtk-query
  // Cach 1:
  // middleware(getDefaultMiddleware) {
  //   return getDefaultMiddleware().concat(blogApi.middleware)
  // }
  // Cach 2:
  middleware: (getDefaultMidlleware) => getDefaultMidlleware().concat(blogApi.middleware, rtkQueryErrorLogger)
})
// optional, nhung bat buoc neu muon dung tinh nang refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
