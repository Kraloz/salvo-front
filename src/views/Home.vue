<template>
  <div class="h-full flex justify-center items-center">
    <login-form
      v-if="!loggedIn"
    />
    <game-picker
      v-if="loggedIn"
    />
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import LoginForm from '@/components/LoginForm.vue'
import GamePicker from '@/components/GamePicker.vue'

export default {
  name: 'home',
  components: {
    LoginForm,
    GamePicker,
  },
  computed: {
    ...mapGetters(['loggedIn'])
  }
}
</script>
