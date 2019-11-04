<template>
  <div class="h-full flex justify-center items-center">
    <login-form
      v-if="!$store.state.gameViews"
    />
    <game-picker
      v-if="$store.state.gameViews"
      :games="$store.state.gameViews"
    />
  </div>
  
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/LoginForm.vue'
import GamePicker from '@/components/GamePicker.vue'

export default {
  name: 'home',
  components: {
    LoginForm,
    GamePicker,
  },
  methods: {
  },
}
</script>
