<template>
  <div class="w-full max-w-xs my-auto mx-auto">
    <modal-register
      v-show="registering"
      @close="registeringToggle(false)"
      @error="registerSuccess=false"
      @success="registerSuccess=true"
      class="z-50"
    />
    <form class="bg-white shadow-xl rounded px-8 pt-6 pb-4">
      <div class="div-errors shadow-md mb-3 bg-green-400 opacity-75" v-if="registerSuccess && !authenticationError">
        <p class="text-green-700 opacity-100">Register Successful!</p>
      </div>
      <div class="mb-4">
        <label class="label" for="username">
          Username
        </label>
        <input
          class="input"
          id="username"
          v-model="nickName"
          type="text" placeholder="Enter your nickname"
        >
      </div>
      <div class="mb-4">
        <label class="label" for="username">
          Password
        </label>
        <input
          class="input"
          id="password"
          v-model="password"
          type="password" placeholder="Enter your password"
        >
      </div>
      <div v-if="authenticationError" class="div-errors text-sm opacity-75 mb-2">
        <p class="text-red-700 opacity-100"> Error: Incorrect password or username </p>
      </div>
      <div class="flex items-center justify-end">
        <VueLoadingButton
          :loading="isLoading"
          class="button"
          @click.native="signin"
          :styled="false"
          type="button"
          aria-label="Login"
        >Go!</VueLoadingButton>
      </div>
      <p class="mt-3">Don't hace an account?
        <button
          class="underline"
          @click="registeringToggle(true)"
        >Register
        </button>
      </p>
    </form>
    <router-link to="/leaderboard" class="flex items-center justify-center block py-2 bg-blue-900 w-full shadow-xl max-w-xs text-white">
      Leaderboard
      <v-icon class="ml-2" name="star"/>
    </router-link>
  </div>
</template>

<script>
import ModalRegister from '@/components/ModalRegister.vue'
import VueLoadingButton from "vue-loading-button"
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/star'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: "LoginForm",
  components: {
    ModalRegister,
    VueLoadingButton,
    'v-icon': Icon
  },
  data() {
    return {
      nickName: '',
      password: '',
      isLoading: false,
      registerSuccess: false,
    }
  },
  computed: {
    ...mapGetters([
      'authenticationError', 'registering'
    ])
  },
  methods: {
    ...mapActions([
      'login', 'registeringToggle'
    ]),
    async signin() {
      this.isLoading = true
      if (this.nickName && this.password) {
        await this.login({username: this.nickName, password: this.password})
        this.isLoading = false
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
  form {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
