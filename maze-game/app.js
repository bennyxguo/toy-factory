const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter

const cellsHorizontal = 12
const cellsVertical = 9
const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth
const height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

const unitLengthX = width / cellsHorizontal
const unitLengthY = height / cellsVertical

const engine = Engine.create()
engine.world.gravity.y = 0
const { world } = engine

// Render Canvas Element
const render = Render.create({
  element: document.body, // Tell MaterJS where to show the world in the DOM
  engine: engine,
  options: {
    wireframes: false, // Turn shapes into solid instead of just outlines.
    width,
    height
  }
})
Render.run(render)
Runner.run(Runner.create(), engine)

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 3, { isStatic: true }), // Top
  Bodies.rectangle(width / 2, height, width, 3, { isStatic: true }), // Bottom
  Bodies.rectangle(0, height / 2, 3, height, { isStatic: true }), // Left
  Bodies.rectangle(width, height / 2, 3, height, { isStatic: true }) // Right
]

World.add(world, walls)

// Maze generation

const shuffle = (arr) => {
  let counter = arr.length

  while (counter > 0) {
    counter--
    const index = Math.floor(Math.random() * counter)
    const temp = arr[counter]
    ;[arr[index], arr[counter]] = [arr[counter], arr[index]]
  }

  return arr
}

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false))

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false))

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false))

// Pick a random starting point
const startRow = Math.floor(Math.random() * cellsVertical)
const startColumn = Math.floor(Math.random() * cellsHorizontal)

const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row,column], then return
  if (grid[row][column]) return

  // Mark this cell as being visited
  grid[row][column] = true

  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, 'up'], // Above
    [row, column + 1, 'right'], // Right
    [row + 1, column, 'down'], // Below
    [row, column - 1, 'left'] // Left
  ])

  // for each neighbor...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor

    // --> see if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue
    }

    // --> if we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) continue

    // --> Remove a wall from either horizontals or verticals array
    if (direction === 'left') {
      verticals[row][column - 1] = true
    } else if (direction === 'right') {
      verticals[row][column] = true
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true
    } else if (direction === 'down') {
      horizontals[row][column] = true
    }

    // Visit that next cell
    stepThroughCell(nextRow, nextColumn)
  }
}

stepThroughCell(startRow, startColumn)

// Draw walls

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (!open) {
      const wall = Bodies.rectangle(
        columnIndex * unitLengthX + unitLengthX / 2,
        rowIndex * unitLengthY + unitLengthY,
        unitLengthX,
        5,
        {
          label: 'wall',
          isStatic: true,
          render: {
            fillStyle: '#945CE1'
          }
        }
      )
      World.add(world, wall)
    }
  })
})

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (!open) {
      const wall = Bodies.rectangle(
        columnIndex * unitLengthX + unitLengthX,
        rowIndex * unitLengthY + unitLengthY / 2,
        5,
        unitLengthY,
        {
          label: 'wall',
          isStatic: true,
          render: {
            fillStyle: '#945CE1'
          }
        }
      )
      World.add(world, wall)
    }
  })
})

// Drawing the Goal

const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.6,
  unitLengthY * 0.6,
  {
    label: 'goal',
    isStatic: true,
    render: {
      fillStyle: '#20D2FF'
    }
  }
)
World.add(world, goal)

// Drawing the Playing Ball

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: 'ball',
  render: {
    fillStyle: '#E859DD'
  }
})
World.add(world, ball)

// Binding keyboard controls

document.addEventListener('keydown', (event) => {
  const { x, y } = ball.velocity

  if (event.code === 'ArrowUp' || event.code === 'KeyW') {
    Body.setVelocity(ball, { x, y: y - 5 })
  }

  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    Body.setVelocity(ball, { x: x + 5, y })
  }

  if (event.code === 'ArrowDown' || event.code === 'KeyS') {
    Body.setVelocity(ball, { x, y: y + 5 })
  }

  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    Body.setVelocity(ball, { x: x - 5, y })
  }
})

// Win Condition Detector

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((collision) => {
    const labels = ['ball', 'goal']

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector('.winner').classList.remove('hidden')
      world.gravity.y = 1
      world.bodies.forEach((body) => {
        if (body.label === 'wall') {
          Body.setStatic(body, false)
        }
      })
    }
  })
})
