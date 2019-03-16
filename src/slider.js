module.exports = {
  schema: {
    color: { type: 'color', default: '#ffff00' },
    size: { type: 'number', default: 0.5 },
    min: { type: 'number', default: 0 },
    max: { type: 'number', default: 1 },
    value: { type: 'number', default: 0 },
    innerSize: { type: 'number', default: 0.9 }
  },

  multiple: true,

  init: function () {
    var leverMaterial = new THREE.MeshLambertMaterial({color: this.data.color });
    var lever = new THREE.Mesh(new THREE.BoxGeometry( 0.04, 0.05, 0.08 ), leverMaterial);
    var track = new THREE.Mesh(new THREE.BoxGeometry( (this.data.size * this.data.innerSize), 0.021, 0.01 ), new THREE.MeshLambertMaterial({color: 0x333333}));
    var chassis = new THREE.Mesh(new THREE.BoxGeometry( this.data.size, 0.02, 0.15 ), new THREE.MeshNormalMaterial());
    lever.position.y = 0.025;

    this.lever = lever;
    chassis.add(track);
    chassis.add(lever);

    this.el.setObject3D('mesh', chassis);

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
  },

  pause: function () {
    this.el.removeEventListener('rangeout', this.onTriggerUp.bind(this));
    this.controllers.forEach(function (controller){
      controller.removeEventListener('triggerdown', this.onTriggerDown.bind(this));
      controller.removeEventListener('triggerup', this.onTriggerUp.bind(this));
    }.bind(this));
  },

  onTriggerDown: function(e) {
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

  onTriggerUp: function() {
    if (this.grabbed) {
      this.grabbed.visible = true;
      this.grabbed = false;
    }
  },

  setValue: function(value) {
    var lever = this.lever;
    if (value < this.data.min) {
      value = this.data.min;
    } else if (value > this.data.max) {
      value = this.data.max;
    }

    var sliderRange = this.data.size * this.data.innerSize;

    lever.position.x = ((value / this.data.max) * sliderRange) - (sliderRange / 2);
  },

  tick: function() {
    if (this.grabbed) {
      var hand = this.grabbed;
      var lever = this.lever;
      var sliderSize = this.data.size;
      var sliderRange = (sliderSize * this.data.innerSize) / 2;

      var handWorld = new THREE.Vector3().setFromMatrixPosition(hand.matrixWorld);
      lever.parent.worldToLocal(handWorld);
      lever.position.x = handWorld.x;

      if (Math.abs(lever.position.x) > (sliderSize / 2)) {
        lever.position.x = sliderRange * Math.sign(lever.position.x);
        this.el.emit('rangeout');
      }

      var value = ((lever.position.x + sliderRange) * (this.data.max / (sliderSize * this.data.innerSize))) + this.data.min;

      if (this.value !== value) {
        this.el.emit('change', { value: value });
        this.value = value;
      }
    }
  },

  update: function(old) {
    if(this.data.value !== old.value) {
      this.setValue(this.data.value);
    }
  }
};
