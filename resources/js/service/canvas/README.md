# The Image ImageEngine

## Principles

- All user interaction must be done outside the engine
- Inside the engine, data changes are propagated through `EngineEvents` (observer pattern)
- Every canvas is cached and only redrawn when needed

## Structure

### `ImageEngine`

- `ImageEngine` is the main class, that exposes the API to the outside world
- It provides the drawing context of the main canvas to the sub-engines

### Sub-engines

- Every object type of the image has its own sub-engine (e.g. `BackgroundEngine`, `LogoEngine`, `BarsEngine`)
- Sub-engines are responsible for creating and updating their Layers, Blocks and Elements
- Sub-engines receive the `EngineEvents` and the main canvas as class as a dependencies
- They must implement a `draw()` method that paints their canvas on the main canvas

### Layers

- Layers position their block on the main canvas

### Blocks

- Blocks group together elements of the same type (e.g. all bar elements)
- They are responsible for positioning their elements
- If a block contains only one element, it may be omitted. The layer will then use the element instead

### Elements

- Elements are the smallest building blocks of the image (e.g. a bar)
- They are responsible for drawing themselves

## Wrap up

- All properties are set on the `ImageEngine` class, sub-engines may subscribe to changes via `EngineEvents`
- If you call `ImageEngine.draw()` the following chain is triggered:
  `ImageEngine.draw()` -> `<SubEngine>.draw()` -> `<Layer>.draw()` -> `<Block>.draw()` -> `<Element>.draw()`
