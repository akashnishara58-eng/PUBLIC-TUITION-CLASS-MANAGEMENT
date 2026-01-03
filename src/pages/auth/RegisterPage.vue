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
          <div class="text-subtitle1 text-grey-7">Create Your Account</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <!-- Role Toggle -->
            <div class="row justify-center q-mb-md">
              <q-btn-toggle
                v-model="role"
                spread
                class="role-toggle full-width"
                no-caps
                rounded
                unelevated
                toggle-color="black"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'Student', value: 'student' },
                  { label: 'Tutor', value: 'tutor' },
                ]"
              />
            </div>

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

            <q-input
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              outlined
              dense
              color="black"
              bg-color="white"
              :rules="[(val) => val === password || 'Passwords do not match']"
            >
              <template v-slot:prepend>
                <q-icon name="lock_clock" color="grey-8" />
              </template>
            </q-input>

            <q-btn
              unelevated
              rounded
              color="black"
              text-color="white"
              label="Sign Up"
              class="full-width q-mt-lg text-weight-bold"
              size="lg"
              type="submit"
              :loading="loading"
            />
          </q-form>
        </q-card-section>

        <q-separator class="q-my-md" />

        <q-card-section class="text-center">
          <div class="text-grey-7 q-mb-sm">Already have an account?</div>
          <q-btn
            flat
            no-caps
            label="Login Here"
            to="/login"
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
import { supabase } from 'src/boot/supabase'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('student')
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    $q.notify({ color: 'negative', message: 'Passwords do not match' })
    return
  }

  loading.value = true
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          role: role.value,
        },
      },
    })

    if (error) throw error

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Registration successful! Check your email for confirmation.',
      icon: 'check_circle',
    })

    // Usually redirect to a "check email" page or login
    router.push('/login')
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
  max-width: 450px;
  padding: 16px;
}

.auth-card {
  border-radius: 16px;
  border: 1px solid #e0e0e0;

  &:hover {
    border-color: black;
  }
}

.role-toggle {
  border: 1px solid #e0e0e0;
}
</style>
