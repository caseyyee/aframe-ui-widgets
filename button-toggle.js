/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * A-Frame Super Useful Button component for A-Frame.
 */
AFRAME.registerComponent('button-toggle', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
  },

  play: function () {
    var depressY = 0.01;
    var self = this;
    var topMesh = self.el.components['c-button'].top;

    var on = false;
    this.el.addEventListener('button-down', function() {
      topMesh.position.y -= depressY;
    });

    this.el.addEventListener('button-up', function() {
      topMesh.position.y += depressY;
    });

    this.el.addEventListener('button-press', function() {
      if (!on) {
        on = true;
        topMesh.material.color.set(0xff0000);
        self.el.emit('button-on');
      } else {
        topMesh.material.color.set(0xffff00);
        self.el.emit('button-off');
        on = false;
      }
    });
  },

  update: function (oldData) {
    this.el.setAttribute('c-button','');
  },


});
