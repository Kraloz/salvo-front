<template>
  <div class=" w-full max-w-3xl my-auto mx-auto">
    <div class="bg-white flex flex-col shadow-xl rounded px-8 pt-6 pb-8">
      <div class="flex justify-between">
        <button
          type="button"
          class="button"
          @click="$store.dispatch('logout')"
        >Logout
        </button>
        <button
          class="button"
          @click="createGame()"
        >Create game
      </button>
      </div>
      <h1 class="mb-10">Welcome <span class="font-semibold">{{ username }} 👋</span></h1>
      <p>
        Select your game:
      </p>
      <div class="border border-gray-500 h-96 max-h-full overflow-auto">
        <game-card
        v-for="(game, i) in games"
        :key="i"
        :created="game.created"
        :gamePlayers="game.gamePlayers"
        :isFull="game.full"
        :gameId="game.id"
        :alreadyJoined="isAlreadyJoined(game.gamePlayers)"
        @enrollGame="enrollGame"
        @joinGame="fetchGameData"
      />
      </div>
    </div>
  </div>
</template>

<script>
// @click.native="setCurrentGame(game)"
import { mapState, mapActions } from 'vuex'
import GameCard from '@/components/GameCard.vue'

export default {
  name: "GamePicker",
  components: {
    GameCard,
  },
  beforeMount() {
    if(!this.username) this.fetchPlayerInfo()
    this.fetchGames()
  },
  computed: {
    ...mapState({
      games: state => state.game.games,
      username: state => state.game.player.username,
      playerId: state => state.game.player.id
    
    })
  },
  methods: {
    ...mapActions([
      'fetchPlayerInfo', 'fetchGames', 'createGame', 'enrollGame', 'fetchGameData'
    ]),

    isAlreadyJoined(gamePlayers) {
      let joined = false
      gamePlayers.forEach(gp => { if(gp.player.id == this.playerId) joined = true })
      return joined
    }
  },
}
</script>
