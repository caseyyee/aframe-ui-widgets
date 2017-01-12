##

A set of Button Controls for [A-Frame](https://aframe.io).

* Works with hand-controls component (for HTC VIVE and Oculus Touch compatibility)


### Installation

Include component script into your project along with A-Frame.

````html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://rawgit.com/caseyyee/aframe-su-button/master/dist/buttons.min.js"></script>
</head>
````


### Usage

#### Basic button

Usage

````html
<a-scene>
  <a-entity button></a-entity>
</a-scene>
````

| Event          | Description
| -------------  | -----------
| button-down    | Button is pressed.
| button-up      | Button is released.
| button-pressed | Button has been pressed and released.


#### Toggle button

````html
<a-scene>
  <a-entity button-toggle></a-entity>
</a-scene>
````

| Event          | Description
| -------------  | -----------
| toggled        | Button has been toggled on or off.


#### npm

Install via npm:

```bash
npm install aframe-buttons
```

Then require and use.

```js
require('aframe');
require('aframe-buttons');
```
