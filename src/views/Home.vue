<template>
  <div class="h-full my-auto flex justify-center">
    <login-form @login="login"/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'home',
  components: {
    LoginForm
  },
  methods: {
    login(event) {
      console.log(event)
    }
  }
}
</script>
