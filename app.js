const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".game-panel"));
const audioToggle = document.getElementById("audioToggle");

let audioEnabled = true;

const speak = (text) => {
  if (!audioEnabled || !("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
};

const shuffle = (items) => {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const setFeedback = (element, message, kind) => {
  element.textContent = message;
  element.classList.remove("good", "try");
  if (kind) {
    element.classList.add(kind);
  }
};

const setActiveGame = (game) => {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.game === game;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive.toString());
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.game === game);
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveGame(tab.dataset.game));
});

audioToggle.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  audioToggle.textContent = audioEnabled ? "Audio: On" : "Audio: Off";
  audioToggle.setAttribute("aria-pressed", audioEnabled.toString());
  if (!audioEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

// Phonics
const phonicsOptions = document.getElementById("phonicsOptions");
const phonicsSound = document.getElementById("phonicsSound");
const phonicsFeedback = document.getElementById("phonicsFeedback");
const phonicsNew = document.getElementById("phonicsNew");
const phonicsListen = document.getElementById("phonicsListen");

const phonicsItems = [
  { letter: "S", sound: "sss", example: "sun" },
  { letter: "A", sound: "a", example: "apple" },
  { letter: "T", sound: "t", example: "tiger" },
  { letter: "P", sound: "p", example: "pig" },
  { letter: "I", sound: "i", example: "igloo" },
  { letter: "N", sound: "n", example: "nest" },
  { letter: "C", sound: "k", example: "cat" },
  { letter: "E", sound: "e", example: "egg" },
];

let currentPhonics = phonicsItems[0];

const buildPhonicsRound = () => {
  currentPhonics = phonicsItems[Math.floor(Math.random() * phonicsItems.length)];
  const optionLetters = shuffle(
    Array.from(
      new Set([
        currentPhonics.letter,
        phonicsItems[Math.floor(Math.random() * phonicsItems.length)].letter,
        phonicsItems[Math.floor(Math.random() * phonicsItems.length)].letter,
      ])
    )
  ).slice(0, 3);

  while (optionLetters.length < 3) {
    const extra = phonicsItems[Math.floor(Math.random() * phonicsItems.length)].letter;
    if (!optionLetters.includes(extra)) {
      optionLetters.push(extra);
    }
  }

  phonicsSound.textContent = `/${currentPhonics.sound}/`;
  phonicsOptions.innerHTML = "";
  optionLetters.forEach((letter) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = letter;
    button.addEventListener("click", () => {
      if (letter === currentPhonics.letter) {
        setFeedback(
          phonicsFeedback,
          `Great job! ${currentPhonics.letter} is for ${currentPhonics.example}.`,
          "good"
        );
        speak(
          `Great job! ${currentPhonics.letter} is for ${currentPhonics.example}.`
        );
      } else {
        setFeedback(phonicsFeedback, "Try again. Listen for the sound.", "try");
        speak("Try again.");
      }
    });
    phonicsOptions.appendChild(button);
  });

  setFeedback(phonicsFeedback, "", "");
};

phonicsNew.addEventListener("click", () => {
  buildPhonicsRound();
  speak(`Find the letter that makes the ${currentPhonics.sound} sound.`);
});

phonicsListen.addEventListener("click", () => {
  speak(`Find the letter that makes the ${currentPhonics.sound} sound.`);
});

// Numbers
const numbersTrack = document.getElementById("numbersTrack");
const numbersOptions = document.getElementById("numbersOptions");
const numbersFeedback = document.getElementById("numbersFeedback");
const numbersNew = document.getElementById("numbersNew");
const numbersListen = document.getElementById("numbersListen");

let currentNumber = 1;

const buildNumbersRound = () => {
  currentNumber = Math.floor(Math.random() * 10) + 1;
  numbersTrack.innerHTML = "";
  for (let i = 0; i < currentNumber; i += 1) {
    const car = document.createElement("div");
    car.className = "train-car";
    numbersTrack.appendChild(car);
  }

  const options = shuffle([
    currentNumber,
    Math.max(1, currentNumber - 1),
    Math.min(10, currentNumber + 1),
    Math.floor(Math.random() * 10) + 1,
  ]).slice(0, 4);

  numbersOptions.innerHTML = "";
  options.forEach((value) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = value;
    button.addEventListener("click", () => {
      if (value === currentNumber) {
        setFeedback(numbersFeedback, `Yes! There are ${currentNumber}.`, "good");
        speak(`Yes! There are ${currentNumber}.`);
      } else {
        setFeedback(numbersFeedback, "Not quite. Count again.", "try");
        speak("Not quite. Count again.");
      }
    });
    numbersOptions.appendChild(button);
  });

  setFeedback(numbersFeedback, "", "");
};

numbersNew.addEventListener("click", () => {
  buildNumbersRound();
  speak("Count the train cars. How many?");
});

numbersListen.addEventListener("click", () => {
  speak("Count the train cars. How many?");
});

// Shapes
const shapeTarget = document.getElementById("shapeTarget");
const shapeOptions = document.getElementById("shapeOptions");
const shapeFeedback = document.getElementById("shapeFeedback");
const shapesNew = document.getElementById("shapesNew");
const shapesListen = document.getElementById("shapesListen");

const shapes = [
  { id: "circle", label: "Circle", color: "#ffd166" },
  { id: "square", label: "Square", color: "#5ad8ff" },
  { id: "triangle", label: "Triangle", color: "#ff7a1a" },
  { id: "star", label: "Star", color: "#ff5fa6" },
  { id: "rectangle", label: "Rectangle", color: "#5ee6b8" },
  { id: "oval", label: "Oval", color: "#c9f2ff" },
];

let currentShape = shapes[0];

const buildShapesRound = () => {
  currentShape = shapes[Math.floor(Math.random() * shapes.length)];
  shapeTarget.className = "shape big";
  shapeTarget.classList.add(currentShape.id);
  shapeTarget.style.background = currentShape.color;

  const options = shuffle([
    currentShape,
    shapes[Math.floor(Math.random() * shapes.length)],
    shapes[Math.floor(Math.random() * shapes.length)],
  ])
    .filter((shape, index, list) => list.findIndex((item) => item.id === shape.id) === index)
    .slice(0, 3);

  while (options.length < 3) {
    const extra = shapes[Math.floor(Math.random() * shapes.length)];
    if (!options.find((shape) => shape.id === extra.id)) {
      options.push(extra);
    }
  }

  shapeOptions.innerHTML = "";
  options.forEach((shape) => {
    const button = document.createElement("button");
    button.className = "option";
    const shapeEl = document.createElement("div");
    shapeEl.className = `shape ${shape.id}`;
    shapeEl.style.background = shape.color;
    button.appendChild(shapeEl);
    button.addEventListener("click", () => {
      if (shape.id === currentShape.id) {
        setFeedback(shapeFeedback, `You found the ${shape.label}!`, "good");
        speak(`You found the ${shape.label}.`);
      } else {
        setFeedback(shapeFeedback, "Try a different shape.", "try");
        speak("Try a different shape.");
      }
    });
    shapeOptions.appendChild(button);
  });

  setFeedback(shapeFeedback, "", "");
};

shapesNew.addEventListener("click", () => {
  buildShapesRound();
  speak(`Find the ${currentShape.label}.`);
});

shapesListen.addEventListener("click", () => {
  speak(`Find the ${currentShape.label}.`);
});

// Colors
const colorTarget = document.getElementById("colorTarget");
const colorOptions = document.getElementById("colorOptions");
const colorFeedback = document.getElementById("colorFeedback");
const colorsNew = document.getElementById("colorsNew");
const colorsListen = document.getElementById("colorsListen");

const colors = [
  { name: "Red", value: "#ff5a5f" },
  { name: "Blue", value: "#4dabff" },
  { name: "Green", value: "#55e3a1" },
  { name: "Yellow", value: "#ffd166" },
  { name: "Orange", value: "#ff8a3d" },
  { name: "Pink", value: "#ff5fa6" },
  { name: "Purple", value: "#9f8bff" },
];

let currentColor = colors[0];

const buildColorsRound = () => {
  currentColor = colors[Math.floor(Math.random() * colors.length)];
  colorTarget.style.background = currentColor.value;

  const options = shuffle([
    currentColor,
    colors[Math.floor(Math.random() * colors.length)],
    colors[Math.floor(Math.random() * colors.length)],
  ])
    .filter((color, index, list) => list.findIndex((item) => item.name === color.name) === index)
    .slice(0, 3);

  while (options.length < 3) {
    const extra = colors[Math.floor(Math.random() * colors.length)];
    if (!options.find((color) => color.name === extra.name)) {
      options.push(extra);
    }
  }

  colorOptions.innerHTML = "";
  options.forEach((color) => {
    const button = document.createElement("button");
    button.className = "option";
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.background = color.value;
    const label = document.createElement("div");
    label.textContent = color.name;
    button.appendChild(swatch);
    button.appendChild(label);
    button.addEventListener("click", () => {
      if (color.name === currentColor.name) {
        setFeedback(colorFeedback, `Yes! That's ${currentColor.name}.`, "good");
        speak(`Yes! That's ${currentColor.name}.`);
      } else {
        setFeedback(colorFeedback, "Try another color.", "try");
        speak("Try another color.");
      }
    });
    colorOptions.appendChild(button);
  });

  setFeedback(colorFeedback, "", "");
};

colorsNew.addEventListener("click", () => {
  buildColorsRound();
  speak(`Find the color ${currentColor.name}.`);
});

colorsListen.addEventListener("click", () => {
  speak(`Find the color ${currentColor.name}.`);
});

// Handwriting
const handwritingTarget = document.getElementById("handwritingTarget");
const handwritingCanvas = document.getElementById("handwritingCanvas");
const handwritingFeedback = document.getElementById("handwritingFeedback");
const handwritingNew = document.getElementById("handwritingNew");
const handwritingClear = document.getElementById("handwritingClear");
const handwritingListen = document.getElementById("handwritingListen");

const handwritingItems = ["A", "B", "C", "S", "T", "P", "1", "2", "3", "4", "5"];
let currentTrace = handwritingItems[0];
let drawing = false;
let lastPoint = null;
let ctx = null;
let deviceRatio = window.devicePixelRatio || 1;

const resizeCanvas = () => {
  if (!handwritingCanvas) {
    return;
  }
  deviceRatio = window.devicePixelRatio || 1;
  const { clientWidth, clientHeight } = handwritingCanvas;
  handwritingCanvas.width = clientWidth * deviceRatio;
  handwritingCanvas.height = clientHeight * deviceRatio;
  ctx = handwritingCanvas.getContext("2d");
  ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#ff7a1a";
  drawGuide();
};

const drawGuide = () => {
  if (!ctx) {
    return;
  }
  const width = handwritingCanvas.clientWidth;
  const height = handwritingCanvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ff5fa6";
  ctx.font = `${Math.min(width, height) * 0.6}px Fredoka`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(currentTrace, width / 2, height / 2 + 8);
  ctx.restore();
};

const getCanvasPoint = (event) => {
  const rect = handwritingCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

const startDrawing = (event) => {
  drawing = true;
  lastPoint = getCanvasPoint(event);
};

const drawLine = (event) => {
  if (!drawing || !ctx) {
    return;
  }
  const point = getCanvasPoint(event);
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  lastPoint = point;
};

const stopDrawing = () => {
  drawing = false;
  lastPoint = null;
};

const buildHandwritingRound = () => {
  currentTrace = handwritingItems[Math.floor(Math.random() * handwritingItems.length)];
  handwritingTarget.textContent = currentTrace;
  drawGuide();
  setFeedback(handwritingFeedback, "Trace slowly and stay on the guide!", "");
};

handwritingNew.addEventListener("click", () => {
  buildHandwritingRound();
  speak(`Trace the ${currentTrace}.`);
});

handwritingClear.addEventListener("click", () => {
  drawGuide();
  setFeedback(handwritingFeedback, "Canvas cleared. Try again!", "");
});

handwritingListen.addEventListener("click", () => {
  speak(`Trace the ${currentTrace}.`);
});

handwritingCanvas.addEventListener("pointerdown", (event) => {
  handwritingCanvas.setPointerCapture(event.pointerId);
  startDrawing(event);
});

handwritingCanvas.addEventListener("pointermove", drawLine);
handwritingCanvas.addEventListener("pointerup", stopDrawing);
handwritingCanvas.addEventListener("pointerleave", stopDrawing);

window.addEventListener("resize", resizeCanvas);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

buildPhonicsRound();
buildNumbersRound();
buildShapesRound();
buildColorsRound();
buildHandwritingRound();
resizeCanvas();
