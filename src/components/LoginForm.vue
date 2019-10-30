<template>
  <div class=" w-full max-w-xs my-auto mx-auto">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block left-align text-gray-700 text-sm font-bold mb-4" for="username">
          NickName
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          v-model="nickName"
          type="text" placeholder="Enter your nickname"
        >
      </div>
      <div class="flex items-center justify-end">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline item-end" type="button"
          @click="login">
          Go!
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "LoginForm",
  data() {
    return {
      nickName: ''
    }
  },
  methods: {
    login() {
      axios.get(`/api/player/${this.nickName}/game_views`)
      .then(function (response){
        console.log(response)
      })
    }
  },
  computed: {
  }
}
</script>
