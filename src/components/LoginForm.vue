<template>
  <div class="w-full max-w-xs my-auto mx-auto">
    <form class="bg-white shadow-xl rounded px-8 pt-6 pb-8">
      <div class="mb-4">
        <label class="block left-align text-gray-700 text-sm font-bold mb-4" for="username">
          NickName
        </label>
        <input
          class="shadow border-gray-400 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          v-model="nickName"
          type="text" placeholder="Enter your nickname"
        >
      </div>
      <div class="flex items-center justify-end">
        <VueLoadingButton
          :loading="isLoading"
          class="button"
          @click.native="login"
          :styled="false"
          type="button"
          aria-label="Login"
        >Go!</VueLoadingButton>
      </div>
    </form>
    <router-link to="/leaderboard" class="flex items-center justify-center block py-1 bg-blue-900 w-full shadow-xl max-w-xs text-white">
      Leaderboard
      <v-icon class="ml-2" name="star"/>
    </router-link>
  </div>
</template>

<script>
import VueLoadingButton from "vue-loading-button"
import 'vue-awesome/icons/star'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: "LoginForm",
  components: {
    VueLoadingButton,
    'v-icon': Icon
  },
  data() {
    return {
      nickName: '',
      isLoading: false,
    }
  },
  methods: {
    async login() {
      this.isLoading = true
      setTimeout(async () => {
        await this.$store.dispatch('login', this.nickName)
        await this.$store.dispatch('fetchGameViews')
        this.isLoading = false
      }, 1000)
    },
  },
}
</script>

<style scoped>
  form {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

</style>