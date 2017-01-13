module.exports = {
  schema: {
    color: { type: 'color', default: '#ffff00' },
    pressedColor: { type: 'color', default: '#FC4007' },
    size: { type: 'number', default: 0.1 },
    topY: { type: 'number', default: 0.02 },
    topDepressY: { type: 'number', default: 0.01 }
  },

  multiple: true,

  init: function () {
    var topMaterial = new THREE.MeshLambertMaterial({color: this.data.color });
    var top = new THREE.Mesh(new THREE.CylinderGeometry( 0.1, 0.1, 0.02, 10 ), topMaterial);
    var bodyMaterial = new THREE.MeshNormalMaterial();
    var body = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.15, 0.02, 10 ), bodyMaterial);

    top.position.y = this.data.topY;
    this.top = top;
    body.add(top);
    this.el.setObject3D('mesh', body);

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
    el.addEventListener('mouseleave', this.onButtonUp.bind(this));
    // motion controls
    el.addEventListener('hit', this.onHit);
    el.addEventListener('touchdown', this.onButtonDown.bind(this));
    el.addEventListener('touchup', this.onButtonUp.bind(this));
  },

  onButtonDown: function() {
    var top = this.top;
    var el = this.el;
    top.position.y = this.data.topY - this.data.topDepressY;
    top.material.color.set(this.data.pressedColor);
    el.emit('buttondown');
  },

  onButtonUp: function() {
    var top = this.top;
    var el = this.el;
    top.position.y = this.data.topY;
    top.material.color.set(this.data.color);
    el.emit('buttonup');
    el.emit('pressed');
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

  update: function() {
    this.el.setAttribute('cursor-listener','');
  },

  tick: function () {
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
