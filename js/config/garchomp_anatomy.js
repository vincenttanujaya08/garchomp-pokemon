const GarchompAnatomy = {
  colors: {
    darkBlue: [0.18, 0.22, 0.38, 1.0],
    mediumBlue: [0.28, 0.35, 0.55, 1.0],
    red: [0.85, 0.18, 0.15, 1.0],
    cream: [0.95, 0.88, 0.75, 1.0],
    yellow: [0.98, 0.82, 0.25, 1.0],
    white: [0.95, 0.95, 0.95, 1.0],
    black: [0.0, 0.0, 0.0, 1.0],
  },

  head: {
    lobe: {
      radiusX: 0.5,
      radiusY: 0.6,
      radiusZ: 1.5,
    },
    lobeDistance: 0.75,

    centerTriangle: {
      width: 1.6,
      height: 1.4,
      depth: 0.12,
    },

    tip: {
      radiusX: 0.4,
      radiusY: 0.5,
      radiusZ: 0.35,
    },
  },

  neck: {
    radius: 0.6,
    height: 0.4,
  },
};

window.GarchompAnatomy = GarchompAnatomy;

console.log("GarchompAnatomy loaded");
