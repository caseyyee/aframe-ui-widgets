module.exports = {
  schema: {
    target: { type: 'string' }
    // size: { type: 'number', default: 0.1 },
    // color: { type: 'color', default: '#960960' },
    // pressedColor: { type: 'color', default: '#FC2907' },
    // baseColor: {type: 'color', default: '#618EFF'},
    // topY: { type: 'number', default: 0.02 },
    // pressedY: { type: 'number', default: 0.012 },
    // base: { type: 'array' },    /* specify mixin for button base */
    // top: { type: 'array' },     /* specify mixin for button top */
    // pressed: {type: 'array' }   /* add mixin for button when pressed */
  },

  multiple: true,

  init: function () {
    var self = this;
    var keySpacing = 0.07;
    var keySize = 0.05;
    this.inputEl = document.querySelector(this.data.target);

    var keyboard = [
      { keys: [ {label: 'q'}, {label: 'w'}, {label: 'e'}, {label: 'r'}, {label: 't'}, {label: 'y'}, {label: 'u'}, {label: 'i'}, {label: 'o'}, {label: 'p'} ] },
      { keys: [ {label: 'a'}, {label: 's'}, {label: 'd'}, {label: 'f'}, {label: 'g'}, {label: 'h'}, {label: 'j'}, {label: 'k'}, {label: 'l'} ],
        margin: keySpacing / 2 },
      { keys: [ {label: 'z'}, {label: 'x'}, {label: 'c'}, {label: 'v'}, {label: 'b'}, {label: 'n'}, {label: 'm'} ],
        margin: keySpacing },
      { keys: [ {label: ' ', string: ' ', size: 7 } ],
        margin: keySpacing * 4 }
    ];

    var maxWidth = 0;
    for (var row = 0; row < keyboard.length; row++) {
      var width = keyboard[row].keys.length * keySpacing;
      maxWidth = width > maxWidth ? width : maxWidth;
    };
    var offsetX = keySize + maxWidth / 2 * -1;

    for (var row = 0; row < keyboard.length; row++) {
      for (var key = 0; key < keyboard[row].keys.length; key++) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('material', { color: 'lightgray' });

        var margin = keyboard[row].margin || 0;
        var x = (keySpacing * key) + margin + offsetX;
        entity.setAttribute('position', { x: x, y: 0, z: keySpacing * row });

        var k = keyboard[row].keys[key];
        var value = k.string === undefined ? k.label : k.string;
        entity.setAttribute('data-value', value);

        var size = k.size || 1;
        entity.setAttribute('geometry', {
          primitive: 'box',
          width: keySize * size,
          height: keySize,
          depth: keySize
        });

        entity.addEventListener('click', function (e) {
          var target = e.detail.target;
          var value = target.dataset.value;
          var inputEl = self.inputEl
          var input = inputEl.getAttribute('ui-text-input');
          self.inputEl.setAttribute('ui-text-input', {
            value: input.value + value
          })

        });

        var text = document.createElement('a-entity');
        text.setAttribute('text', {
          value: k.label.toUpperCase(),
          align: 'center',
          color: 'black'
        });

        text.setAttribute('rotation', { x: -90, y: 0, z: 0 });
        text.setAttribute('position', { x: 0, y: keySize / 2, z: 0 });

        entity.appendChild(text);

        this.el.appendChild(entity);
      }
    }
  },

  play: function () {
    // var el = this.el;
    // // cursor controls
    // el.addEventListener('mousedown', this.onButtonDown.bind(this));
    // el.addEventListener('mouseup', this.onButtonUp.bind(this));
    // el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    // // motion controls
    // el.addEventListener('hit', this.onHit);
    // el.addEventListener('touchdown', this.onButtonDown.bind(this));
    // el.addEventListener('touchup', this.onButtonUp.bind(this));
  },

  pause: function () {
    // var el = this.el;
    // el.removeEventListener('mousedown', this.onButtonDown.bind(this));
    // el.removeEventListener('mouseup', this.onButtonUp.bind(this));
    // el.removeEventListener('mouseleave', this.onButtonUp.bind(this));
    // el.removeEventListener('hit', this.onHit);
    // el.removeEventListener('touchdown', this.onButtonDown.bind(this));
    // el.removeEventListener('touchup', this.onButtonUp.bind(this));
  },

  // onButtonDown: function () {
  //   var top = this.top;
  //   var el = this.el;
  //   if (this.data.top.length > 0 && this.data.pressed.length > 0) {
  //     var mixin = this.data.top.join(' ') + ' ' + this.data.pressed.join(' ');
  //     top.setAttribute('mixin', mixin);
  //   } else {
  //     top.setAttribute('position',{ x: 0, y: this.data.pressedY, z: 0 });
  //     top.setAttribute('material', { color: this.data.pressedColor });
  //   }
  //   this.pressed = true;
  //   el.emit('buttondown');
  // },

  // resetButton: function() {
  //   var top = this.top;
  //   // top.setAttribute('position',{ x: 0, y: this.topOrigin.y, z: 0});
  //   if (this.data.top.length > 0) {
  //     var mixin = this.data.top.join(' ');
  //     top.setAttribute('mixin', mixin);
  //   } else {
  //     top.setAttribute('position', { x: 0, y: this.data.topY, z: 0 });
  //     top.setAttribute('material', { color: this.data.color });
  //   }
  // },

  // onButtonUp: function (e) {
  //   if (this.pressed) {
  //     var el = this.el;
  //     this.resetButton();
  //     this.pressed = false;
  //     el.emit('buttonup');
  //     el.emit('pressed');
  //   }
  // },

  // onMouseLeave: function() {
  //   if (this.pressed) {
  //     this.resetButton();
  //     this.pressed = false;
  //   }
  // },

  // // handles hand controller collisions
  // onHit: function (evt) {
  //   var threshold = 30;
  //   if (!this.pressed) {
  //     this.pressed = true;
  //     this.emit('touchdown');
  //     var self = this;
  //     this.interval = setInterval(function() {
  //       var delta = performance.now() - self.lastTime;
  //       if (delta > threshold) {
  //         self.pressed = false;
  //         self.lastTime = 0;
  //         self.emit('touchup');
  //         clearInterval(self.interval);
  //       }
  //     }, threshold);
  //   }
  //   this.lastTime = performance.now();
  // },

  // update: function () {
  //   this.el.setAttribute('cursor-listener','');
  // },

  tick: function () {
    // var self = this;
    // var mesh = this.top.getObject3D('mesh');
    // if (!mesh) {
    //   console.log('no mesh!');
    //   return
    // }
    // var topBB = new THREE.Box3().setFromObject(mesh);
    // this.controllers.forEach(function(controller) {
    //   var controllerBB = new THREE.Box3().setFromObject(controller.object3D);
    //   var collision = topBB.intersectsBox(controllerBB);

    //   if (collision) {
    //     self.el.emit('hit');
    //   }
    // });
  }
};
