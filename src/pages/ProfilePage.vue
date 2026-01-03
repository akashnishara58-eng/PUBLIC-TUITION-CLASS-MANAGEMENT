<template>
  <q-page class="bg-grey-1 font-inter">
    <!-- Cover Image & Profile Header -->
    <div class="relative-position">
      <div class="cover-image bg-grey-9 relative-position" style="height: 200px; overflow: hidden">
        <!-- Abstract decorative background -->
        <div
          class="absolute-full"
          style="background: linear-gradient(45deg, #000000, #434343); opacity: 0.8"
        ></div>
      </div>

      <div
        class="container-limited relative-position"
        style="margin-top: -60px; padding-bottom: 20px"
      >
        <q-card flat bordered class="bg-white rounded-borders shadow-1 overflow-hidden">
          <div class="row items-end q-pa-lg">
            <div class="col-auto relative-position">
              <q-avatar size="120px" class="bg-white q-pa-xs shadow-3">
                <q-avatar size="112px" color="grey-3" text-color="grey-8">
                  <span class="text-h3" v-if="!avatarUrl">{{ userInitials }}</span>
                  <img v-else :src="avatarUrl" />
                </q-avatar>
                <q-btn
                  v-if="isOwnProfile"
                  round
                  color="black"
                  size="sm"
                  icon="edit"
                  class="absolute-bottom-right q-mb-sm q-mr-sm"
                  @click="triggerAvatarUpload"
                />
              </q-avatar>
            </div>
            <div class="col q-pl-md q-pb-sm">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h4 text-weight-bold">{{ fullName }}</div>
                  <div class="text-subtitle1 text-grey-6">{{ email }}</div>
                </div>
                <div class="q-gutter-sm">
                  <q-badge color="black" class="q-py-xs q-px-md text-subtitle2" rounded>{{
                    role
                  }}</q-badge>
                  <q-badge
                    v-if="status"
                    :color="status === 'Active' ? 'green' : 'grey'"
                    outline
                    class="q-py-xs q-px-md text-subtitle2"
                    rounded
                    >{{ status }}</q-badge
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <q-tabs
            v-model="activeTab"
            class="text-grey-7"
            active-color="black"
            indicator-color="black"
            align="left"
            inline-label
          >
            <q-tab name="overview" icon="dashboard" label="Overview" />
            <q-tab v-if="isOwnProfile" name="edit" icon="manage_accounts" label="Edit Profile" />
            <q-tab v-if="isOwnProfile" name="security" icon="security" label="Security" />
            <q-tab
              v-if="isOwnProfile"
              name="notifications"
              icon="notifications"
              label="Notifications"
            />
          </q-tabs>
        </q-card>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="container-limited q-pb-xl">
      <q-tab-panels v-model="activeTab" animated class="bg-transparent">
        <!-- Overview Tab -->
        <q-tab-panel name="overview" class="q-pa-none">
          <div class="row q-col-gutter-md">
            <!-- Stats Cards -->
            <div class="col-12 col-md-4">
              <q-card flat bordered class="bg-white">
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7">Classes Enrolled</div>
                  <div class="text-h3 text-weight-bold q-mt-sm">8</div>
                  <div class="text-caption text-green-7 q-mt-xs">
                    <q-icon name="trending_up" /> Active
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card flat bordered class="bg-white">
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7">Attendance Rate</div>
                  <div class="text-h3 text-weight-bold q-mt-sm">95%</div>
                  <div class="text-caption text-grey-6 q-mt-xs">Last 30 days</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card flat bordered class="bg-white">
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7">Next Payment</div>
                  <div class="text-h3 text-weight-bold q-mt-sm">5 Days</div>
                  <div class="text-caption text-orange-8 q-mt-xs">Due on Jan 05</div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Recent Activity or info -->
            <div class="col-12">
              <q-card flat bordered class="bg-white">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-md">Recent Activity</div>
                  <q-list separator>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar icon="login" color="grey-2" text-color="black" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Logged in from New Device</q-item-label>
                        <q-item-label caption>Win10 - Chrome</q-item-label>
                      </q-item-section>
                      <q-item-section side>2 mins ago</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar icon="payments" color="grey-2" text-color="black" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Payment Successful</q-item-label>
                        <q-item-label caption>Physics Class - Monthly Fee</q-item-label>
                      </q-item-section>
                      <q-item-section side>2 days ago</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- Edit Profile Tab -->
        <q-tab-panel name="edit" class="q-pa-none">
          <q-card flat bordered class="bg-white">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Personal Information</div>
              <q-form @submit="updateProfile" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      outlined
                      v-model="fullName"
                      label="Full Name"
                      dense
                      disable
                      hint="Contact admin to change"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="email" label="Email Address" dense disable />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      outlined
                      v-model="phone"
                      label="Phone Number"
                      dense
                      placeholder="+94 77 ..."
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      outlined
                      v-model="address"
                      label="Address"
                      dense
                      placeholder="Colombo, Sri Lanka"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      outlined
                      v-model="bio"
                      label="Bio / About Me"
                      type="textarea"
                      dense
                      rows="3"
                    />
                  </div>
                </div>

                <div class="row justify-end q-mt-lg">
                  <q-btn
                    type="submit"
                    label="Save Changes"
                    color="black"
                    unelevated
                    :loading="loading"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Security Tab -->
        <q-tab-panel name="security" class="q-pa-none">
          <q-card flat bordered class="bg-white">
            <q-card-section>
              <!-- Password Change -->
              <div class="text-h6 text-weight-bold q-mb-md">Change Password</div>
              <q-form @submit="updatePassword" class="q-gutter-md" style="max-width: 500px">
                <q-input
                  outlined
                  type="password"
                  v-model="currentPassword"
                  label="Current Password"
                  dense
                />
                <q-input
                  outlined
                  type="password"
                  v-model="newPassword"
                  label="New Password"
                  dense
                />
                <q-input
                  outlined
                  type="password"
                  v-model="confirmPassword"
                  label="Confirm New Password"
                  dense
                />

                <div>
                  <q-btn type="submit" label="Update Password" color="black" outline />
                </div>
              </q-form>

              <q-separator class="q-my-xl" />

              <!-- 2FA (Mock) -->
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6 text-weight-bold">Two-Factor Authentication</div>
                  <div class="text-grey-7">Add an extra layer of security to your account.</div>
                </div>
                <q-btn label="Enable 2FA" color="black" disable />
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Notifications Tab -->
        <q-tab-panel name="notifications" class="q-pa-none">
          <q-card flat bordered class="bg-white">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Email Notifications</div>
              <q-list>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Class Reschedules</q-item-label>
                    <q-item-label caption
                      >Get notified when a tutor changes class time</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle color="black" v-model="notifClass" />
                  </q-item-section>
                </q-item>

                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Payment Reminders</q-item-label>
                    <q-item-label caption>Receive reminders 3 days before due date</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle color="black" v-model="notifPayment" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'

const authStore = useAuthStore()
const $q = useQuasar()
const route = useRoute()

// State
const activeTab = ref('overview')
const loading = ref(false)

// Profile Data
const fullName = ref('')
const email = ref('')
const role = ref('')
const phone = ref('')
const address = ref('')
const bio = ref('')
const avatarUrl = ref(null) // Future implementation
const status = ref('Active')

// Passwords
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Notifications
const notifClass = ref(true)
const notifPayment = ref(true)

const userInitials = computed(() => {
  if (fullName.value) {
    return fullName.value
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }
  return 'U'
})

const isOwnProfile = computed(() => {
  return !route.params.id || route.params.id === authStore.user?.id
})

onMounted(async () => {
  await fetchProfileData()
})

watch(() => route.params.id, fetchProfileData)

const fetchProfileData = async () => {
  loading.value = true
  try {
    const targetId = route.params.id || authStore.user?.id

    if (!targetId) return

    const { data, error } = await supabase.from('profiles').select('*').eq('id', targetId).single()

    if (error) throw error

    if (data) {
      email.value = data.email
      fullName.value = data.full_name || 'User'
      role.value = data.role || 'Student'
      status.value = data.status || 'Active'
      // Note: In a real app, you might join extra tables for stats
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to load profile' })
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  loading.value = true
  try {
    // Mock save
    await new Promise((r) => setTimeout(r, 1000))
    $q.notify({ type: 'positive', message: 'Profile updated successfully' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error updating profile' })
  } finally {
    loading.value = false
  }
}

const updatePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Passwords do not match' })
    return
  }
  $q.notify({ type: 'positive', message: 'Password updated (Mock)' })
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const triggerAvatarUpload = () => {
  $q.notify({ type: 'info', message: 'Avatar upload feature coming soon!' })
}
</script>

<style lang="scss" scoped>
.container-limited {
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
