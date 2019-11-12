<template>
  <div class="flex-container">
    <div id="dock" class="order-none">
      <div id="display"><p>Welcome...</p></div><!--The new ships will show up here, waiting for been placed in the grid -->
    </div>
    <div id="grid" class="order-first">
      <!--The grid will appear here -->
    </div>
    <div id="salvoes" class="order-last">
      <!--The grid will appear here -->
    </div>
  </div>
</template>

<script>
import * as battleship from '@/assets/modules/battleship.js'
import { mapGetters } from 'vuex'

export default {
  name: "game",
  mounted() {
    // Creating grids
    battleship.createGrid(11, document.getElementById('grid'), 'ships')
    battleship.createGrid(11, document.getElementById('salvoes'), 'salvoes')
    this.populateShips()
    this.populateSalvoes()
  },
  methods: {
    whatOrientation([a, b]) {
      if (a[0] == b[0]) {
        return 'horizontal'
      }
      else {
        return 'vertical'
      }
    },
    populateShips() {
      if (this.ships) {
        this.ships.forEach(ship => {
          battleship.createShips(
            ship.type.toLowerCase(), ship.locations.length,
            this.whatOrientation(ship.locations),
            document.getElementById(`ships${ship.locations[0]}`),
            true
          )
        })
      } else {
        battleship.setDefaultShips()
      }
    },
    populateSalvoes() {
      if (this.salvoes) {
        this.salvoes.forEach(salvo => {
          if (salvo.player === this.playerId) {
            // Own salvoes
            // !! Después habrá que chequear de manera segura si le pegamos a un enemigo o no
            salvo.locations.forEach(shot => {
              let cell = document.getElementById(`salvoes${shot}`, false)
              cell.style.backgroundColor = '#1656ee'
            })
          } else {
            // Enemy salvoes
            salvo.locations.forEach(shot => {
              if (this.checkHit(shot)) {
                let cell = document.getElementById(`ships${shot}`, false)
                cell.style.backgroundColor = 'red'
              }
            })
          }
        })
      }
    },
    checkHit(shot) {
      for (let i = 0 ; i < this.ships.length ; i++)
        if (this.ships[i].locations.includes(shot)) return true
      
      return false
    }

  },
  computed: {
    ...mapGetters([
      'playerId',
      'ships',
      'salvoes',
    ]),
  },
}
</script>

<style scoped>
@import '../assets/css/grid.css';
</style>
