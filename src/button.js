module.exports = {
  schema: {
    size: { type: 'number', default: 0.1 },
    color: { type: 'color', default: '#ffff00' },
    pressedColor: { type: 'color', default: '#FC4007' },
    topY: { type: 'number', default: 0.02 },
    topDepressY: { type: 'number', default: 0.01 },
    base: { type: 'string', default: ''},
    top: { type: 'string', default: ''}
  },

  multiple: true,

  init: function () {
    var top = document.createElement('a-entity');
    top.setAttribute('mixin', this.data.top);
    this.el.appendChild(top);

    var body = document.createElement('a-entity');
    body.setAttribute('mixin', this.data.body);
    this.el.appendChild(body);

    // set button top proud of body.
    top.setAttribute('position',{ x: 0, y: this.data.topY, z: 0});
    this.top = top;

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
    top.setAttribute('position',{ x: 0, y: this.data.topY - this.data.topDepressY, z: 0});
    top.setAttribute('mixin', this.data.top + ' ' + this.data.pressed);
    this.pressed = true;
    el.emit('buttondown');
  },

  resetButton: function() {
    var top = this.top;
    top.setAttribute('position',{ x: 0, y: this.data.topY, z: 0});
    top.setAttribute('mixin', this.data.top);
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
    return;
    var topBB = new THREE.Box3().setFromObject(this.top);
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
