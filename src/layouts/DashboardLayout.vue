<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Top Header -->
    <q-header class="glass-effect text-grey-9">
      <q-toolbar class="q-px-lg">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold text-subtitle1">
          Tuition<span class="text-primary">Manager</span>
        </q-toolbar-title>

        <q-space />

        <!-- Search Bar (Hidden on Mobile) -->
        <div class="gt-xs q-mr-md" style="min-width: 300px">
          <q-input
            dense
            outlined
            rounded
            placeholder="Search..."
            bg-color="white"
            borderless
            class="search-input shadow-sm"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <!-- Actions -->
        <div class="q-gutter-sm row items-center">
          <q-btn flat round dense icon="notifications_none" color="grey-8">
            <q-badge color="red" floating rounded dot />
          </q-btn>

          <q-separator vertical inset class="q-mx-sm" />

          <div class="column items-end q-mr-sm gt-xs">
            <div class="text-weight-bold text-caption">Admin User</div>
            <div class="text-caption text-grey-6" style="font-size: 10px">Administrator</div>
          </div>

          <q-avatar size="36px" class="cursor-pointer bg-grey-3 text-grey-8">
            <q-icon name="person" />
            <q-menu auto-close>
              <q-list dense style="min-width: 150px">
                <q-item clickable class="q-py-md" to="/dashboard/profile">
                  <q-item-section avatar><q-icon name="account_circle" size="xs" /></q-item-section>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="q-py-md text-red-7" @click="handleLogout">
                  <q-item-section avatar><q-icon name="logout" size="xs" /></q-item-section>
                  <q-item-section>Sign Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above class="sidebar-glass" :width="280">
      <div class="q-pa-lg flex flex-center">
        <div class="text-h6 text-weight-bold tracking-wide">
          EDU<span class="text-grey-6">CORE</span>
        </div>
      </div>

      <q-list padding class="text-grey-8">
        <q-item-label
          header
          class="text-grey-6 text-uppercase text-weight-bold q-mb-sm"
          style="font-size: 11px; letter-spacing: 1px"
        >
          Main Menu
        </q-item-label>

        <q-item clickable v-ripple exact to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/users">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>Users</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/classes">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>Classes</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const leftDrawerOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
    $q.notify({ type: 'positive', message: 'Signed out successfully' })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss">
.search-input .q-field__control {
  border-radius: 8px;
}
</style>
