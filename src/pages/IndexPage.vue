<template>
  <q-page class="bg-white text-black font-inter">
    <!-- Navigation (Overlay) -->
    <div
      class="absolute-top z-top row items-center justify-between q-px-lg q-py-md text-white transition-bg"
      :class="{ 'bg-black': scrollPos > 50 }"
      style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)"
    >
      <div class="text-h5 text-weight-bold tracking-wide cursor-pointer">
        EDU<span class="text-grey-5">CORE</span>
      </div>
      <div class="gt-sm q-gutter-x-md">
        <q-btn flat no-caps label="Home" class="text-white sub-link" />
        <q-btn flat no-caps label="Features" class="text-white sub-link" />
        <q-btn flat no-caps label="About" class="text-white sub-link" />
        <q-btn flat no-caps label="Contact" class="text-white sub-link" />
      </div>
      <div v-if="authStore.user" class="row items-center q-gutter-x-sm">
        <q-btn
          unelevated
          rounded
          color="white"
          text-color="black"
          label="Dashboard"
          to="/dashboard"
          class="text-weight-bold hover-scale"
        />
        <q-btn flat round color="white" icon="logout" @click="authStore.logout()" />
      </div>
      <q-btn
        v-else
        unelevated
        rounded
        color="white"
        text-color="black"
        label="Login"
        to="/login"
        class="q-px-lg text-weight-bold hover-scale"
      />
    </div>

    <!-- Hero Section -->
    <q-parallax :height="800" src="~assets/hero-bg.png">
      <div class="absolute-full bg-black" style="opacity: 0.6"></div>
      <!-- Increased opacity for better text contrast -->
      <div
        class="column items-center justify-center text-center q-px-md text-white relative-position"
        style="max-width: 1200px; margin: 0 auto"
      >
        <div class="text-overline text-grey-4 q-mb-sm tracking-widest animate-fade-down">
          NEXT GEN MANAGEMENT
        </div>

        <!-- Responsive Title -->
        <h1 class="text-weight-bolder q-mt-none q-mb-md hero-title animate-fade-up">
          Empowering The<br />Future of Education
        </h1>

        <p class="hero-subtitle text-grey-3 q-mb-xl animate-fade-up delay-100">
          Seamlessly manage classes, students, and tutors with our state-of-the-art,
          monochrome-designed platform built for high performant institutions.
        </p>

        <div class="q-gutter-md animate-fade-up delay-200">
          <q-btn
            outline
            rounded
            size="lg"
            color="white"
            label="Get Started"
            to="/register"
            class="q-px-xl hover-invert"
          />
          <q-btn
            flat
            rounded
            size="lg"
            color="white"
            icon-right="arrow_forward"
            label="Learn More"
          />
        </div>
      </div>
    </q-parallax>

    <!-- Stats Section -->
    <div class="bg-black text-white q-py-xl">
      <div class="container-limited row justify-center q-gutter-y-lg">
        <div class="col-12 col-md-4 text-center border-right-grey q-mb-sm-lg">
          <div class="text-h2 text-weight-bold counter-anim">10k+</div>
          <div class="text-uppercase text-grey-5 tracking-wide q-mt-sm">Active Students</div>
        </div>
        <div class="col-12 col-md-4 text-center border-right-grey q-mb-sm-lg">
          <div class="text-h2 text-weight-bold counter-anim">500+</div>
          <div class="text-uppercase text-grey-5 tracking-wide q-mt-sm">Tutors</div>
        </div>
        <div class="col-12 col-md-4 text-center">
          <div class="text-h2 text-weight-bold counter-anim">99.9%</div>
          <div class="text-uppercase text-grey-5 tracking-wide q-mt-sm">Uptime</div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="q-py-xl bg-white text-black">
      <div class="container-limited column items-center">
        <div class="text-overline text-grey-8 q-mb-sm text-center">WHY CHOOSE US</div>
        <h2 class="section-title text-weight-bold q-mb-xl text-center">Intelligent Features</h2>

        <div class="row q-col-gutter-lg full-width">
          <div class="col-12 col-md-4">
            <q-card
              flat
              bordered
              class="q-pa-md feature-card full-height column items-start bg-transparent"
            >
              <q-icon name="analytics" size="3rem" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">Smart Analytics</div>
              <p class="text-grey-8">
                Deep insights into student performance and financial growth with real-time data
                visualization.
              </p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card
              flat
              bordered
              class="q-pa-md feature-card full-height column items-start bg-transparent"
            >
              <q-icon name="schedule" size="3rem" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">Automated Scheduling</div>
              <p class="text-grey-8">
                Effortlessly manage timetables and avoid clashes with our AI-powered scheduling
                assistant.
              </p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card
              flat
              bordered
              class="q-pa-md feature-card full-height column items-start bg-transparent"
            >
              <q-icon name="security" size="3rem" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">Secure & Private</div>
              <p class="text-grey-8">
                Enterprise-grade security ensures that your institution's data remains confidential
                and safe.
              </p>
            </q-card>
          </div>

          <!-- New Row -->
          <div class="col-12 col-md-4">
            <q-card
              flat
              bordered
              class="q-pa-md feature-card full-height column items-start bg-transparent"
            >
              <q-icon name="payments" size="3rem" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">Financial Mastery</div>
              <p class="text-grey-8">
                Track tuition fees, generate invoices, and manage tutor payments with a
                comprehensive financial suite.
              </p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card
              flat
              bordered
              class="q-pa-md feature-card full-height column items-start bg-transparent"
            >
              <q-icon name="campaign" size="3rem" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">Automated Alerts</div>
              <p class="text-grey-8">
                Keep students and parents in the loop with instant SMS and email notifications for
                classes and payments.
              </p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card
              flat
              bordered
              class="q-pa-md feature-card full-height column items-start bg-transparent"
            >
              <q-icon name="smartphone" size="3rem" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">Mobile Learning</div>
              <p class="text-grey-8">
                A dedicated mobile experience allowing students to learn and stay connected on the
                go.
              </p>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Showcase Section -->
    <div class="bg-grey-2 q-py-xl">
      <div class="container-limited row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6 order-last order-md-first">
          <q-img src="~assets/feature-student.png" class="rounded-borders shadow-card" />
        </div>
        <div class="col-12 col-md-6">
          <div class="text-overline text-grey-8 q-mb-sm">STUDENT EXPERIENCE</div>
          <h2 class="section-title text-weight-bold q-mb-md">Digital Learning Made Simple</h2>
          <p class="text-body1 text-grey-8 text-weight-regular q-mb-lg" style="line-height: 1.8">
            Provide your students with a seamless digital interface. Access materials, check
            schedules, and track progress from any device.
          </p>
          <q-list class="q-gutter-y-sm">
            <q-item clickable v-ripple class="bg-white rounded-borders shadow-1">
              <q-item-section avatar>
                <q-icon name="check_circle" color="black" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Mobile Responsive Design</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-white rounded-borders shadow-1">
              <q-item-section avatar>
                <q-icon name="check_circle" color="black" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Instant Notifications</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="bg-white rounded-borders shadow-1">
              <q-item-section avatar>
                <q-icon name="check_circle" color="black" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Easy Material Access</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-black text-white q-py-xl text-center">
      <div class="container-limited column items-center q-py-lg">
        <h2 class="text-h3 text-weight-bold q-mb-md">Ready to Scale?</h2>
        <p class="text-h6 text-grey-5 q-mb-xl" style="max-width: 600px">
          Join hundreds of innovative tuition classes transforming their management today.
        </p>
        <q-btn
          unelevated
          rounded
          color="white"
          text-color="black"
          size="lg"
          label="Get Started Now"
          to="/register"
          class="q-px-xl text-weight-bold hover-scale"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-black text-white q-pt-xl q-pb-lg border-top-dark">
      <div class="container-limited text-center md-text-left">
        <div class="row q-col-gutter-xl q-mb-xl">
          <!-- Brand Column -->
          <div class="col-12 col-md-4">
            <div class="text-h5 text-weight-bold tracking-wide q-mb-md">
              EDU<span class="text-grey-6">CORE</span>
            </div>
            <p class="text-grey-5" style="line-height: 1.6">
              Revolutionizing tuition class management with cutting-edge technology and minimalist
              design.
            </p>
            <div class="q-gutter-sm q-mt-md">
              <q-btn flat round dense icon="facebook" color="grey-5" />
              <q-btn flat round dense icon="public" color="grey-5" />
              <!-- Twitter substitute -->
              <q-btn flat round dense icon="ondemand_video" color="grey-5" />
              <!-- Youtube/Insta substitute -->
              <q-btn flat round dense icon="work" color="grey-5" />
              <!-- Linkedin substitute -->
            </div>
          </div>

          <!-- Links Column -->
          <div class="col-6 col-md-2 offset-md-1">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Product</div>
            <div class="column q-gutter-y-sm text-grey-5">
              <a href="#" class="footer-link">Features</a>
              <a href="#" class="footer-link">Pricing</a>
              <a href="#" class="footer-link">Security</a>
              <a href="#" class="footer-link">Updates</a>
            </div>
          </div>

          <!-- Company Column -->
          <div class="col-6 col-md-2">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Company</div>
            <div class="column q-gutter-y-sm text-grey-5">
              <a href="#" class="footer-link">About</a>
              <a href="#" class="footer-link">Careers</a>
              <a href="#" class="footer-link">Blog</a>
              <a href="#" class="footer-link">Contact</a>
            </div>
          </div>

          <!-- Contact Column -->
          <div class="col-12 col-md-3">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Get in Touch</div>
            <div class="column q-gutter-y-sm text-grey-5">
              <div class="row items-center q-gutter-x-sm">
                <q-icon name="email" size="xs" />
                <span>hello@educore.lk</span>
              </div>
              <div class="row items-center q-gutter-x-sm">
                <q-icon name="phone" size="xs" />
                <span>+94 77 123 4567</span>
              </div>
              <div class="row items-center q-gutter-x-sm">
                <q-icon name="location_on" size="xs" />
                <span>Colombo 03, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        <q-separator color="grey-9" class="q-mb-lg" />

        <!-- Bottom Bar -->
        <div class="row justify-between items-center wrap q-gutter-y-md">
          <div class="col-12 col-md-auto">
            <div
              class="row items-center justify-center md-justify-start q-gutter-x-lg text-grey-6 text-caption"
            >
              <span>&copy; 2025 EDUCORE Inc.</span>
              <a href="#" class="footer-link">Privacy Policy</a>
              <a href="#" class="footer-link">Terms of Service</a>
            </div>
          </div>
          <div class="col-12 col-md-auto text-center">
            <div class="text-caption text-grey-7 text-weight-medium" style="letter-spacing: 0.5px">
              POWERED BY <span class="text-white">KDJ LTD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'

const scrollPos = ref(0) // Logic for changing nav bg on scroll
const authStore = useAuthStore()

const updateScroll = () => {
  scrollPos.value = window.scrollY
}

onMounted(async () => {
  window.addEventListener('scroll', updateScroll)
  if (!authStore.user) {
    await authStore.fetchUser()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
})
</script>

<style lang="scss" scoped>
.container-limited {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* Responsive Font Sizes */
.hero-title {
  font-size: 2.5rem; /* Mobile */
  line-height: 1.1;
  letter-spacing: -1px;

  @media (min-width: 600px) {
    font-size: 3.5rem;
  }
  @media (min-width: 1024px) {
    font-size: 5rem;
    letter-spacing: -2px;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  max-width: 700px;
  line-height: 1.6;

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
}

.section-title {
  font-size: 2rem;
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
}

.tracking-wide {
  letter-spacing: 1px;
}
.tracking-widest {
  letter-spacing: 3px;
}

.sub-link {
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
}

.hover-invert {
  transition: all 0.3s;
  &:hover {
    background: white !important;
    color: black !important;
  }
}

.hover-scale {
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
}

.border-right-grey {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  @media (max-width: 1023px) {
    border-right: none;
  }
}

.border-top-dark {
  border-top: 1px solid #1f1f1f;
}

.feature-card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border-color: #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: black;
  }
}

.shadow-card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.footer-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
}

.q-parallax__media > img {
  filter: brightness(0.8) contrast(1.1) grayscale(100%);
}

/* Simple Animations */
.animate-fade-up {
  animation: fadeUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-fade-down {
  animation: fadeDown 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(-20px);
}

.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeDown {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
