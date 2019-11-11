<template>
  <div class="h-full flex justify-center items-center">
    <table class="bg-white">
      <thead>
        <tr>
          <th>Nickname</th>
          <th>Total Score</th>
          <th>Wins</th>
          <th>Draws</th>
          <th>Losses</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, i) in topPlayers" :key=i>
          <td>{{ player.nickName }}</td>
          <td>{{ player.wins }}</td>
          <td>{{ player.draws }}</td>
          <td>{{ player.losses }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Leaderboard',
  data() {
    return {
      topPlayers: {}
    }
  },
  created() {
    axios.get(`/api/leaderboard`)
    .then((response) => {
      this.topPlayers = response.data
    })
  },
}
</script>

<style scoped>

</style>