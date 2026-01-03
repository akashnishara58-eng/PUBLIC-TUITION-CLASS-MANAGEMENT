<template>
  <q-page class="q-pa-md bg-grey-1 font-inter">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">User Management</div>
        <div class="text-grey-7">Manage system access and roles</div>
      </div>
      <q-btn color="black" icon="add" label="Add New User" unelevated @click="openAddUser" />
    </div>

    <q-card flat bordered class="bg-white rounded-borders">
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-4">
            <q-input
              dense
              outlined
              v-model="search"
              placeholder="Search by email or name..."
              color="black"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              dense
              outlined
              v-model="roleFilter"
              :options="['All', 'Student', 'Tutor', 'Admin']"
              label="Filter by Role"
              color="black"
            />
          </div>
        </div>

        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          flat
          class="user-table"
          :loading="loading"
        >
          <!-- Full Name Column -->
          <template v-slot:body-cell-full_name="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.full_name || 'N/A' }}</div>
            </q-td>
          </template>

          <!-- Status Column -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status)" rounded class="q-py-xs q-px-sm">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>

          <!-- Role Column -->
          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-chip
                size="sm"
                :color="getRoleColor(props.row.role)"
                text-color="white"
                icon="verified_user"
              >
                {{ props.row.role }}
              </q-chip>
            </q-td>
          </template>

          <!-- Actions -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="grey-8" icon="edit" size="sm" @click="editUser(props.row)">
                <q-tooltip>Edit User</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="confirmDeleteUser(props.row)"
              >
                <q-tooltip>Delete User</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Edit User Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Edit User</div>
          <div class="text-caption text-grey">Update user details and permissions</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                outlined
                v-model="editingUser.email"
                label="Email Address"
                disable
                hint="Email cannot be changed"
              />
            </div>
            <div class="col-12">
              <q-input outlined v-model="editingUser.full_name" label="Full Name" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="editingUser.role"
                :options="['Student', 'Tutor', 'Admin']"
                label="Role"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                outlined
                v-model="editingUser.status"
                :options="['Active', 'Suspended', 'Pending']"
                label="Status"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            unelevated
            label="Save Changes"
            color="black"
            @click="saveUserChanges"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="negative" />
          <span class="q-ml-sm text-h6">Delete User?</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete <b>{{ userToDelete?.email }}</b
          >? This action will remove their profile data.
          <div class="text-caption text-red q-mt-sm">
            Note: This only deletes the profile. Auth account deletion requires Admin API.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="black" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="executeDelete" :loading="deleting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

const $q = useQuasar()

// Data
const users = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Filters
const search = ref('')
const roleFilter = ref('All')

// Dialog States
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

// Selection
const editingUser = ref({ id: '', email: '', role: '', full_name: '', status: '' })
const userToDelete = ref(null)

const columns = [
  { name: 'full_name', label: 'Full Name', align: 'left', field: 'full_name', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'role', label: 'Role', align: 'center', field: 'role', sortable: true },
  { name: 'status', label: 'Status', align: 'center', field: 'status' },
  { name: 'actions', label: 'Actions', align: 'right' },
]

// Computed
const filteredUsers = computed(() => {
  let result = users.value

  if (roleFilter.value !== 'All') {
    result = result.filter((u) => u.role === roleFilter.value)
  }

  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(
      (u) =>
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.full_name && u.full_name.toLowerCase().includes(term)),
    )
  }

  return result
})

// Lifecycle
onMounted(() => {
  fetchUsers()
})

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) throw error

    // Map data safely
    users.value = data.map((u) => ({
      ...u,
      status: u.status || 'Active', // Default if missing
      full_name: u.full_name || '',
    }))
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Failed to fetch users' })
  } finally {
    loading.value = false
  }
}

const getRoleColor = (role) => {
  if (role === 'Admin') return 'red-8'
  if (role === 'Tutor') return 'blue-8'
  return 'green-7'
}

const getStatusColor = (status) => {
  if (status === 'Active') return 'green'
  if (status === 'Suspended') return 'orange'
  return 'grey'
}

// Edit Logic
const editUser = (user) => {
  editingUser.value = { ...user } // Clone
  showEditDialog.value = true
}

const saveUserChanges = async () => {
  saving.value = true
  try {
    const updates = {
      role: editingUser.value.role,
      status: editingUser.value.status,
      full_name: editingUser.value.full_name,
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', editingUser.value.id)

    if (error) throw error

    // Update local list
    const idx = users.value.findIndex((u) => u.id === editingUser.value.id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], ...updates }
    }

    $q.notify({ type: 'positive', message: 'User updated successfully' })
    showEditDialog.value = false
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Failed to update user' })
  } finally {
    saving.value = false
  }
}

// Delete Logic
const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

const executeDelete = async () => {
  if (!userToDelete.value) return
  deleting.value = true
  try {
    const { error } = await supabase.rpc('delete_user_by_admin', {
      target_user_id: userToDelete.value.id,
    })

    if (error) throw error

    users.value = users.value.filter((u) => u.id !== userToDelete.value.id)
    $q.notify({ type: 'positive', message: 'User account and profile permanently deleted' })
    showDeleteDialog.value = false
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete user. Ensure you are an Admin.',
    })
  } finally {
    deleting.value = false
  }
}

// Add Mock
const openAddUser = () => {
  $q.notify({ type: 'info', message: 'Invite feature coming soon (requires Email Service)' })
}
</script>

<style lang="scss">
.user-table .q-table__head {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #616161;
}
</style>
