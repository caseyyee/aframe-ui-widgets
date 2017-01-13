## UI widgets for [A-Frame](https://aframe.io).

Compatible with HTC VIVE and Oculus touch.


### Installation

Include component script into your project along with A-Frame.

````html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://rawgit.com/caseyyee/aframe-ui-widgets/master/dist/ui-widgets.min.js"></script>
</head>
````


### Usage

#### Button

````html
<a-scene>
  <a-entity ui-button></a-entity>
</a-scene>
````

#### Toggle switch

````html
<a-scene>
  <a-entity ui-toggle></a-entity>
</a-scene>
````

#### Slider

````html
<a-scene>
  <a-entity ui-slider></a-entity>
</a-scene>
````

#### Rotary Knob

````html
<a-scene>
  <a-entity ui-rotary></a-entity>
</a-scene>
````

#### npm

Install via npm:

```bash
npm install aframe-ui-widgets
```

Then require and use.

```js
require('aframe');
require('aframe-ui-widgets');
```
