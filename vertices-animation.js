const verticesAnimation = (canvasId, options = {}) => {

  const { // Default options
    pixelsPerDot = 13500, // dot density, higher value = fewer dots, don't go below 5000
    dotColor = '#7f7f7f',
    dotSize = {min: 2, max: 6}, // pixels per frame
    dotSpeed = {min: 3, max: 3.1}, // pixels per frame
    dotCourseDeviations = 0.05, // radians
    vertexColor = '#000000',
    maxVertexLength = 0.2 // % of viewport diagonal
  } = options

  const diagonalLength = (horizontalLength, verticalLength) => {
    const {sqrt, pow} = Math
  	return sqrt(pow(horizontalLength, 2) + pow(verticalLength, 2)) // Pythagoras, go!
  }

  const calculateCanvasPadding = () =>
    maxVertexLength * diagonalLength(window.innerWidth, window.innerHeight)

  const randomBetween = (bottomBoundary, topBoundary) =>
    Math.random() * (topBoundary - bottomBoundary) + bottomBoundary

  const createRandomDot = ({canvasWidth, canvasHeight}) => {
    const {round, random, PI: π} = Math
  	const canvasPadding = calculateCanvasPadding()
    return ({
      x: round(randomBetween(-canvasPadding, canvasWidth + canvasPadding)),
      y: round(randomBetween(-canvasPadding, canvasHeight + canvasPadding)),
      r: randomBetween(dotSize.min, dotSize.max),
      s: randomBetween(dotSpeed.min, dotSpeed.max),
      d: random() * 2 * π,
    })
  }

  const createDots = canvas => {
    // How many dots we need depends on the viewport size
    const numberOfDots = Math.floor(window.innerWidth * window.innerHeight / pixelsPerDot)
    return Array(numberOfDots).fill().map(() => createRandomDot({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    }))
  }

  const handleOverflow = ({position, bottomBoundary, topBoundary}) => {
    if (position < bottomBoundary) {
      return topBoundary
    }
    if (position > topBoundary) {
      return bottomBoundary
    }
    return position
  }

  const deviateCourse = d =>
    d + ((Math.random() * dotCourseDeviations) - (dotCourseDeviations / 2))

  const moveDot = ({x, y, d, s, ...rest}, {canvasWidth, canvasHeight}) => {
    const {sin, cos} = Math
    const maxDistance = calculateCanvasPadding() / 2
    return {
      x: handleOverflow({
        position: x + (cos(d) * s),
        bottomBoundary: -maxDistance,
        topBoundary: canvasWidth + maxDistance
      }),
      y: handleOverflow({
        position: y + (sin(d) * s),
        bottomBoundary: -maxDistance,
        topBoundary: canvasHeight + maxDistance
      }),
      d: deviateCourse(d),
      s, ...rest
    }
  }

  const drawDot = ({x, y, r}, context) => {
    const {PI: π} = Math
    context.beginPath()
    context.arc(x, y, r, 0, 2 * π, false)
    context.fill()
  }

  const drawDots = ({dots, context}) => dots.forEach(dot => drawDot(dot, context))

  const distanceOfDots = ({x: x1, y: y1}, {x: x2, y: y2}) =>
    diagonalLength(x1 - x2, y1 - y2)

  const hexToRGBA = (hex, opacity = 1) => {
    const r = parseInt(hex.slice(1, 3), 16) // Red in decimal (0...255)
    const g = parseInt(hex.slice(3, 5), 16) // Green in decimal (0...255)
    const b = parseInt(hex.slice(5, 7), 16) // Blue in decimal (0...255)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const drawVertex = ({thisDot, otherDot, maxDistance, context}) => {
    const opacityValue = (1 - (distanceOfDots(thisDot, otherDot) / maxDistance )) * 0.5 // (0.5...1)
    context.beginPath()
    context.moveTo(thisDot.x, thisDot.y)
    context.lineTo(otherDot.x, otherDot.y)
    context.strokeStyle = hexToRGBA(vertexColor, opacityValue)
    context.stroke()
  }

  const dotPairs = dots => dots.map(
    (firstDot, firstDotIndex, dots) =>
      dots.slice(firstDotIndex + 1).map(otherDot => [firstDot, otherDot])
  ).flat()

  const drawVertices = ({dots, context}) => {
    const maxDistance = calculateCanvasPadding()
    // Take every combination of dots
    dotPairs(dots).forEach(([thisDot, otherDot]) => {
      const distance = distanceOfDots(thisDot, otherDot)
      if (distance <= maxDistance) {
        // Draw vertex if two dots are close enough
        drawVertex({thisDot, otherDot, maxDistance, context})
      }
    })
  }

  const setContextDefaults = context => {
    context.lineWidth = 1
    context.fillStyle = dotColor
  }

  const manageCanvasSize = ({canvas, context}) => {
    const resetCanvasSettings = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      setContextDefaults(context)
    }
    // Reset canvas size once
    resetCanvasSettings()
    // Reset canvas size again if viewport size changes
    window.addEventListener('resize', resetCanvasSettings)
  }

  const prepareCanvas = canvasId => {
    const canvas = document.getElementById(canvasId)
    const context = canvas.getContext('2d')
    manageCanvasSize({canvas, context})
    return {canvas, context}
  }

  const clearCanvas = ({context, canvas}) => context.clearRect(0, 0, canvas.width, canvas.height)

  const draw = ({canvas, context}) => {
    clearCanvas({context, canvas})
    drawVertices({context, dots})
    drawDots({context, dots})
  	requestAnimationFrame(() => draw({canvas, context, dots}))
  }

  const init = () => {
    setInterval(() => dots = dots.map(
      dot => moveDot(dot, {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })
    ), 1000 / 60) // 60 fps
    requestAnimationFrame(() => draw({canvas, context}))
  }

  const {canvas, context} = prepareCanvas(canvasId)
  let dots = createDots(canvas)
  init()

}
