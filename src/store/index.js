import { createStore } from 'vuex'
import { currentUserModule } from "@/store/currentUserModule"

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    current_user: currentUserModule,
  }
})
