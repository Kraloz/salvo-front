<template>
  <div :key="currentGame.id" class="flex-container">
    <interval :delay=3000 @tick="refreshSalvoes"/>
    <div class="absolute bg-red-500 w-64 h-20 flex text-center items-center z-100" v-if="currentGame.status == 'CREATED' || !(this.currentTurn <= this.enemyTurn)">
      <p class="loading-ellipsis ml-8 text-xl">Waiting for opponent</p>
    </div>
    <div id="dock" ref="dock" class="order-1">
      <div id="display" ref="display"><p>Welcome...</p></div><!--The new ships will show up here, waiting for been placed in the grid -->
    </div>
    <div class="panel flex flex-col botonera order-2">
      <h2 class="mt-0 p-2 bg-gray-500 rounded-t border-b border-l border-r border-gray-700 ">Commander panel</h2>
      <button
        v-if="needDeploy"
        class="button"
        :disabled="(!isShipsLeftInDock || currentGame.status != 'PREPARE')"
        @click="deployShips"
        type="button"
        >Deploy Ships
      </button>
      <button @click="fireSalvo" :disabled="canFire" class="button" type="button ">Shoot!</button>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import Interval from '@/components/Interval.vue'

let observer = null
export default {
  name: "game",
  data() {
    return {
      shipTypes: ['carrier', 'battleship', 'submarine', 'destroyer', 'patrol_boat'],
      shotsLocations: [],
      shipsInDock: 0,
    }
  },
  components: {
    Interval
  },
  computed: {
    ...mapState({
      currentGame: state => state.game.currentGame,
      ships: state => state.game.currentGame.ships,
      salvoes: state => state.game.currentGame.salvoes
    }),
    ...mapGetters([
      'hits',
      'sinks',
      'gameShotList',
      'gameShipsLocations',
      'currentTurn',
      'enemyTurn'
    ]),
    isShipsLeftInDock() {
      return this.shipsInDock == 0
    },
    needDeploy() {
      return this.ships.length == 0
    },
    canFire() {
      return (!(this.currentTurn <= this.enemyTurn) || this.shotsLocations.length<5)
    },
  },
  mounted() {
    // Creating grids
    battleship.createGrid(11, document.getElementById('grid'), 'ships')
    battleship.createGrid(11, document.getElementById('salvoes'), 'salvoes')
    this.populateShips()
    this.populateSalvoes()
    
    this.enableClickSalvoesGrid()

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
    ...mapActions(['sendShipsLocations, refreshGameData']),

    countShipsInDock() { // this updates data.shipsInDock making it "reactive"
      this.shipsInDock = this.$refs.dock.getElementsByClassName('grid-item').length
    },
    populateShips() {
      if (Array.isArray(this.ships) && this.ships.length>0) {
        this.ships.forEach(ship => {
          battleship.createShips(
            ship.type.toLowerCase(),
            ship.locations.length,
            this.whatOrientation(ship.locations.sort()),
            document.getElementById(`ships${ship.locations.sort()[0]}`),
            true
          )
        })
      } else {
        battleship.setDefaultShips()
      }
    },
    populateSalvoes() {
      if (!this.salvoes) return

      // populate all my shots
      if (this.gameShotList.ownShots) {
        this.gameShotList.ownShots.forEach(shot => {
          let cell = document.getElementById(`salvoes${shot}`)
          cell.style.backgroundColor = '#1656ee'
        })
      }

      if (this.hits) {
        // populate enemy hits on my ships
        if (this.hits.enemyHits != null) {
          this.hits.enemyHits.forEach(hit => {
              let cell = document.getElementById(`ships${hit}`)
              cell.style.backgroundColor = 'red'
          })
        }
        // populate my hits on enemy ships
        if (this.hits.myHits != null) {
          this.hits.myHits.forEach(hit => {
            let cell = document.getElementById(`salvoes${hit}`)
            cell.style.backgroundColor = 'red'
          })
        }
      }

      if (this.sinks) {
        // show enemy boats that sunk
        if (this.sinks.mySinks != null) {
          this.sinks.mySinks.forEach(sink => {
            sink.locations.forEach(coord => {
              let cell = document.getElementById(`salvoes${coord}`)
              cell.innerText = 'X'
              cell.classList.add('justify-center')
            })
          })
        }
        // show if my boats have been sunk
        if (this.sinks.enemySinks != null) {
          this.sinks.enemySinks.forEach(sink => {
            sink.locations.forEach(coord => {
              let cell = document.getElementById(`ships${coord}`)
              cell.innerText = 'X'
              cell.classList.add('justify-center')
            })
          })
        }
      }

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
    enableClickSalvoesGrid() {
      const cells = this.$refs.salvoes.getElementsByClassName('grid-cell')

      Array.from(cells).forEach( e => {
        if (!e.hasAttribute('data-y'))
          return

        e.addEventListener('click', e => {
          if (this.shotsLocations.length < 5) {
            let location = `${e.target.dataset.y}${e.target.dataset.x}`
            if (this.currentGame.status == 'COURSE') {
              // Checks if the selected cell was already fired
              if (!this.gameShotList.ownShots.includes(location) && !this.shotsLocations.includes(location)) {
                // Tracks the fired location and changes it's color
                e.target.style.backgroundColor = "rgba(231, 245, 125, 0.5)"
                this.shotsLocations.push(location)
              } else {
                this.$refs.display.firstChild.textContent = "Can't fire in the same place!"
              }
            }

          } else {
            this.$refs.display.firstChild.textContent = "Run out of ammo!"
          }
        })
      })
    },
    // ajax
    async deployShips() {
      try {
        await this.$store.dispatch('sendShipsLocations', {
          gameId: this.currentGame.id,
          locations: this.getPlacedShips()
        })
        
        await this.$store.dispatch('refreshGameData')

        // Cleans up grid
        this.$refs.grid.removeChild(this.$refs.grid.firstChild)
        
        // Set grid & ships again
        battleship.createGrid(11, document.getElementById('grid'), 'ships')
        this.populateShips()

      } catch (e) {
        console.error(e)
      }
    },
    async refreshSalvoes() {
      try {
        await this.$store.dispatch('refreshGameData')
        this.populateSalvoes()
      } catch (e) {
        console.error(e)
      }
    },
    async fireSalvo() {
      try {
        await this.$store.dispatch('sendSalvoLocations', {
          gameId: this.currentGame.id,
          shots: this.shotsLocations,
          turn: this.currentTurn
        })

        await this.$store.dispatch('refreshGameData')
        // Refres salvoes grid
        this.populateSalvoes()
        // Cleans up shots locations
        this.shotsLocations = []

      } catch (e) {
        console.error(e)
      }
    },
  }
}
</script>

<style scoped>
@import '../assets/css/grid.css';
</style>
