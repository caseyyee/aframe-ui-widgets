module.exports = {
  schema: {},

  multiple: true,

  init: function () {
    var lever = new THREE.Mesh(new THREE.BoxGeometry( 0.04, 0.05, 0.08 ), new THREE.MeshLambertMaterial({color: 0xffff00}));
    var track = new THREE.Mesh(new THREE.BoxGeometry( 0.48, 0.021, 0.01 ), new THREE.MeshLambertMaterial({color: 0x333333}));
    var chassis = new THREE.Mesh(new THREE.BoxGeometry( 0.5, 0.02, 0.15 ), new THREE.MeshNormalMaterial());
    lever.position.y = 0.025;

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
    if (this.grabbed) {
      var hand = this.grabbed;

      var handWorld = new THREE.Vector3().setFromMatrixPosition(hand.matrixWorld);

      this.lever.parent.worldToLocal(handWorld);

      this.lever.position.x = handWorld.x;
    }
  }
};
