<template>
  <q-page class="q-pa-md bg-grey-2 font-inter">
    <div class="row q-col-gutter-md">
      <!-- Welcome Section -->
      <div class="col-12">
        <q-card flat bordered class="bg-white rounded-borders">
          <q-card-section>
            <div class="text-h5 text-weight-bold">Welcome Back!</div>
            <div class="text-subtitle1 text-primary" v-if="userEmail">{{ userEmail }}</div>
            <div class="text-subtitle2 text-grey-7">Here is what's happening today.</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Stats Grid -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-black text-white rounded-borders">
          <q-card-section>
            <div class="text-overline text-grey-4">TOTAL STUDENTS</div>
            <div class="text-h3 text-weight-bold">1,250</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white rounded-borders">
          <q-card-section>
            <div class="text-overline text-grey-7">ACTIVE CLASSES</div>
            <div class="text-h3 text-weight-bold">12</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white rounded-borders">
          <q-card-section>
            <div class="text-overline text-grey-7">REVENUE (This Month)</div>
            <div class="text-h3 text-weight-bold">LKR 450k</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Actions -->
      <div class="col-12">
        <q-btn label="Sign Out" color="red" flat @click="handleSignOut" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const userEmail = ref('')

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    userEmail.value = user.email
  }
})

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    $q.notify({ type: 'negative', message: error.message })
  } else {
    router.push('/login')
  }
}
</script>
