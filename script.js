let index = 0;

/* -----------------------
      DOM CACHE
------------------------*/
const container = document.querySelector(".slider-container");
const slides = Array.from(document.querySelectorAll(".slide"));
const indicatorBox = document.querySelector(".indicators");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const progressBar = document.querySelector(".progress-bar");
const progressFill = progressBar?.querySelector("span");
const sliderStyle = container.dataset.style || "3dslider";

container.classList.add(`style-${sliderStyle}`);

/* FIX: clone slides BEFORE anything deletes them */
const originalSlides = slides.map(s => s.cloneNode(true));

/* Thumbnails container */
let thumbnailsBox = container.querySelector(".thumbnails");

/* -----------------------
      READ SETTINGS
------------------------*/
const orientation =
  container.dataset.orientation === "vertical" ? "vertical" : "horizontal";
const showIndicators = container.dataset.indicators === "true";
const indicatorPosition = container.dataset.indicatorPosition || orientation;

const autoplay = container.dataset.autoplay === "true";
const speed = Number(container.dataset.speed) || 3000;
const enableDrag = container.dataset.drag !== "false";
const enableTouch = container.dataset.touch !== "false";
const showArrows = container.dataset.arrows !== "false";
const showThumbnails = container.dataset.thumbnails === "true";

container.classList.add(orientation);

/* -----------------------
      ARROW ICONS
------------------------*/
prevBtn.textContent = orientation === "vertical" ? "▲" : "⟨";
nextBtn.textContent = orientation === "vertical" ? "▼" : "⟩";

if (!showArrows) {
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
}

/* -----------------------
      INDICATORS
------------------------*/
if (showIndicators) {
  indicatorBox.classList.add(indicatorPosition);

  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
      restartAuto();
    });
    indicatorBox.appendChild(dot);
  });
} else {
  indicatorBox.style.display = "none";
}

function updateIndicators() {
  if (!showIndicators) return;
  const dots = indicatorBox.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("active", i === index);
  }
}

/* -----------------------
      THUMBNAILS
------------------------*/
const thumbnails = [];
const thumbnailOrientation =
  container.dataset.thumbnailOrientation === "vertical"
    ? "vertical"
    : "horizontal";

if (showThumbnails) {
  if (!thumbnailsBox) {
    thumbnailsBox = document.createElement("div");
    thumbnailsBox.className = "thumbnails";
    container.appendChild(thumbnailsBox);
  }
  thumbnailsBox.classList.add(thumbnailOrientation);

  slides.forEach((slide, i) => {
    const img = slide.querySelector("img");
    if (!img) return;

    const thumb = document.createElement("div");
    thumb.className = "thumbnail" + (i === 0 ? " active" : "");

    const thumbImg = document.createElement("img");
    thumbImg.src = img.src;
    thumb.appendChild(thumbImg);

    thumb.addEventListener("click", () => {
      index = i;
      updateSlider();
      restartAuto();
    });

    thumbnailsBox.appendChild(thumb);
    thumbnails.push(thumb);
  });
} else if (thumbnailsBox) {
  thumbnailsBox.style.display = "none";
}

function updateThumbnails() {
  if (!showThumbnails) return;
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
}

/* ------------------------------------------------
      LOGOSLIDER (MULTIPLE ROWS/COLUMNS MARQUEE)
--------------------------------------------------*/
if (sliderStyle === "logoslider") {
  const sliderEl = container.querySelector(".slider");
  const isVertical = orientation === "vertical";
  const directionMode = container.dataset.direction || "same";
  
  // Get number of rows/columns from attributes
  const rows = Number(container.dataset.rows) || 1;
  const columns = Number(container.dataset.columns) || 1;
  
  // Determine number of groups based on orientation
  const groups = isVertical ? columns : rows;

  // CLEAR CONTENT
  sliderEl.innerHTML = "";

  // CREATE TRACK
  const track = document.createElement("div");
  track.className = "logo-track";
  sliderEl.appendChild(track);

  // Wait for images to load before calculating and duplicating
  const imgs = [...container.querySelectorAll("img")];
  const loadPromises = imgs.length > 0 
    ? imgs.map((img) =>
        img.complete ? Promise.resolve() : new Promise((res) => (img.onload = res))
      )
    : [Promise.resolve()];

  Promise.all(loadPromises).then(() => {
    // CREATE MULTIPLE MARQUEE ELEMENTS (ROWS OR COLUMNS)
    const groupEls = [];
    
    for (let g = 0; g < groups; g++) {
      const groupEl = document.createElement("div");
      groupEl.className = isVertical ? "logo-col" : "logo-row";
      
      // Distribute slides across groups
      originalSlides.forEach((slide, i) => {
        if (i % groups === g) {
          groupEl.appendChild(slide.cloneNode(true));
        }
      });

      // Duplicate for seamless loop
      Array.from(groupEl.children).forEach((cl) =>
        groupEl.appendChild(cl.cloneNode(true))
      );

      track.appendChild(groupEl);
      groupEls.push(groupEl);
    }

    // Wait a bit for DOM to update
    setTimeout(() => {
      // Duplicate each group until seamless
      groupEls.forEach((groupEl, g) => {
        // Force a reflow to ensure dimensions are calculated
        void groupEl.offsetHeight;

        // Duplicate until seamless - need at least 2x viewport size
        const minSize = isVertical
          ? container.clientHeight * 2
          : container.clientWidth * 2;

        // Keep cloning until group ≥ 2× viewport
        let iterations = 0;
        while (
          (isVertical ? groupEl.scrollHeight : groupEl.scrollWidth) < minSize &&
          iterations < 20 // Safety limit
        ) {
          // Clone the original slides that belong to this group
          originalSlides.forEach((slide, i) => {
            if (i % groups === g) {
              groupEl.appendChild(slide.cloneNode(true));
            }
          });
          iterations++;
          // Force reflow
          void groupEl.offsetHeight;
        }
      });

      // Apply animation to each group
      groupEls.forEach((groupEl, g) => {
        // Determine direction: same = all same direction, alternate = alternate directions
        let reverse = false;
        if (directionMode === "alternate") {
          reverse = g % 2 === 1; // Alternate rows/columns go opposite direction
        }

        if (!isVertical) {
          // Horizontal: left (default) or right (reverse)
          groupEl.style.animationName = reverse ? "marqueeRight" : "marqueeLeft";
        } else {
          // Vertical: up (bottom to top, default) or down (top to bottom, reverse)
          groupEl.style.animationName = reverse ? "marqueeDown" : "marqueeUp";
        }

        groupEl.style.animationDuration = speed + "ms";
        groupEl.style.animationTimingFunction = "linear";
        groupEl.style.animationIterationCount = "infinite";
      });
    }, 50);
  });
}

/* -----------------------
      MAIN SLIDER UPDATE
------------------------*/
function updateSlider() {
  const len = slides.length;
  const prevIndex = (index - 1 + len) % len;
  const nextIndex = (index + 1) % len;

  /* FADE SLIDER */
  if (sliderStyle === "fadeslider") {
    slides.forEach((slide, i) => {
      slide.className = "slide";
      if (i === index) slide.classList.add("active");
    });
    updateIndicators();
    updateThumbnails();
    return;
  }

  /* 2D SLIDER */
  if (sliderStyle === "2dslider") {
    slides.forEach(slide => (slide.className = "slide"));
    slides[index].classList.add("active");

    const prevIndex = (index - 1 + len) % len;
    const nextIndex = (index + 1) % len;

    slides[nextIndex].classList.add("right");
    slides[prevIndex].classList.add("left");

    updateIndicators();
    updateThumbnails();
    return;
  }

  /* 3D SLIDER (DEFAULT) */
  slides.forEach((slide, i) => {
    slide.className = "slide";

    if (i === index) slide.classList.add("active");
    else if (i === prevIndex)
      slide.classList.add(orientation === "horizontal" ? "left" : "up");
    else if (i === nextIndex)
      slide.classList.add(orientation === "horizontal" ? "right" : "down");
  });

  updateIndicators();
  updateThumbnails();

  /** COUNTER **/
  counterNumber.textContent = index + 1;
}

/* -----------------------
      BUTTON EVENTS
------------------------*/
nextBtn.onclick = () => {
  index = (index + 1) % slides.length;
  updateSlider();
  restartAuto();
  resetCounter();
};

prevBtn.onclick = () => {
  index = (index - 1 + slides.length) % slides.length;
  updateSlider();
  restartAuto();
  resetCounter();
};

/* -----------------------
      AUTOPLAY
------------------------*/
let interval;

const showProgressBar = container.dataset.progressbar !== "false";
if (!showProgressBar) progressBar.classList.add("hide");

function resetProgress() {
  if (!autoplay || !showProgressBar) return;

  progressFill.style.transition = "none";
  progressFill.style.width = "0%";
  progressFill.offsetWidth;

  progressFill.style.transition = `width ${speed}ms linear`;
  progressFill.style.width = "100%";
}

function startAuto() {
  if (!autoplay) return;
  stopAuto();

  if (showProgressBar) progressBar.classList.remove("hide");
  resetProgress();

  interval = setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
    resetProgress();
    resetCounter();
  }, speed);
}

function stopAuto() {
  clearInterval(interval);
  if (progressFill) progressFill.style.transition = "none";
}

function restartAuto() {
  stopAuto();
  startAuto();
}

window.addEventListener("load", () => {
  updateSlider();
  setTimeout(startAuto, 50);
});

container.addEventListener("mouseenter", stopAuto);
container.addEventListener("mouseleave", startAuto);

/* -----------------------
      DRAG / SWIPE
------------------------*/
const SWIPE_THRESHOLD = 60;
let startPos = 0;
let isDragging = false;

const getPos = (e) => {
  const p = e.touches ? e.touches[0] || e.changedTouches[0] : e;
  return orientation === "horizontal" ? p.clientX : p.clientY;
};

function pointerDown(pos) {
  startPos = pos;
  isDragging = true;
  stopAuto();
}

function pointerMove(pos) {
  if (!isDragging) return;

  const diff = pos - startPos;

  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    diff > 0 ? prevBtn.click() : nextBtn.click();
    isDragging = false;
  }
}

function pointerUp() {
  if (isDragging) startAuto();
  isDragging = false;
}

if (enableDrag) {
  container.addEventListener("mousedown", (e) => pointerDown(getPos(e)));
  container.addEventListener("mousemove", (e) => pointerMove(getPos(e)));
  window.addEventListener("mouseup", pointerUp);
}

if (enableTouch) {
  container.addEventListener("touchstart", (e) => pointerDown(getPos(e)), {
    passive: true,
  });
  container.addEventListener("touchmove", (e) => pointerMove(getPos(e)), {
    passive: true,
  });
  container.addEventListener("touchend", pointerUp);
}

/* -------------------------
   COUNTER PROGRESSBAR
----------------------------*/
const counterEnabled = container.dataset.counterProgressbar === "true";
const counterBox = document.getElementById("counterProgress");
const counterNumber = document.getElementById("counterNumber");

if (!counterEnabled) counterBox.classList.add("hidden");

let counterInterval = null;

function startCounterProgress() {
  if (!counterEnabled || !autoplay) return;

  clearInterval(counterInterval);
  let start = Date.now();

  counterInterval = setInterval(() => {
    let elapsed = Date.now() - start;
    let percent = Math.min(elapsed / speed, 1);
    let deg = percent * 360;

    counterBox.style.background = `conic-gradient(#fff ${deg}deg, rgba(255,255,255,0.2) 0deg)`;

    if (percent >= 1) clearInterval(counterInterval);

  }, 16);
}

function resetCounter() {
  if (!counterEnabled) return;

  counterBox.style.background =
    "conic-gradient(#fff 0deg, rgba(255,255,255,0.2) 0deg)";

  counterNumber.textContent = index + 1;

  startCounterProgress();
}
