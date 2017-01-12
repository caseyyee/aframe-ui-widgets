module.exports = {
  schema: {},

  multiple: true,

  init: function () {
    var lever = new THREE.Mesh(new THREE.BoxGeometry( 0.04, 0.05, 0.1 ), new THREE.MeshLambertMaterial({color: 0xffff00}));
    var chassis = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.15, 0.02, 10 ), new THREE.MeshNormalMaterial());

    this.lever = lever;
    lever.position.y = 0.025;

    chassis.add(lever);

    this.el.setObject3D('mesh', chassis);
  },



  play: function () {
    var self = this;
    var controllers = Array.prototype.slice.call(document.querySelectorAll('a-entity[hand-controls]'));
    self.grabbed = false;

    controllers.forEach(function(controller){
      controller.addEventListener('triggerdown', function(evt) {
        var hand = evt.target.object3D;
        var lever = self.lever;

        var handBB = new THREE.Box3().setFromObject(hand);
        var leverBB = new THREE.Box3().setFromObject(lever);
        var collision = handBB.intersectsBox(leverBB);

        if (collision) {
          self.grabbed = hand;
          self.grabbed.visible = false;
        };
      });

      controller.addEventListener('triggerup', function() {
        if (self.grabbed) {
          self.grabbed.visible = true;
          self.grabbed = false;
        }
      });
    });
  },

  tick: function () {

    if (this.grabbed) {

      var hand = this.grabbed;

      var axis = 'z';
      if (!this.lastRotation) {
        this.lastRotation = hand.rotation[axis];
      }

      var relative = hand.rotation[axis];
      this.lever.rotation.y += relative - this.lastRotation;

      this.lastRotation = relative;

    }
  }
};
