module.exports = {
  schema: {},

  multiple: true,

  init: function () {
    var indicator = new THREE.Mesh(new THREE.BoxGeometry( 0.02, 0.08, 0.06 ), new THREE.MeshLambertMaterial({color: 0xff3333}))
    indicator.position.z = -0.08;
    indicator.position.y = 0.02;
    var knob = new THREE.Mesh(new THREE.CylinderGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshLambertMaterial({color: 0x666666}));
    knob.add(indicator);
    var chassis = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.15, 0.02, 10 ), new THREE.MeshNormalMaterial());

    this.knob = knob;
    knob.position.y = 0.025;

    chassis.add(knob);

    this.el.setObject3D('mesh', chassis);
  },



  play: function () {
    var self = this;
    var controllers = Array.prototype.slice.call(document.querySelectorAll('a-entity[hand-controls]'));
    self.grabbed = false;

    controllers.forEach(function(controller){
      controller.addEventListener('triggerdown', function(evt) {
        var hand = evt.target.object3D;
        var knob = self.knob;

        var handBB = new THREE.Box3().setFromObject(hand);
        var knobBB = new THREE.Box3().setFromObject(knob);
        var collision = handBB.intersectsBox(knobBB);

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
      var axis = 'z';
      var handRotation = this.grabbed.rotation[axis];
      var deltaChange = !this.lastRotation ? 0 : handRotation - this.lastRotation;
      this.knob.rotation.y += deltaChange;
      this.lastRotation = handRotation;
    } else {
      this.lastRotation = 0;
    }
  }
};
