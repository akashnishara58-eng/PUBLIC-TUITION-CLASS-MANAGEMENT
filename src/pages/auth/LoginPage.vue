<template>
  <q-page class="flex flex-center bg-white text-black font-inter relative-position">
    <q-btn
      flat
      round
      icon="arrow_back"
      color="black"
      class="absolute-top-left q-ma-md"
      to="/"
      label="Home"
      no-caps
    />
    <div class="auth-card-container">
      <q-card flat bordered class="q-pa-lg shadow-1 auth-card">
        <q-card-section class="text-center">
          <div class="text-h4 text-weight-bold q-mb-xs">
            EDU<span class="text-grey-6">CORE</span>
          </div>
          <div class="text-subtitle1 text-grey-7">Welcome Back</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email Address"
              outlined
              dense
              color="black"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="grey-8" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              label="Password"
              type="password"
              outlined
              dense
              color="black"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="grey-8" />
              </template>
            </q-input>

            <div class="row justify-between items-center text-grey-8 text-caption">
              <q-checkbox v-model="rememberMe" label="Remember me" color="black" size="sm" />
              <div class="cursor-pointer hover-underline">Forgot Password?</div>
            </div>

            <q-btn
              unelevated
              rounded
              color="black"
              text-color="white"
              label="Login"
              class="full-width q-mt-lg text-weight-bold"
              size="lg"
              type="submit"
              :loading="loading"
            />
          </q-form>
        </q-card-section>

        <q-separator class="q-my-md" />

        <q-card-section class="text-center">
          <div class="text-grey-7 q-mb-sm">Don't have an account?</div>
          <q-btn
            flat
            no-caps
            label="Create Account"
            to="/register"
            color="black"
            class="text-weight-bold"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const onSubmit = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Login successful!',
      icon: 'check_circle',
    })

    router.push('/dashboard')
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: err.message,
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-card-container {
  width: 100%;
  max-width: 400px;
  padding: 16px;
}

.auth-card {
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s;

  &:hover {
    border-color: black;
  }
}

.hover-underline:hover {
  text-decoration: underline;
}
</style>
