<template>
  <q-page class="q-pa-lg bg-grey-1 font-inter">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h4 class="q-ma-none text-weight-bold tracking-tight">Class Management</h4>
        <p class="text-grey-7 q-mt-sm">Organize, schedule, and monitor your tuition classes.</p>
      </div>
      <q-btn
        unelevated
        color="black"
        icon="add"
        label="Create New Class"
        class="q-px-md q-py-sm shadow-md hover-lift"
        @click="openCreateDialog"
      />
    </div>

    <!-- Stats Overview (Quick Glance) -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div v-for="stat in quickStats" :key="stat.label" class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="card-modern">
          <q-card-section class="row items-center no-wrap">
            <q-avatar :color="stat.color" text-color="white" :icon="stat.icon" size="48px" />
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-grey-7 font-medium">{{ stat.label }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters & Search Section -->
    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-md-4">
        <q-input
          v-model="search"
          outlined
          dense
          placeholder="Search classes or subjects..."
          bg-color="white"
          class="shadow-sm"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-select
          v-model="filterSubject"
          :options="subjectOptions"
          outlined
          dense
          label="Subject"
          bg-color="white"
          class="shadow-sm"
        />
      </div>
      <div class="col-12 col-md-2">
        <q-select
          v-model="filterDay"
          :options="dayOptions"
          outlined
          dense
          label="Days"
          bg-color="white"
          class="shadow-sm"
        />
      </div>
    </div>

    <!-- Classes Grid -->
    <div v-if="loading" class="row q-col-gutter-lg">
      <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-lg-4">
        <q-card flat bordered class="card-modern shadow-sm">
          <q-item>
            <q-item-section avatar>
              <q-skeleton type="QAvatar" />
            </q-item-section>
            <q-item-section>
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="text" width="40%" />
            </q-item-section>
          </q-item>
          <q-skeleton height="150px" square />
          <q-card-actions align="right">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else-if="filteredClasses.length > 0" class="row q-col-gutter-lg">
      <div v-for="cls in filteredClasses" :key="cls.id" class="col-12 col-sm-6 col-lg-4">
        <q-card flat bordered class="card-modern shadow-sm relative-position overflow-hidden">
          <!-- Glass effect top bar -->
          <div
            class="absolute-top q-px-md q-py-sm glass-effect flex justify-between items-center z-top"
          >
            <q-badge :color="getStatusColor(cls.status)" rounded class="q-px-sm">{{
              cls.status
            }}</q-badge>
            <div class="text-weight-bold text-caption text-grey-9">
              ID: {{ cls.id.substring(0, 8) }}
            </div>
          </div>

          <q-card-section class="q-pt-xl">
            <div class="text-h6 text-weight-bold q-mb-xs">{{ cls.name }}</div>
            <div class="text-subtitle2 text-primary q-mb-md font-medium">{{ cls.subject }}</div>
            <div class="text-body2 text-grey-7 line-clamp-2 q-mb-md" style="min-height: 3em">
              {{
                cls.description ||
                'Comprehensive tuition program covering foundational concepts and advanced problem-solving.'
              }}
            </div>
          </q-card-section>

          <q-separator inset class="q-mx-md" />

          <q-card-section class="q-gutter-y-sm">
            <div class="row items-center text-grey-8">
              <q-icon name="event" size="18px" class="q-mr-sm" color="blue-7" />
              <span class="text-weight-medium">{{ cls.schedule_day }}</span>
              <q-icon name="access_time" size="18px" class="q-ml-lg q-mr-sm" color="blue-7" />
              <span class="text-weight-medium">{{ cls.schedule_time.substring(0, 5) }}</span>
            </div>
            <div class="row items-center text-grey-8">
              <q-icon name="group" size="18px" class="q-mr-sm" color="green-7" />
              <span class="text-weight-medium">0 / {{ cls.max_students }} Students</span>
              <q-icon name="payments" size="18px" class="q-ml-lg q-mr-sm" color="green-7" />
              <span class="text-weight-medium">Rs. {{ cls.fee_amount }}</span>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md bg-soft">
            <q-btn flat color="grey-7" round icon="edit" @click="editClass(cls)">
              <q-tooltip>Edit Details</q-tooltip>
            </q-btn>
            <q-btn flat color="negative" round icon="delete" @click="confirmDelete(cls)">
              <q-tooltip>Archive Class</q-tooltip>
            </q-btn>
            <q-space />
            <q-btn
              unelevated
              color="black"
              label="View Details"
              class="q-px-md rounded-borders font-bold"
              :to="`/dashboard/classes/${cls.id}`"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-center q-pa-xl column">
      <q-avatar icon="school" size="120px" color="grey-3" text-color="grey-6" />
      <div class="text-h5 text-weight-bold q-mt-lg">No classes found</div>
      <div class="text-grey-7 q-mb-xl">Start by creating your first tuition class.</div>
      <q-btn unelevated color="black" label="Create New Class" @click="openCreateDialog" />
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="dialogVisible" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 500px" class="card-modern overflow-hidden">
        <div class="bg-black text-white q-pa-lg">
          <div class="text-h6 text-weight-bold">
            {{ editing ? 'Edit Class' : 'Create New Class' }}
          </div>
          <div class="text-caption text-grey-5">
            Enter the details for the tuition program below.
          </div>
        </div>

        <q-form @submit="handleSubmit">
          <q-card-section class="q-gutter-md q-pt-xl">
            <q-input
              v-model="form.name"
              label="Class Name"
              outlined
              dense
              :rules="[(v) => !!v || 'Name is required']"
            />

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  v-model="form.subject"
                  :options="subjectOptions.filter((o) => o !== 'All')"
                  label="Subject"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Subject is required']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="form.fee_amount"
                  type="number"
                  label="Monthly Fee (Rs)"
                  outlined
                  dense
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  v-model="form.schedule_day"
                  :options="dayOptions.filter((o) => o !== 'All')"
                  label="Schedule Day"
                  outlined
                  dense
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="form.schedule_time"
                  type="time"
                  label="Start Time"
                  outlined
                  dense
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model.number="form.duration_minutes"
                  type="number"
                  label="Duration (min)"
                  outlined
                  dense
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="form.max_students"
                  type="number"
                  label="Capacity"
                  outlined
                  dense
                />
              </div>
            </div>

            <q-input
              v-model="form.description"
              type="textarea"
              label="Description (Optional)"
              outlined
              dense
              rows="3"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md bg-soft">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn unelevated label="Save Class" color="black" type="submit" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog.visible">
      <q-card class="card-modern" style="max-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="warning" color="red-1" text-color="red" size="md" />
          <span class="q-ml-sm text-h6 font-bold">Heads up!</span>
        </q-card-section>

        <q-card-section class="q-pt-md">
          Are you sure you want to delete <b>{{ deleteDialog.className }}</b
          >? This will archive the records and remove it from the dashboard.
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup />
          <q-btn
            flat
            label="Confirm Delete"
            color="negative"
            @click="handleDelete"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const classes = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const dialogVisible = ref(false)
const editing = ref(false)
const editingId = ref(null)

// Filtering
const search = ref('')
const filterSubject = ref('All')
const filterDay = ref('All')

// Form
const form = ref({
  name: '',
  subject: '',
  schedule_day: 'Monday',
  schedule_time: '10:00',
  duration_minutes: 60,
  max_students: 30,
  fee_amount: 0,
  description: '',
})

// Options
const subjectOptions = [
  'All',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'ICT',
  'Combined Maths',
]
const dayOptions = [
  'All',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// Computed stats
const quickStats = computed(() => [
  { label: 'Active Classes', value: classes.value.length, icon: 'school', color: 'blue-8' },
  { label: 'Total Students', value: 0, icon: 'group', color: 'green-7' },
  { label: 'Pending Fees', value: 'Rs. 0', icon: 'payments', color: 'orange-8' },
  {
    label: 'Classes Today',
    value: classes.value.filter((c) => c.schedule_day === getCurrentDay()).length,
    icon: 'event',
    color: 'purple-8',
  },
])

const filteredClasses = computed(() => {
  return classes.value.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.value.toLowerCase())
    const matchesSubject = filterSubject.value === 'All' || c.subject === filterSubject.value
    const matchesDay = filterDay.value === 'All' || c.schedule_day === filterDay.value
    return matchesSearch && matchesSubject && matchesDay
  })
})

const getCurrentDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}

// Dialog Logic
const openCreateDialog = () => {
  editing.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const editClass = (cls) => {
  editing.value = true
  editingId.value = cls.id
  form.value = { ...cls }
  dialogVisible.value = true
}

const resetForm = () => {
  form.value = {
    name: '',
    subject: 'Mathematics',
    schedule_day: 'Monday',
    schedule_time: '10:00',
    duration_minutes: 60,
    max_students: 30,
    fee_amount: 0,
    description: '',
  }
}

// API Methods
const fetchClasses = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    classes.value = data
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to fetch classes' })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }

    if (editing.value) {
      const { error } = await supabase.from('classes').update(payload).eq('id', editingId.value)
      if (error) throw error
      $q.notify({ type: 'positive', message: 'Class updated successfully' })
    } else {
      const { error } = await supabase.from('classes').insert([payload])
      if (error) throw error
      $q.notify({ type: 'positive', message: 'Class created successfully' })
    }

    dialogVisible.value = false
    await fetchClasses()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to save class' })
  } finally {
    saving.value = false
  }
}

// Delete Logic
const deleteDialog = ref({ visible: false, className: '', classId: null })
const confirmDelete = (cls) => {
  deleteDialog.value = {
    visible: true,
    className: cls.name,
    classId: cls.id,
  }
}

const handleDelete = async () => {
  deleting.value = true
  try {
    const { error } = await supabase.from('classes').delete().eq('id', deleteDialog.value.classId)

    if (error) throw error
    $q.notify({ type: 'positive', message: 'Class archived successfully' })
    deleteDialog.value.visible = false
    await fetchClasses()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to delete class' })
  } finally {
    deleting.value = false
  }
}

const getStatusColor = (status) => {
  if (status === 'Active') return 'green-7'
  if (status === 'Inactive') return 'orange-8'
  return 'grey-7'
}

onMounted(fetchClasses)
</script>

<style lang="scss" scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tracking-tight {
  letter-spacing: -0.05em;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.z-top {
  z-index: 10;
}
</style>
