/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * A-Frame Super Useful Button component for A-Frame.
 */
AFRAME.registerComponent('button-momentary', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  play: function () {
    this.el.addEventListener('button-down', this.onButtonDown);
    this.el.addEventListener('button-up', this.onButtonUp);
  }

  pause: function () {
    this.el.addEventListener('button-down', this.onButtonDown);
    this.el.addEventListener('button-up', this.onButtonUp);
  },

  update: function (oldData) {
    this.el.setAttribute('c-button','');
  },


  onButtonDown: function() {
    var depressY = 0.01;
    var topMesh = self.el.components['c-button'].top;
    topMesh.material.color.set(0xff0000);
    topMesh.position.y -= depressY;
  },

  onButtonUp: function() {
    topMesh.material.color.set(0xffff00);
    topMesh.position.y += depressY;
  }

});
