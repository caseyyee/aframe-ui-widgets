window.AFRAME = require('aframe');

AFRAME.registerComponent('button', require('./button'));

AFRAME.registerComponent('slider', require('./slider'));

AFRAME.registerComponent('dial', require('./dial'));

// helpers
AFRAME.registerComponent('arrows', {
  play: function () {
    this.el.object3D.add(new THREE.AxisHelper( 0.4 ));
  }
});