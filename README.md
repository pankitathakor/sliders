# sliders
A fully configurable, multi-style slider controlled through simple HTML attributes. Supports 3D, 2D, fade, fullscreen, and logo marquee styles with autoplay, drag/swipe, indicators, and thumbnails. Responsive, flexible, and requires no JS changes to switch styles.



# Slider Component Documentation
A Multi-Style, Attribute-Driven Carousel System

## 1. Introduction
This slider system is a flexible, reusable, and fully configurable carousel built using HTML data attributes. 
You can switch between different slider styles without editing JavaScript—simply update the attributes.

Supported Styles:
- 3dslider
- 2dslider
- fadeslider
- fullslider
- logoslider

Core Features:
- Autoplay with progress bar
- Drag & touch swipe support
- Indicators (dots / bars)
- Thumbnails (horizontal/vertical)
- Counter progress display
- Multi-row marquee/loop logo slider
- Fully responsive
- Attribute-driven configuration

## 2. Base HTML Structure
<div class="slider-container" data-style="3dslider">
  <div class="slider">
    <div class="slide active">...</div>
    <div class="slide">...</div>
  </div>
  <button class="btn prev">⟨</button>
  <button class="btn next">⟩</button>
  <div class="indicators"></div>
  <div class="progress-bar"><span></span></div>
  <div class="counter-progress"><div class="counter-inner"><span></span></div></div>
  <div class="thumbnails"></div>
</div>

## 3. Data Attributes Reference

### Core Behavior
- data-style
- data-orientation
- data-autoplay
- data-speed
- data-direction

### Navigation & Indicators
- data-arrows
- data-indicators
- data-indicator-position
- data-progressbar
- data-counter-progressbar

### Thumbnails
- data-thumbnails
- data-thumbnail-orientation

### Drag / Touch
- data-drag
- data-touch

### Logo Slider Layout
- data-rows
- data-columns

## 4. Slider Style Behaviors
### 3D Slider
Uses translateZ, rotateY/rotateX, angled neighbor slides.

### 2D Slider
Classic sliding like Bootstrap.

### Fade Slider
Opacity-based transitions.

### Fullscreen Slider
Fills the entire viewport.

### Logo Slider (Marquee)
Infinite looping animation with optional rows/columns.

## 5. Usage Examples
### 3D Slider
<div class="slider-container" data-style="3dslider" data-autoplay="true"></div>

### 2D Slider
<div class="slider-container" data-style="2dslider" data-arrows="true"></div>

### Fade Slider
<div class="slider-container" data-style="fadeslider" data-autoplay="true"></div>

### Fullscreen Slider
<div class="slider-container" data-style="fullslider"></div>

### Logo Slider
<div class="slider-container" data-style="logoslider" data-rows="2" data-columns="6"></div>

## 6. Responsiveness Notes
- Slides scale with container width
- Touch gestures override autoplay
- Vertical/horizontal UI adapts based on orientation

## 7. Future Improvements
- Keyboard navigation
- ARIA accessibility labels
- Lazy-loading images
- Slider lifecycle events
- Loop disable option

## 8. Summary
A powerful, flexible, fully attribute-driven slider system supporting multiple visual styles and advanced UI features.

