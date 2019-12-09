<template>
  <div :key="currentGameId" class="flex-container">
    <div id="dock" ref="dock" class="order-1">
      <div id="display" ref="display"><p>Welcome...</p></div><!--The new ships will show up here, waiting for been placed in the grid -->
    </div>
    <div class="panel flex flex-col botonera order-2">
      <h2 class="mt-0 p-2 bg-gray-500 rounded-t border-b border-l border-r border-gray-700 ">Commander panel</h2>
      <button
        v-if="needDeploy"
        class="button"
        :disabled="!isShipsLeftInDock"
        @click="deployShips"
        type="button"
        >Deploy Ships
      </button>
      <button class="button" type="button ">Shoot!</button>
    </div>
    <div id="grid" ref="grid" class="order-first">
      <!--The grid will appear here -->
    </div>
    <div id="salvoes" ref="salvoes" class="order-last">
      <!--The grid will appear here -->
    </div>
  </div>
</template>

<script>
import * as battleship from '@/assets/modules/battleship.js'
import { mapActions, mapGetters } from 'vuex'

let observer = null
export default {
  name: "game",
  data() {
    return {
      shipTypes: ['carrier', 'battleship', 'submarine', 'destroyer', 'patrol_boat'],
      shipsInDock: 0,
    }
  },
  computed: {
    ...mapGetters([
      'playerId',
      'ships',
      'salvoes',
      'currentGameId'
    ]),

    isShipsLeftInDock() {
      return this.shipsInDock == 0
    },
    needDeploy() {
      return this.ships.length == 0
    }
  },
  mounted() {
    // Creating grids
    battleship.createGrid(11, document.getElementById('grid'), 'ships')
    battleship.createGrid(11, document.getElementById('salvoes'), 'salvoes')
    this.populateShips()
    this.populateSalvoes()
    
    if (this.needDeploy) {

    /* SHIPS dock REACTIVITY */
    this.countShipsInDock() // initialization of this.shipsInDock

    // eslint-disable-next-line no-unused-vars
    observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this.countShipsInDock() // update value of this.shipsInDock
        }
      }
    })
    observer.observe(this.$refs.dock, {childList: true})
    }
  },
  beforeDestroy() {
    if (observer) observer.disconnect()
  },
  methods: {
    ...mapActions(['sendLocations, refreshGameData']),

    countShipsInDock() { // this updates data.shipsInDock making it "reactive"
      this.shipsInDock = this.$refs.dock.getElementsByClassName('grid-item').length
      console.log('Need deploy ? ', this.needDeploy)
      console.log('Ships in dock :', this.shipsInDock)
    },
    populateShips() {
      if (Array.isArray(this.ships) && this.ships.length>0) {
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
        return this.ships[i].locations.includes(shot)
    },
    getPlacedShips() {
      return this.shipTypes.map(shipType => {
        let cellsShip = this.$refs.grid.getElementsByClassName(`${shipType}-busy-cell`)
        let locations = Array.from(cellsShip).map(coord => `${coord.dataset.y}${coord.dataset.x}`)
        return {type: shipType.toUpperCase(), cells: locations}
      })
    },
    whatOrientation([a, b]) {
      if (a[0] == b[0]) {
        return 'horizontal'
      }
      return 'vertical'
    },
    async deployShips() {
      try {
        await this.$store.dispatch('sendLocations', {gameId: this.currentGameId, locations: this.getPlacedShips()})
        
        await this.$store.dispatch('refreshGameData')

        // Cleans up grid
        this.$refs.grid.removeChild(this.$refs.grid.firstChild)
        
        // Set grid & ships again
        battleship.createGrid(11, document.getElementById('grid'), 'ships')
        this.populateShips()

      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/css/grid.css';
</style>
