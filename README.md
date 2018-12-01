# Vertices animation

**An experiment implementing an animation of moving dots and vertices connecting them.**

The experiment uses HTML `canvas` and has no dependencies.

The code is written in ES8. There is no build pipeline, no transpilation, no packaging, and no tests. Manually tested in Google Chrome 70+ and Mozilla Firefox 63+.

As much as the `canvas` allows it, the code is written in a functional style without using mutations or relying on the `this` keyword.

All logic is in `vertices-animation.js`, the canvas is located and the animation is initiated in `index.html` supplemented by a few style rules.

The animation was designed to take the entirety of the viewport, but it could be relatively easily extended to be able deal with whatever canvas size.

## Usage

1) Download `vertices-animation.js` and import it in your HTML file (or if you are working with node applications or something similar, just lift it in your code base).

2) Add a `canvas` to your HTML, ideally directly inside the `body` and give it an `id`.

3) Initialize the animation:

```
verticesAnimation('idOfTheCanvas')
```

## Customization

There are certain options you can override by passing an object as second argument to `verticesAnimation`:
```
verticesAnimation('canvas', {
  pixelsPerDot: 13500,
  dotColor: '#969696',
  dotSize: {min: 2, max: 6},
  dotSpeed: {min: 2, max: 2.1},
  dotCourseDeviations: 0.05,
  vertexColor: '#000000',
  maxVertexLength: 0.2
})
```

- `pixelsPerDot` is the number of pixels on the canvas for every dot rendered: the higher the value, the fewer the dots. Don't go below 5000 unless you want to make omelette on your PC.
- `dotColor` is the color of the dots, must be in hex format.
- `dotSize` is the size interval of the dots in pixels, has `min` and `max`.
- `dotSpeed` is the speed interval of the dots in pixels per frame, has `min` and `max`.
- `dotCourseDeviations` is the maximum course deviation in radians for the dots after every frame.
- `vertexColor` is the color of the vertices, must be in hex format. Note that this is not the exact perceived color of the vertices, since opacity value between 0.5 and 1 is applied on them.
- `maxVertexLength` controls the maximum distance between dots that have a vertex rendered between them. It also controls the extra padding around the canvas where dots are allowed to exist letting vertices still be rendered when dots leave the viewport.

## Contributions

Contributions are welcome. Feel free to make PRs against `master`.

## License

[Licensed under MIT](./LICENSE), do what you will, have fun!
