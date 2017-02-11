module.exports = {
  schema: {
    size: { type: 'number', default: 0.1 },
    color: { type: 'color', default: '#ffff00' },
    pressedColor: { type: 'color', default: '#FC4007' },
    topDepressY: { type: 'number', default: 0.01 },
    base: { type: 'array', default: []},    /* specify mixin for button base */
    top: { type: 'array', default: []},     /* specify mixin for button top */
    pressed: {type: 'array', default: []}   /* add mixin for button when pressed */
  },

  multiple: true,

  init: function () {
    var self = this;
    var top = document.createElement('a-entity');
    top.setAttribute('mixin', this.data.top.join(' '));
    top.addEventListener('loaded', function() {
      self.topOrigin = top.getAttribute('position');
    });
    this.top = top;
    this.el.appendChild(top);

    var base = document.createElement('a-entity');
    base.setAttribute('mixin', this.data.base.join(' '));
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
    top.setAttribute('position',{ x: 0, y: this.topOrigin.y - this.data.topDepressY, z: 0});
    top.setAttribute('mixin', this.data.top.join(' ') + ' ' + this.data.pressed.join(' '));
    this.pressed = true;
    el.emit('buttondown');
  },

  resetButton: function() {
    var top = this.top;
    top.setAttribute('position',{ x: 0, y: this.topOrigin.y, z: 0});
    top.setAttribute('mixin', this.data.top.join(' '));
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
    var topBB = new THREE.Box3().setFromObject(this.top.getObject3D('mesh'));
    var self = this;
    this.controllers.forEach(function(controller) {
      var controllerBB = new THREE.Box3().setFromObject(controller.object3D);
      var collision = topBB.intersectsBox(controllerBB);

      if (collision) {
        self.el.emit('hit');
      }
    });
  }
};
