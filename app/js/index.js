const theme_sw = document.querySelector('.todo__head__theme__switch')
const create = document.querySelector('.create')
const create_input = document.querySelector('.todo__create__input')
const status = docSel('.status')
const clear_all = docSel('.status__clear-all')
const clear = docSel('.todo__todos__clear')
const all = docSel('.todo__toggle__all')
const active = docSel('.todo__toggle__active')
const completed = docSel('.todo__toggle__completed')

let todo = []
let total_items = 0
let doneTodo = []
let activeTodo = []
let diff = []
let emptySlot = todo.indexOf(null)
let get_data = -1

function docSel (c) {
    return document.querySelector(`${c}`)
}

create_input.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {

        for (i = 1; i<2; i++) {
            if(todo.includes(null)){
                let index = todo.indexOf(null)
                todo[index] = create_input.value
                updateList(index)
                updateStatus('add')
                
                break
            } else {
                todo.push(create_input.value)
                updateList(todo.length -1)
                updateStatus('add')
                
                break
            }
        }
        create_input.value = ""
    }
})

function updateList (i) {
    text = document.createTextNode(`${todo[i]}`)
   
    let divLi = document.createElement('div')
    let done = document.createElement('a')
    let paraLi = document.createElement('p')
    let clearLi = document.createElement('a')
    
    divLi.className = `todo__todos__lists list__${i}`
    done.className = `done__${i} todo__todos__done`
    paraLi.className = `item__${i}`
    done.href = "#"
    clearLi.className = `todo__todos__clear clear__${i}`
    clearLi.href = "#"

    docSel('.draggable__area').appendChild(divLi)
    divLi.appendChild(done)
    divLi.appendChild(paraLi)
    paraLi.appendChild(text)
    divLi.appendChild(clearLi)
    divLi.draggable = "true"
    divLi.addEventListener('dragstart', e=> startDrag(e), false)
    dragDiv(divLi)
}

function dragDiv(div) {
    div.addEventListener("dragover", divDragOver, false)
    div.addEventListener("drop", elmDrop, false)
}


function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

function startDrag(e) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData("text/classname", e.target.className)
}

function divDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // let targetClassName = parseInt(e.target.className.match(/\d/g).join(""))
    // makeSpace(docSel(`.list__${targetClassName}`))
}

function elmDrop(e) {
   let cn = e.dataTransfer.getData("text/classname")
    get_data = parseInt(cn.match(/\d/g).join(""))
    let divEl = docSel(`.list__${get_data}`)
    let targetClassName = parseInt(e.target.className.match(/\d/g).join(""))
    let cdiv = docSel(`.list__${targetClassName}`)
    let pdiv = docSel(`.draggable__area`)
    document.addEventListener('mousemove', mouseDirection)
    function mouseDirection (event) {
        let md = event.movementY
        if(md > 0 ){
            
            insertAfterr(divEl, cdiv)
            document.removeEventListener('mousemove', mouseDirection)
        } else {
            pdiv.insertBefore(divEl, cdiv)
            document.removeEventListener('mousemove', mouseDirection)
        }   
    }
}

function insertAfterr(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function makeSpace(e) {
    e.style.marginTop = "3rem"
    setTimeout(function(){e.style.marginTop = "0rem"}, 1000)
}

function clearLists() {
    document.addEventListener('click', e => {
        clname = e.target.className
        try {
            if(clname.includes("clear")) {
                let item = parseInt(clname.match(/\d/g).join(""))
                if (!isNaN(item)){
                    document.querySelector(`.list__${item}`).remove()
                    
                    todo[item] = null
                    updateStatus('done')
                    
                 } 
            }
        } catch (error) {
            console.log()
        }
    })
}

function doneLists() {
    document.addEventListener('click', e => {
        clname = e.target.className
        try {
            if(clname.includes("done")) {
                let item = parseInt(clname.match(/\d/g).join(""))
                if (!isNaN(item)){
                    const ee =  docSel(`.list__${item}`)
                    const tick = docSel(`.done__${item}`)
                    if (ee.disabled) {
                        // const index = completedTodo.indexOf(item)
                        if (index > -1) {
                            // completedTodo.splice(index, 1)
                            doneTodo.splice(index, 1)
                            document.querySelector(`.item__${item}`).innerHTML = 
                            `${todo[item]}`
                            updateStatus('add')
                            ee.disabled = false
                            tick.classList.remove('done-done')
                        } 
                    } else {
                            document.querySelector(`.item__${item}`).innerHTML = 
                            `<del>${todo[item]}</del>` 
                            // completedTodo.push(item)
                            doneTodo.push(item)
                            updateStatus('done')
                            ee.disabled = true
                            tick.classList.add('done-done')
                        }
                }
            }
        }
        catch (error) {
            console.log()
        }
    })
}

function updateStatus (type) {
    let statusPara = docSel('.status__items')

    switch(type) {
        case 'add':
            total_items += 1
            statusPara.innerHTML = `${total_items} Items`
            break

        case 'done':
            total_items -= 1
            statusPara.innerHTML = `${total_items} Items`
            break
    }
}

function clearAll() {
    clear_all.addEventListener('click', function() {
        if(doneTodo !== []) {
            let d
            for(i in doneTodo) {
                d = doneTodo[i]
                todo[d] = null
                document.querySelector(`.list__${doneTodo[i]}`).remove()
                document.getElementById(`id-${doneTodo[i]}`).remove()
            }
            doneTodo = []
        }
    })
}

toggleView()

function toggleView() {
    all.addEventListener('click', function(){
        for(i in todo){
            if(docSel(`.list__${i}`).style.height != '3rem') {
                try {
                    docSel(`.list__${i}`).style.height = '3rem'
                } catch (error) {
                }
            } 
        }
    })
    active.addEventListener('click', function(){
        for(i in todo) {
            if(docSel(`.list__${i}`).disabled) {
                docSel(`.list__${i}`).style.height = '0rem'
            } else {
                docSel(`.list__${i}`).style.height = '3rem'
            }
        }
    })
    completed.addEventListener('click', function(){
        for(i in todo) {
            if(!docSel(`.list__${i}`).disabled) {
                docSel(`.list__${i}`).style.height = '0rem'
            } else {
                docSel(`.list__${i}`).style.height = '3rem'
            }
        }
    })
}

// function listDiff() {
//     for(i in todo) {
//         if(done[i] != todo.length){
//             diff.push()
//         }

//     }
// }

clearAll()
doneLists()
clearLists()

//  assign deactive to checked
//  check if class of list has deactive
//  