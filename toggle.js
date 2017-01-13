module.exports = {
  schema: {},

  multiple: true,

  init: function () {
    var lever = new THREE.Mesh(new THREE.CylinderGeometry( 0.04, 0.03, 0.1 ), new THREE.MeshLambertMaterial({color: 0xffff00}));
    var track = new THREE.Mesh(new THREE.BoxGeometry(0.07 , 0.021, 0.20 ), new THREE.MeshLambertMaterial({color: 0x333333}));
    var chassis = new THREE.Mesh(new THREE.BoxGeometry( 0.15, 0.02, 0.25 ), new THREE.MeshNormalMaterial());
    lever.position.y = 0.05;

    this.lever = lever;
    chassis.add(track);
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

  tick: function() {
    var axis = 'z';

    var hand = this.grabbed;

    var lever = this.lever;

    if (this.grabbed) {
      var handWorld = new THREE.Vector3().setFromMatrixPosition(hand.matrixWorld);

      lever.parent.worldToLocal(handWorld);

      lever.position[axis] = handWorld[axis];

      var leverAxisPosition = lever.position[axis];
    } else {
      lever.position[axis] = Math.sign(lever.position[axis]) === -1 ? -0.08 : 0.08;
    }
  }
};
