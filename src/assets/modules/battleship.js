/*
    Battleship.js
    
    @Author: Rogrigo Garcia Ribeiro [https://github.com/rodrigr]
    Adapted: Tomás Aprile [https://github.com/kraloz]
*/


/*creates the grid structure. It requires a size, an element 
where the grid will be attached to and an id to recognized it. 
*/

export const checkBusyCells = function(ship, cell) {

    let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
    let y = cell.dataset.y.charCodeAt() - 64
    let x = parseInt(cell.dataset.x)

    document.querySelectorAll(`.${ship.id}-busy-cell`).forEach(cell => {
        cell.classList.remove(`${ship.id}-busy-cell`)
    })
      
      

    for(let i = 0; i < ship.dataset.length; i++){
        if(ship.dataset.orientation == 'horizontal'){
            document.querySelector(`#${id}${String.fromCharCode(y + 64)}${x + i}`).classList.add(`${ship.id}-busy-cell`)
        }else{
            document.querySelector(`#${id}${String.fromCharCode(y + 64 + i)}${x}`).classList.add(`${ship.id}-busy-cell`)
        }
    }
}

export const createGrid = function(size, element, id) {

    let wrapper = document.createElement('DIV')//container of the grid
    wrapper.classList.add('grid-wrapper')
    
    //the first loop creates the rows of the grid
    for(let i = 0; i < size; i++){
        let row = document.createElement('DIV')
        row.classList.add('grid-row')
        row.id =`${id}-grid-row${i}`
        wrapper.appendChild(row)// appends the row created in each itaration to the container

        //the second loop creates the amount of cells needed given the size of the grid for every row
        for(let j = 0; j < size; j++){
            let cell = document.createElement('DIV')
            cell.classList.add('grid-cell')
            //if j and i are greater than 0, the drop event is activated
            if(i > 0 && j > 0){
                cell.id = `${id}${String.fromCharCode(i - 1 + 65)}${ j }`
                cell.dataset.y = String.fromCharCode(i - 1 + 65)
                cell.dataset.x = j
                cell.addEventListener('drop', function(event) {dropShip(event)})
                cell.addEventListener('dragover',function(event) {allowDrop(event)})
            }
            //if j is equal to 0, the cells belongs to the first colummn, so the letter is added as text node
            if(j===0 && i > 0){
                let textNode = document.createElement('SPAN')
                textNode.innerText = String.fromCharCode(i+64)
                cell.appendChild(textNode)
            }
            //if i is equal to 0, the cells belongs to the first row, so the number is added as text node
            if(i === 0 && j > 0){
                let textNode = document.createElement('SPAN')
                textNode.innerText = j
                cell.appendChild(textNode)
            }
            row.appendChild(cell)
        }
    }

    element.appendChild(wrapper)

    //Event to allow the drop event.
    function allowDrop(ev) {
      ev.preventDefault();
    }

    //Event to manage what happen when a ship is dropped
    function dropShip(ev) {
      ev.preventDefault();
      document.querySelector("#display p").innerText = ''
      //checks if the targeted element is a cell
      if(!ev.target.classList.contains('grid-cell')){
        document.querySelector("#display p").innerText = 'movement not allowed'
        return
      }
      //variables where the data of the ship beeing dragged is stored
      let data = ev.dataTransfer.getData("ship");
      let ship = document.getElementById(data);
      //variables where the data of the targeted cell is stored
      let cell = ev.target
      let y = cell.dataset.y.charCodeAt() - 64
      let x = parseInt(cell.dataset.x)

      //Before the ship is dropped to a cell, checks if the length of the ship exceed the grid width, 
      //If true, the drop event is aborted.
      if(ship.dataset.orientation == 'horizontal'){
        if(parseInt(ship.dataset.length) + x > 11){
            document.querySelector("#display p").innerText = 'movement not allowed'
            return
        }
        for(let i = 1; i < ship.dataset.length;i++){
            let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
            let cellId = `${id}${cell.dataset.y}${parseInt(cell.dataset.x) + i}`
            if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                document.querySelector("#display p").innerText = 'careful'
                return
            }
        }
      } else{
        if(parseInt(ship.dataset.length) + y > 11){
            document.querySelector("#display p").innerText = 'movement not allowed'
            return
        }

        for(let i = 1; i < ship.dataset.length;i++){
            let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
            let cellId = `${id}${String.fromCharCode(cell.dataset.y.charCodeAt() + i)}${cell.dataset.x}`
            if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                document.querySelector("#display p").innerText = 'careful'
                return
            }
        }
      }
      //Else:
      //the ship takes the position data of the targeted cell 
      ship.dataset.y = String.fromCharCode(y + 64)
      ship.dataset.x = x
      //the ship is added to the cell
      ev.target.appendChild(ship);
      checkBusyCells(ship, ev.target)
    }
}

// createGrid(11, document.getElementById('grid'), 'ships')





export const createShips = function(shipType, length, orientation, parent, isStatic){

    let ship = document.createElement('DIV')
    let grip = document.createElement('DIV')
    let content = document.createElement('DIV')

    ship.classList.add('grid-item')
    ship.dataset.length = length
    ship.dataset.orientation = orientation
    ship.id = shipType

    if(orientation == 'vertical'){
        ship.style.transform = 'rotate(90deg)'
    }

    if(window.innerWidth >= 768){
        ship.style.width = `${length * 45}px` 
        ship.style.height = '45px'
    }else if(window.innerWidth >= 576){
        ship.style.width = `${length * 35}px` 
        ship.style.height = '35px'
    }else{
        ship.style.width = `${length * 30}px` 
        ship.style.height = '30px'
    }

    window.addEventListener('resize', () => {
        if(window.innerWidth >= 768){
            ship.style.width = `${length * 45}px` 
            ship.style.height = '45px'
        }else if(window.innerWidth >= 576){
            ship.style.width = `${length * 35}px` 
            ship.style.height = '35px'
        }else{
            ship.style.width = `${length * 30}px` 
            ship.style.height = '30px'
        }
    })
    
    if(!isStatic){
        grip.classList.add('grip')
        grip.draggable = 'true'
        grip.addEventListener('dragstart', dragShip)
        ship.addEventListener('touchmove', touchShip)
        ship.addEventListener('touchend', touchShipEnd)
        ship.appendChild(grip)
    }
    

    content.classList.add('grid-item-content')
    ship.appendChild(content)

    parent.appendChild(ship)

    if(!isStatic){
        rotateShips(shipType)
    }else{
        checkBusyCells(ship,parent)
    }
    


    //event to allow the ship beeing dragged
    function dragShip(ev){
        ev.dataTransfer.setData("ship", ev.target.parentNode.id)

    }

    //event to allow the ship beeing dragged on touch devices
    function touchShip(ev){
        // make the element draggable by giving it an absolute position and modifying the x and y coordinates
        ship.classList.add("absolute");
        
        var touch = ev.targetTouches[0];
        // Place element where the finger is
        ship.style.left = touch.pageX - 25 + 'px';
        ship.style.top = touch.pageY - 25 + 'px';
        event.preventDefault();
    }
    /* eslint-disable no-unused-vars */
    function touchShipEnd(ev){
        // hide the draggable element, or the elementFromPoint won't find what's underneath
        ship.style.left = '-1000px';
        ship.style.top = '-1000px';
        // find the element on the last draggable position
        var endTarget = document.elementFromPoint(
            event.changedTouches[0].pageX,
            event.changedTouches[0].pageY
            );

            
        // position it relative again and remove the inline styles that aren't needed anymore
        ship.classList.remove('absolute')
        ship.style.left = '';
        ship.style.top = '';
        // put the draggable into it's new home
        if (endTarget.classList.contains('grid-cell')) {
            let y = endTarget.dataset.y.charCodeAt() - 64
            let x = parseInt(endTarget.dataset.x)
            if(ship.dataset.orientation == 'horizontal'){
                if(parseInt(ship.dataset.length) + x > 11){
                    document.querySelector("#display p").innerText = 'movement not allowed'
                    return
                }
                for(let i = 1; i < ship.dataset.length;i++){
                    let id = (endTarget.id).match(new RegExp(`[^${endTarget.dataset.y}|^${endTarget.dataset.x}]`, 'g')).join('')
                    let cellId = `${id}${endTarget.dataset.y}${x + i}`
                    if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                        document.querySelector("#display p").innerText = 'careful'
                        return
                    }
                }
              } else{
                if(parseInt(ship.dataset.length) + y > 11){
                    document.querySelector("#display p").innerText = 'movement not allowed'
                    return
                }
                for(let i = 1; i < ship.dataset.length;i++){
                    let id = (endTarget.id).match(new RegExp(`[^${endTarget.dataset.y}|^${endTarget.dataset.x}]`, 'g')).join('')
                    let cellId = `${id}${String.fromCharCode(endTarget.dataset.y.charCodeAt() + i)}${x}`
                    if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                        document.querySelector("#display p").innerText = 'careful'
                        return
                    }
                }
              }
            endTarget.appendChild(ship);
            ship.dataset.x = x
            ship.dataset.y = String.fromCharCode(y + 64)

            checkBusyCells(ship, endTarget)
        }else{
            document.querySelector("#display p").innerText = 'movement not allowed'
            return
        }
    }

    //event to allow the ship rotation
    function rotateShips(shipType){

        document.querySelector(`#${shipType}`).addEventListener('click', function(ev){

            document.querySelector("#display p").innerText = ''

            let ship = ev.target.parentNode
            let orientation = ship.dataset.orientation
            let cell = ship.parentElement.classList.contains('grid-cell') ? ship.parentElement : null

            if(cell != null){
                if(orientation == 'horizontal'){
                    if(parseInt(ship.dataset.length) + (cell.dataset.y.charCodeAt() - 64) > 11){
                        document.querySelector("#display p").innerText = 'careful'
                        return
                    }
                    
                    for(let i = 1; i < ship.dataset.length;i++){
                        let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
                        let cellId = `${id}${String.fromCharCode(cell.dataset.y.charCodeAt() + i)}${cell.dataset.x}`
                        if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                            document.querySelector("#display p").innerText = 'careful'
                            return
                        }
                    }

                } else{
                    if(parseInt(ship.dataset.length) + parseInt(cell.dataset.x) > 11){
                        document.querySelector("#display p").innerText = 'careful'
                        return
                    }

                    for(let i = 1; i < ship.dataset.length;i++){
                        let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
                        let cellId = `${id}${cell.dataset.y}${parseInt(cell.dataset.x) + i}`
                        if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                            document.querySelector("#display p").innerText = 'careful'
                            return
                        }
                    }
                }
            }

            if(orientation == 'horizontal'){
                ship.dataset.orientation = 'vertical'
                ship.style.transform = 'rotate(90deg)'
                
            } else{
                ship.dataset.orientation = 'horizontal'
                ship.style.transform = 'rotate(360deg)'

            }
            if(cell != null){
                checkBusyCells(ship,cell)
            }
            
        })
    }
}

export const setDefaultShips = function () {
    createShips('carrier', 5, 'horizontal', document.getElementById('dock'),false)
    createShips('battleship', 4, 'horizontal', document.getElementById('dock'),false)
    createShips('submarine', 3, 'horizontal', document.getElementById('dock'),false)
    createShips('destroyer', 3, 'horizontal', document.getElementById('dock'),false)
    createShips('patrol_boat', 2, 'horizontal', document.getElementById('dock'),false)
}
