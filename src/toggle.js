module.exports = {
  schema: {
    value: { type: 'int', default: 0 }
  },

  multiple: true,

  init: function () {
    var lever = new THREE.Mesh(new THREE.CylinderGeometry( 0.04, 0.03, 0.1, 15 ), new THREE.MeshLambertMaterial({color: 0xffff00}));
    var track = new THREE.Mesh(new THREE.BoxGeometry(0.07 , 0.021, 0.20 ), new THREE.MeshLambertMaterial({color: 0x333333}));
    var chassis = new THREE.Mesh(new THREE.BoxGeometry( 0.15, 0.02, 0.25 ), new THREE.MeshNormalMaterial());
    lever.position.y = 0.05;

    this.lever = lever;
    chassis.add(track);
    chassis.add(lever);

    this.el.setObject3D('mesh', chassis);

    this.value = this.data.value;

    this.controllers = Array.prototype.slice.call(document.querySelectorAll('a-entity[hand-controls]'));

    this.setValue(this.data.value);
  },

  play: function () {
    this.grabbed = false;
    this.el.addEventListener('rangeout', this.onTriggerUp.bind(this));
    this.controllers.forEach(function (controller){
      controller.addEventListener('triggerdown', this.onTriggerDown.bind(this));
      controller.addEventListener('triggerup', this.onTriggerUp.bind(this));
    }.bind(this));
    this.el.addEventListener('click', this.toggleValue.bind(this));
  },

  pause: function () {
    this.el.removeEventListener('rangeout', this.onTriggerUp.bind(this));
    this.controllers.forEach(function (controller){
      controller.removeEventListener('triggerdown', this.onTriggerDown.bind(this));
      controller.removeEventListener('triggerup', this.onTriggerUp.bind(this));
    }.bind(this));
    this.el.removeEventListener('click', this.toggleValue.bind(this));
  },

  onTriggerDown: function (e) {
    var hand = e.target.object3D;
    var lever = this.lever;

    var handBB = new THREE.Box3().setFromObject(hand);
    var leverBB = new THREE.Box3().setFromObject(lever);
    var collision = handBB.intersectsBox(leverBB);

    if (collision) {
      this.grabbed = hand;
      this.grabbed.visible = false;
    };
  },

  onTriggerUp: function () {
    if (this.grabbed) {
      this.grabbed.visible = true;
      this.grabbed = false;
    }
  },

  setValue: function (value) {
    this.lever.position.z = (value) ? -0.08 : 0.08;
    if (this.value !== value) {
      this.el.emit('change', { value: value });
      this.value = value;
    }
  },

  toggleValue: function () {
    var value = this.value ? 0 : 1;
    this.setValue(value);
  },

  tick: function () {
    var axis = 'z';
    var hand = this.grabbed;
    var lever = this.lever;

    if (this.grabbed) {
      var handWorld = new THREE.Vector3().setFromMatrixPosition(hand.matrixWorld);
      lever.parent.worldToLocal(handWorld);
      lever.position[axis] = handWorld[axis];

      if (Math.abs(lever.position[axis]) > 0.15) {
        this.el.emit('rangeout');
      }
    } else {
      if (Math.sign(lever.position[axis]) === -1) {
        this.setValue(1);
      } else {
        this.setValue(0);
      }
    }
  },

  update: function(old) {
    if(this.data.value !== old.value) {
      this.setValue(this.data.value);
    }
  }
};
