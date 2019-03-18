(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// require('aframe');
// require('aframe-dev-components');
require('../index.js');

},{"../index.js":2}],2:[function(require,module,exports){
// window.AFRAME = require('aframe');

AFRAME.registerComponent('ui-button', require('./src/button'));

AFRAME.registerComponent('ui-toggle', require('./src/toggle'));

AFRAME.registerComponent('ui-slider', require('./src/slider'));

AFRAME.registerComponent('ui-rotary', require('./src/rotary'));

},{"./src/button":3,"./src/rotary":4,"./src/slider":5,"./src/toggle":6}],3:[function(require,module,exports){
module.exports = {
  schema: {
    size: { type: 'number', default: 0.1 },
    color: { type: 'color', default: '#960960' },
    pressedColor: { type: 'color', default: '#FC2907' },
    baseColor: {type: 'color', default: '#618EFF'},
    topY: { type: 'number', default: 0.02 },
    pressedY: { type: 'number', default: 0.012 },
    base: { type: 'array' },    /* specify mixin for button base */
    top: { type: 'array' },     /* specify mixin for button top */
    pressed: {type: 'array' }   /* add mixin for button when pressed */
  },

  multiple: true,

  init: function () {
    var self = this;
    var top = document.createElement('a-entity');
    if (this.data.top.length > 0) {
      top.setAttribute('mixin', this.data.top.join(' '));
    } else {
      // default style
      top.setAttribute('geometry', {
        primitive: 'cylinder',
        radius: 0.1,
        height: 0.025,
        segmentsHeight: 1
      });
      top.setAttribute('position', { x: 0, y: this.data.topY, z: 0 });
      top.setAttribute('material', { color: this.data.color });
    }
    this.top = top;
    this.el.appendChild(top);

    var base = document.createElement('a-entity');
    if (this.data.base.length > 0) {
      base.setAttribute('mixin', this.data.base.join(' '));
    } else {
      // default style
      base.setAttribute('geometry', {
        primitive: 'cone',
        radiusTop: 0.12,
        radiusBottom: 0.15,
        height: 0.02,
        segmentsHeight: 1
      });
      base.setAttribute('material', { color: this.data.baseColor });
    }
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
    if (this.data.top.length > 0 && this.data.pressed.length > 0) {
      var mixin = this.data.top.join(' ') + ' ' + this.data.pressed.join(' ');
      top.setAttribute('mixin', mixin);
    } else {
      top.setAttribute('position',{ x: 0, y: this.data.pressedY, z: 0 });
      top.setAttribute('material', { color: this.data.pressedColor });
    }
    this.pressed = true;
    el.emit('buttondown');
  },

  resetButton: function() {
    var top = this.top;
    // top.setAttribute('position',{ x: 0, y: this.topOrigin.y, z: 0});
    if (this.data.top.length > 0) {
      var mixin = this.data.top.join(' ');
      top.setAttribute('mixin', mixin);
    } else {
      top.setAttribute('position', { x: 0, y: this.data.topY, z: 0 });
      top.setAttribute('material', { color: this.data.color });
    }
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
    var self = this;
    var mesh = this.top.getObject3D('mesh');
    if (!mesh) {
      console.log('no mesh!');
      return
    }
    var topBB = new THREE.Box3().setFromObject(mesh);
    this.controllers.forEach(function(controller) {
      var controllerBB = new THREE.Box3().setFromObject(controller.object3D);
      var collision = topBB.intersectsBox(controllerBB);

      if (collision) {
        self.el.emit('hit');
      }
    });
  }
};

},{}],4:[function(require,module,exports){
module.exports = {
  schema: {},

  multiple: true,

  init: function () {
    var indicator = new THREE.Mesh(new THREE.BoxGeometry( 0.02, 0.08, 0.06 ), new THREE.MeshLambertMaterial({color: 0xff3333}))
    indicator.position.z = -0.08;
    indicator.position.y = 0.02;

    var knob = new THREE.Mesh(new THREE.CylinderGeometry( 0.1, 0.1, 0.1, 20 ), new THREE.MeshLambertMaterial({color: 0x666666}));
    knob.add(indicator);
    knob.position.y = 0.025;
    this.knob = knob;

    var body = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.15, 0.02, 20 ), new THREE.MeshNormalMaterial());
    body.add(knob);

    this.el.setObject3D('mesh', body);

    this.controllers = Array.prototype.slice.call(document.querySelectorAll('a-entity[hand-controls]'));
  },

  play: function () {
    this.grabbed = false;
    this.controllers.forEach(function (controller) {
      controller.addEventListener('triggerdown', this.onTriggerDown.bind(this));
      controller.addEventListener('triggerup', this.onTriggerUp.bind(this));
    }.bind(this));
  },

  pause: function () {
    this.controllers.forEach(function (controller) {
      controller.removeEventListener('triggerdown', this.onTriggerDown.bind(this));
      controller.removeEventListener('triggerup', this.onTriggerUp.bind(this));
    }.bind(this));
  },

  onTriggerUp: function () {
    if (this.grabbed) {
      this.grabbed.visible = true;
      this.grabbed = false;
    }
  },

  onTriggerDown: function (e) {
    var hand = e.target.object3D;
    var knob = this.knob;

    var handBB = new THREE.Box3().setFromObject(hand);
    var knobBB = new THREE.Box3().setFromObject(knob);
    var collision = handBB.intersectsBox(knobBB);

    if (collision) {
      this.grabbed = hand;
      this.grabbed.visible = false;
    };
  },

  tick: function () {
    if (this.grabbed) {
      var axis = 'z';
      var handRotation = this.grabbed.rotation[axis];
      var deltaChange = !this.lastRotation ? 0 : handRotation - this.lastRotation;
      this.knob.rotation.y += deltaChange;
      this.el.emit('change', { value: deltaChange * -1 });
      this.lastRotation = handRotation;
    } else {
      this.lastRotation = 0;
    }
  }
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}]},{},[1]);
