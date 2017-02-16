module.exports = {
  schema: {
    size: { type: 'number', default: 0.1 },
    color: { type: 'color', default: '#960960' },
    pressedColor: { type: 'color', default: '#FC2907' },
    baseColor: {type: 'color', default: '#618EFF'},
    topY: { type: 'number', default: 0.02 },
    pressedY: { type: 'number', default: 0.012 },
    base: { type: 'array' },    /* specify mixin for button base */
    top: { type: 'array' },     /* specify mixin for button top */
    pressed: {type: 'array' }   /* add mixin for button when pressed */
  },

  multiple: true,

  init: function () {
    var self = this;
    var top = document.createElement('a-entity');
    if (this.data.top.length > 0) {
      top.setAttribute('mixin', this.data.top.join(' '));
    } else {
      // default style
      top.setAttribute('geometry', {
        primitive: 'cylinder',
        radius: 0.1,
        height: 0.025,
        segmentsHeight: 1
      });
      top.setAttribute('position', { x: 0, y: this.data.topY, z: 0 });
      top.setAttribute('material', { color: this.data.color });
    }
    this.top = top;
    this.el.appendChild(top);

    var base = document.createElement('a-entity');
    if (this.data.base.length > 0) {
      base.setAttribute('mixin', this.data.base.join(' '));
    } else {
      // default style
      base.setAttribute('geometry', {
        primitive: 'cone',
        radiusTop: 0.12,
        radiusBottom: 0.15,
        height: 0.02,
        segmentsHeight: 1
      });
      base.setAttribute('material', { color: this.data.baseColor });
    }
    this.el.appendChild(base);

    var controllers = document.querySelectorAll('a-entity[hand-controls]');
    this.controllers = Array.prototype.slice.call(controllers);

    this.pressed = false;
    this.interval = null;
    this.lastTime = 0;
  },

  play: function () {
    var el = this.el;
    // cursor controls
    el.addEventListener('mousedown', this.onButtonDown.bind(this));
    el.addEventListener('mouseup', this.onButtonUp.bind(this));
    el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    // motion controls
    el.addEventListener('hit', this.onHit);
    el.addEventListener('touchdown', this.onButtonDown.bind(this));
    el.addEventListener('touchup', this.onButtonUp.bind(this));
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('mousedown', this.onButtonDown.bind(this));
    el.removeEventListener('mouseup', this.onButtonUp.bind(this));
    el.removeEventListener('mouseleave', this.onButtonUp.bind(this));
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('touchdown', this.onButtonDown.bind(this));
    el.removeEventListener('touchup', this.onButtonUp.bind(this));
  },

  onButtonDown: function () {
    var top = this.top;
    var el = this.el;
    if (this.data.top.length > 0 && this.data.pressed.length > 0) {
      var mixin = this.data.top.join(' ') + ' ' + this.data.pressed.join(' ');
      top.setAttribute('mixin', mixin);
    } else {
      top.setAttribute('position',{ x: 0, y: this.data.pressedY, z: 0 });
      top.setAttribute('material', { color: this.data.pressedColor });
    }
    this.pressed = true;
    el.emit('buttondown');
  },

  resetButton: function() {
    var top = this.top;
    // top.setAttribute('position',{ x: 0, y: this.topOrigin.y, z: 0});
    if (this.data.top.length > 0) {
      var mixin = this.data.top.join(' ');
      top.setAttribute('mixin', mixin);
    } else {
      top.setAttribute('position', { x: 0, y: this.data.topY, z: 0 });
      top.setAttribute('material', { color: this.data.color });
    }
  },

  onButtonUp: function (e) {
    if (this.pressed) {
      var el = this.el;
      this.resetButton();
      this.pressed = false;
      el.emit('buttonup');
      el.emit('pressed');
    }
  },

  onMouseLeave: function() {
    if (this.pressed) {
      this.resetButton();
      this.pressed = false;
    }
  },

  // handles hand controller collisions
  onHit: function (evt) {
    var threshold = 30;
    if (!this.pressed) {
      this.pressed = true;
      this.emit('touchdown');
      var self = this;
      this.interval = setInterval(function() {
        var delta = performance.now() - self.lastTime;
        if (delta > threshold) {
          self.pressed = false;
          self.lastTime = 0;
          self.emit('touchup');
          clearInterval(self.interval);
        }
      }, threshold);
    }
    this.lastTime = performance.now();
  },

  update: function () {
    this.el.setAttribute('cursor-listener','');
  },

  tick: function () {
    var self = this;
    var mesh = this.top.getObject3D('mesh');
    if (!mesh) {
      console.log('no mesh!');
      return
    }
    var topBB = new THREE.Box3().setFromObject(mesh);
    this.controllers.forEach(function(controller) {
      var controllerBB = new THREE.Box3().setFromObject(controller.object3D);
      var collision = topBB.intersectsBox(controllerBB);

      if (collision) {
        self.el.emit('hit');
      }
    });
  }
};
