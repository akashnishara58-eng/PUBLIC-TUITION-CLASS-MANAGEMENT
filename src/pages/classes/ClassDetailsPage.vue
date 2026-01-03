<template>
  <q-page class="q-pa-lg bg-grey-1 font-inter">
    <!-- Header with Back Button -->
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" color="grey-8" to="/dashboard/classes" class="q-mr-md" />
      <div>
        <div class="row items-center q-gutter-x-sm">
          <h4 class="q-ma-none text-weight-bold tracking-tight">
            {{ classData?.name || 'Loading class...' }}
          </h4>
          <q-badge :color="getStatusColor(classData?.status)" rounded outline class="q-px-sm">{{
            classData?.status
          }}</q-badge>
        </div>
        <div class="text-grey-7 q-mt-xs">
          {{ classData?.subject }} • ID: {{ $route.params.id.substring(0, 8) }}
        </div>
      </div>
      <q-space />
      <div class="q-gutter-sm">
        <q-btn unelevated outline color="black" icon="edit" label="Edit Class" @click="editClass" />
        <q-btn
          unelevated
          color="black"
          icon="person_add"
          label="Enroll Student"
          @click="showEnrollDialog = true"
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Column: Class Info & Stats -->
      <div class="col-12 col-md-4">
        <div class="column q-gutter-y-lg">
          <!-- Main Info Card -->
          <q-card flat bordered class="card-modern shadow-sm">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">Class Overview</div>
              <q-list dense padding>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="event" color="blue-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Schedule</q-item-label>
                    <q-item-label caption
                      >{{ classData?.schedule_day }},
                      {{ classData?.schedule_time?.substring(0, 5) }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="timer" color="blue-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Duration</q-item-label>
                    <q-item-label caption>{{ classData?.duration_minutes }} Minutes</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="payments" color="green-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Monthly Fee</q-item-label>
                    <q-item-label caption>Rs. {{ classData?.fee_amount }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="group" color="purple-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Capacity</q-item-label>
                    <q-item-label caption
                      >{{ students.length }} / {{ classData?.max_students }} Students</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Capacity Gauge -->
          <q-card flat bordered class="card-modern shadow-sm text-center q-pa-lg">
            <div class="text-subtitle2 text-grey-7 q-mb-md">Seat Availability</div>
            <q-knob
              readonly
              v-model="capacityPercentage"
              show-value
              size="120px"
              :thickness="0.15"
              color="blue-7"
              track-color="grey-3"
              class="text-blue-9 text-weight-bold"
            >
              {{ students.length }} / {{ classData?.max_students }}
            </q-knob>
            <div class="text-caption text-grey-6 q-mt-md">
              {{ classData?.max_students - students.length }} spots left
            </div>
          </q-card>
        </div>
      </div>

      <!-- Right Column: Enrolled Students List -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="card-modern shadow-sm">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Enrolled Students</div>
            <q-input
              v-model="studentSearch"
              dense
              outlined
              placeholder="Search students..."
              borderless
              bg-color="white"
              class="shadow-sm q-px-sm rounded-borders"
              style="width: 250px"
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
          </q-card-section>

          <q-separator />

          <q-table
            :rows="filteredStudents"
            :columns="studentColumns"
            row-key="id"
            flat
            :loading="loadingStudents"
            class="students-table"
          >
            <template v-slot:body-cell-avatar="props">
              <q-td :props="props">
                <q-avatar color="grey-3" text-color="black" size="32px">
                  {{ props.row.full_name?.charAt(0) || 'S' }}
                </q-avatar>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge color="green-7" rounded class="q-px-sm">Active</q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="visibility"
                  color="grey-7"
                  @click="viewStudent(props.row)"
                />
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="person_remove"
                  color="negative"
                  @click="removeStudent(props.row)"
                />
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-7 q-pa-xl">
                <q-icon name="group_off" size="48px" class="q-mb-md col-12" />
                <div class="text-h6 col-12 text-center font-medium">No students enrolled yet</div>
                <q-btn
                  flat
                  color="black"
                  label="Enroll now"
                  class="q-mt-sm"
                  @click="showEnrollDialog = true"
                />
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

    <!-- Enrollment Dialog -->
    <q-dialog v-model="showEnrollDialog">
      <q-card style="min-width: 450px" class="card-modern overflow-hidden">
        <div class="bg-black text-white q-pa-lg">
          <div class="text-h6 text-weight-bold">Enroll Student</div>
          <div class="text-caption text-grey-5">
            Select a student from the system to add to this class.
          </div>
        </div>

        <q-card-section class="q-pa-lg">
          <q-select
            v-model="selectedStudent"
            outlined
            dense
            label="Search Student"
            :options="availableStudents"
            option-label="email"
            option-value="id"
            use-input
            input-debounce="300"
            @filter="filterStudents"
            bottom-slots
          >
            <template v-slot:no-option>
              <q-item><q-item-section class="text-grey">No students found</q-item-section></q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-soft">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Enroll Student"
            color="black"
            @click="handleEnroll"
            :loading="enrolling"
            :disable="!selectedStudent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

// State
const classData = ref(null)
const students = ref([])
const loadingClass = ref(true)
const loadingStudents = ref(true)
const studentSearch = ref('')

// Enrollment Dialog State
const showEnrollDialog = ref(false)
const enrolling = ref(false)
const selectedStudent = ref(null)
const availableStudents = ref([])

const studentColumns = [
  { name: 'avatar', label: '', align: 'center', field: 'id' },
  { name: 'full_name', label: 'Student Name', align: 'left', field: 'full_name', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  {
    name: 'enrolled_at',
    label: 'Joined On',
    align: 'left',
    field: 'enrolled_at',
    format: (val) => new Date(val).toLocaleDateString(),
  },
  { name: 'status', label: 'Status', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'right' },
]

const capacityPercentage = computed(() => {
  if (!classData.value) return 0
  return (students.value.length / classData.value.max_students) * 100
})

const filteredStudents = computed(() => {
  return students.value.filter((s) => {
    return (
      (s.full_name && s.full_name.toLowerCase().includes(studentSearch.value.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(studentSearch.value.toLowerCase()))
    )
  })
})

// Lifecycle
onMounted(async () => {
  await fetchClassDetails()
  await fetchEnrolledStudents()
})

const fetchClassDetails = async () => {
  loadingClass.value = true
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error
    classData.value = data
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to load class details' })
    router.push('/dashboard/classes')
  } finally {
    loadingClass.value = false
  }
}

const fetchEnrolledStudents = async () => {
  loadingStudents.value = true
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(
        `
                id,
                enrolled_at,
                profiles:student_id (id, full_name, email)
            `,
      )
      .eq('class_id', route.params.id)

    if (error) throw error

    students.value = data.map((e) => ({
      id: e.id,
      enrolled_at: e.enrolled_at,
      ...e.profiles,
    }))
  } catch (err) {
    console.error(err)
  } finally {
    loadingStudents.value = false
  }
}

const filterStudents = async (val, update) => {
  if (val === '') {
    update(() => {
      availableStudents.value = []
    })
    return
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('role', 'student')
      .ilike('email', `%${val}%`)
      .limit(5)

    if (error) throw error

    update(() => {
      // Filter out already enrolled
      availableStudents.value = data.filter((s) => !students.value.some((curr) => curr.id === s.id))
    })
  } catch (err) {
    console.error(err)
  }
}

const handleEnroll = async () => {
  if (!selectedStudent.value) return
  enrolling.value = true
  try {
    const { error } = await supabase.from('enrollments').insert([
      {
        class_id: route.params.id,
        student_id: selectedStudent.value.id,
      },
    ])

    if (error) throw error

    $q.notify({ type: 'positive', message: 'Student enrolled successfully' })
    showEnrollDialog.value = false
    selectedStudent.value = null
    await fetchEnrolledStudents()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Enrollment failed' })
  } finally {
    enrolling.value = false
  }
}

const removeStudent = (student) => {
  $q.dialog({
    title: 'Confirm Removal',
    message: `Remove ${student.full_name} from this class? This will also archive their participation history.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const { error } = await supabase.from('enrollments').delete().eq('id', student.id) // This is the enrollment ID

      if (error) throw error
      $q.notify({ type: 'positive', message: 'Student removed from class' })
      await fetchEnrolledStudents()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Failed to remove student' })
    }
  })
}

const editClass = () => {
  $q.notify({ type: 'info', message: 'Redirecting to edit mode on main list...' })
  router.push('/dashboard/classes')
}

const viewStudent = (student) => {
  router.push(`/dashboard/profile/${student.id}`)
}

const getStatusColor = (status) => {
  if (status === 'Active') return 'green-7'
  if (status === 'Inactive') return 'orange-8'
  return 'grey-7'
}
</script>

<style lang="scss" scoped>
.tracking-tight {
  letter-spacing: -0.05em;
}

.card-modern {
  border-radius: 16px;
}

.students-table {
  .q-table__head {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #64748b;
  }
}
</style>
