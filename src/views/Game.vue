<template>
  <div class="flex-container">
    <div id="dock">
      <div id="display">
        <p>Welcome...</p>
      </div>
      <!--The new ships will show up here, waiting for been placed in the grid -->
    </div>
    <div id="grid">
      <!--The grid will appear here -->
    </div>
  </div>
</template>

<script>
import * as battleship from '@/assets/modules/battleship.js'

export default {
  name: "game",
  mounted() {
    // Create grid
    battleship.createGrid(11, document.getElementById('grid'), 'ships')
    
    if (this.$store.getters.ships) {
      this.$store.getters.ships.forEach(ship => {
        battleship.createShips(
          ship.type.toLowerCase(), 5,
          this.whatOrientation(ship.locations),
          document.getElementById(`ships${ship.locations[0]}`),false)
      })
    } else {
      battleship.setDefaultShips()
    }
  },
  methods: {
    whatOrientation([a, b]) {
      if (a[0] == b[0]) {
        return 'horizontal'
      }
      else {
        return 'vertical'
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/css/grid.css';
</style>
