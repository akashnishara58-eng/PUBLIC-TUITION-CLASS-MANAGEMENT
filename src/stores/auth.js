import { defineStore } from 'pinia'
import { supabase } from 'src/boot/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      this.user = user
    },
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      console.log('Login successful:', data.user)
      this.user = data.user
      return data.user
    },
    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      this.user = null
    },
    setUser(user) {
      this.user = user
    },
  },
})
