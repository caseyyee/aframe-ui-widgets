## UI widgets for [A-Frame](https://aframe.io).

### [Give it a whirl!](https://caseyyee.github.io/aframe-ui-widgets/examples/)

![A-Frame UI Widgets](https://raw.githubusercontent.com/caseyyee/aframe-ui-widgets/master/img/preview.gif)

Works with HTC VIVE and Oculus touch in a WebVR enabled browser.


### Basic usage

````html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>

  <!-- Include component script into your project along with A-Frame. -->
  <script src="https://rawgit.com/caseyyee/aframe-ui-widgets/master/dist/ui-widgets.min.js"></script>
</head>

<body>
  <a-scene>
    <!-- Adds hand controls -->
    <a-entity hand-controls="left"></a-entity>
    <a-entity hand-controls="right"></a-entity>

    <!-- Can also be controlled used with cursor -->
    <a-camera>
      <a-cursor></a-cursor>
    </a-camera>

    <!-- Adds UI button widget -->
    <a-entity id="mybutton" ui-button></a-entity>
  </a-scene>
  <script>
  var mybutton = document.querySelector('#mybutton');
  mybutton.addEventListener('pressed', function () {
    // do stuff here.
  });
  </script>
</body>


````

### UI Components

#### Button

````html
<a-entity ui-button></a-entity>
````

##### Events
| Event         | Description
| ------------- | -------------
| buttondown | Emitted when button is pushed down.
| buttonup | Emitted when button is released.
| pressed | Emitted when button has been has been pushed down and released.


#### Toggle switch

````html
<a-entity ui-toggle></a-entity>
````

##### Properties
| Property      | Description   | Default Value
| ------------- | ------------- | -------------
| value | sets toggle position. | 0

#### Events
| Event         | Description
| ------------- | -------------
| change | Emitted when switch has been toggled.



#### Slider

````html
<a-entity ui-slider></a-entity>
````

##### Properties
| Property         | Description
| ------------- | -------------
| min | sets minimum value | 0
| max | sets maximum value | 1
| value | sets value | 0

##### Change
| Event         | Description
| ------------- | -------------
| change | Emitted when slider has been moved.


#### Rotary Knob

````html
<a-entity ui-rotary></a-entity>
````

##### Events
| Event         | Description
| ------------- | -------------
| change | Emitted when rotary has been turned.


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
