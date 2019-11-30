<template>
  <div class=" w-full max-w-3xl my-auto mx-auto">
    <div class="bg-white flex flex-col shadow-xl rounded px-8 pt-6 pb-8">
      <button
        type="button"
        class="button self-start"
        @click="$store.dispatch('logout')"
      >Logout
      </button>
      Select your game:
      <game-card
        v-for="(game, i) in games"
        :key="i"
        :created="game.created"
        :gamePlayers="game.gamePlayers"
        @click.native="setCurrentGame(game)"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import GameCard from '@/components/GameCard.vue'

export default {
  name: "GamePicker",
  components: {
    GameCard,
  },
  created(){
    this.fetchGameViews()
  },
  props: ['games'],
  methods: {
    ...mapActions([
      'fetchGameViews'
    ]),
    retrieveId(game) {
      let id
      game.gamePlayers.forEach(gp => {
        if (gp.player.nickName == this.$store.state.nickName) {
          id = gp.id
        }
      })
      return id
    },
    setCurrentGame(game) {
      this.$store.dispatch('setGpIndex', this.retrieveId(game))
      this.$store.dispatch('setCurrentGame', game)
      this.$router.push({ name: 'game'})
    },
  },
}
</script>
