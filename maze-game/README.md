# Project Notes:

## Challenges

- _How do we generate a maze?_
  - Many algorithms to generate a maze. We will have to learn a bit about a tree data structure + recursion to implement the simplest algorithm.
- _How are we going to draw this things on the screen?_
  - use Matter JS to draw the maze onto canvas element ([brm.io/matter-js](https://brm.io/matter))
- _How do we make some keyboard keys control the ball?_
  - Matter JS has the ability to map key presses to movements of shapes
- _How do we detect when the ball touches the green square?_
  - Matter JS has the ability to detect collisions between different shapes and report them to us as events.

## MatterJS Terminology

- `World` - Object that contains all of the different 'things' in our matter app.
- `Engine` - Reads in the current state of the world from the world object, then calculates changes in positions of all the different shapes.
- `Runner` - Gets the engine and world to work together. Runs about 60 times per seconds.
- `Render` - Whenever the engine processes an update, Render about 60 times per second.
- `Body` - A shape that we are displaying. Can be a circle, rectangle, oval, etc.

## Building the Mixed Shape Demo

> Setting up Matter JS World

```javascript
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter

const width = 800
const height = 600

const engine = Engine.create()
const { world } = engine
// Create Canvas Element
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

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
  })
)
```

> Creating a Rectangle

```javascript
// Create a shape: Rectangle
// rectangle(x, y, width, height, options)
// `isStatic` - make sure the shape won't move by gravity
const shape = Bodies.rectangle(200, 200, 50, 50, {
  isStatic: true
})
```

> Creating walls

```javascript
// Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true })
]

World.add(world, walls)
```

> Creating Random shapes

```javascript
// Random Shapes
for (let i = 0; i < 30; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    )
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 35)
    )
  }
}
```

## Building a Maze

1. Create a grid of 'cells'
2. Pick a random starting cell
3. For that cell, build a randomly-ordered list of neighbors
4. If a neighbor has been visited before, remove it from the list
5. For each remaining neighbor, 'move' to it and remove the wall between those two cells
6. Repeat step `3` - `5` for this new neighbor

### Data Structure Definitions

> Grid Data Structure

```javascript
const grid = [
  [false, false, false],
  [false, false, false],
  [false, false, false]
] // 3 by 3 grid will have a 2-D array
```

> Wall Data

We also need to record all the wall status, either it's OPEN or CLOSED.

For the walls we should have a boolean status

- `true` - Means can go pass, which means no wall
- `false`- Means cannot go pass, which means has wall

Since we are using a grid, therefore for the status of the wall, we have two different types of walls for a grid.

- `Vertical` - from top to bottom (Vertical walls are between every two COLUMNS)
- `Horizontal` - from left to right (Horizontal walls are between every to ROWS)

Data structure:

```javascript
const verticals = [
  [false, false], // first wall
  [false, false],
  [false, false] // second wall
]

const horizontal = [
  [false, false, false],
  [false, false, false]
]
```
