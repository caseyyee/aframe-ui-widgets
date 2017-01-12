module.exports = {
  schema: {},

  multiple: true,

  init: function () {
    var top = new THREE.Mesh(new THREE.CylinderGeometry( 0.1, 0.1, 0.02, 10 ), new THREE.MeshLambertMaterial({color: 0xffff00}));
    this.top = top;
    var chassis = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.15, 0.02, 10 ), new THREE.MeshNormalMaterial());

    top.position.y = 0.02;

    chassis.add(top);

    this.el.setObject3D('mesh', chassis);

    this.controllers = Array.prototype.slice.call(document.querySelectorAll('a-entity[hand-controls]'));
  },



  play: function () {

    this.el.addEventListener('hit', this.onHit);

    this.el.addEventListener('mousedown', this.onButtonDown.bind(this));

    this.el.addEventListener('mouseup', this.onButtonUp.bind(this));

    this.el.addEventListener('buttondown', this.onButtonDown.bind(this));

    this.el.addEventListener('buttonup', this.onButtonUp.bind(this));
  },

  onButtonDown: function() {
    this.top.position.y = 0.01;
    this.top.material.color.set(0xff0000);
  },

  onButtonUp: function() {
    this.top.position.y = 0.015;
    this.top.material.color.set(0xffff00);
  },

  onHit: function (evt) {
    var pressed = false;

    var interval;
    var threshold = 30;
    var lastTime = 0;

    var self = this;

    if (!pressed) {
      pressed = true;

      self.emit('buttondown');

      interval = setInterval(function() {
        var delta = performance.now() - lastTime;
        if (delta > threshold) {
          pressed = false;
          lastTime = null;
          clearInterval(interval);
          self.emit('buttonup');
          self.emit('buttonpressed');
        }
      }, threshold);
    }

    lastTime = performance.now();
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
