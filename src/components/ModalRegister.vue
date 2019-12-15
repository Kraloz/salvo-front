<template>
  <div id="modal" @click="$emit('close')">
    <div
      @click.stop
      class="max-w-xl modal-content"
    >
      <form @submit.prevent="goRegister" class="flex flex-col">
        <v-icon
          class="self-end"
          name="times-circle"
          scale="1.5"
          @click="$emit('close')"
        />
        <h2 class="text-2xl mb-4">Register</h2>
        <label class="label mb-3" for="register-email">Email
          <input
            class="input"
            :class="{error: registerErrors.email}"
            v-model="email"
            id="register-email"
            type="email"
            name="email"
            placeholder="Email"
            required
          >
          <p class="subtitle-error" v-if="registerErrors.email">{{ registerErrors.email | capitalize }}</p>
        </label>
        <label class="label mb-3" for="register-nickname">Username
          <input
            class="input"
            :class="{error: registerErrors.username}"
            v-model="username"
            id="register-username"
            type="text"
            name="username"
            placeholder="Username"
            required
          >
          <p class="subtitle-error" v-if="registerErrors.username">{{ registerErrors.username | capitalize }}</p>
        </label>
        <label class="label mb-3" for="register-password">Password
          <input
            class="input"
            :class="{error: registerErrors.password}"
            v-model="password"
            id="register-password"
            type="password"
            name="password"
            placeholder="Password"
            required
          >
          <p class="subtitle-error" v-if="registerErrors.password">{{ registerErrors.password | capitalize }}</p>
        </label>
        <div class="div-errors opacity-75" v-if="registerErrors.commonError">
          <p class="text-red-700 opacity-100">{{ registerErrors.commonError}}</p>
        </div>
        <button type="submit" class="mt-3 button">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/times-circle'

export default {
  name: "ModalRegister",
  components: {
    'v-icon': Icon
  },
  data() {
    return {
      email: '',
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapState({
      registerErrors: state => state.auth.registerError,
      authenticationError: state => state.auth.authenticationError,
      registering: state => state.auth.registering
    }),
  },
  methods: {
    ...mapActions([
      'register'
    ]),

    async goRegister() {
      if(!this.isValid) return

      try {
        await this.register({
          email: this.email,
          username: this.username,
          password: this.password
        })
        this.$emit('success')
      } catch (e) {
        this.$emit('error')
      }
    },

    isValid() {
      let returnValue = true // change my mind

      if (!this.email) {
        this.registerErrors.email = 'Please enter a valid email'
        returnValue = false
      }
      if (!this.username) {
        this.registerErrors.username = 'Please enter a valid username'
          returnValue = false
      }
      if (!this.password) {
        this.registerErrors.password = 'Please enter a valid password'
        returnValue = false
      }

      return returnValue
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style scoped>
  #modal {
    position: fixed; /* Stay in place */
    z-index: 50; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100vh; /* Full height */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: 10% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }
</style>
