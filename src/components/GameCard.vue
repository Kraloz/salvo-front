<template>
  <div class="block border border-black p-4 my-2 max-w-lg mx-auto">
     <div class="my-2 grilla">
        <div class="p1">{{ gamePlayers[0].player.nickName }}</div>
        <div class="vs"> VS </div>
        <div class="p2" v-if="gamePlayers[1]">{{ gamePlayers[1].player.nickName }}</div>
        <div class="p2" v-if="!gamePlayers[1]"> -- </div>
     </div>
     <div class="text-xs text-gray-700">
       {{Date(created)}}
     </div>
     <button
      class="button w-full mt-2"
      v-if="!isFull && !alreadyJoined"
      @click="$emit('enrollGame', gameId)"
     > Enroll </button>
     <button 
      class="button w-full mt-2"
      v-if="alreadyJoined"
      @click="$emit('joinGame', gameId)"
     >Join Game</button>
  </div>
</template>

<script>
export default {
  name: "GameCard",
  props: ['gameId', 'gamePlayers', 'created', 'isFull', 'alreadyJoined'],
  data() {
    return {
    }
  }
}
</script>

<style scoped>

.grilla {
  display: grid;
  grid-template-areas: "p1 vs p2";
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
}

.p1 { grid-area: "p1"; }
.vs { grid-area: "vs"; }
.p2 { grid-area: "p2"; }

</style>