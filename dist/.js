/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * A-Frame Super Useful Button component for A-Frame.
	 */
	AFRAME.registerComponent('button', {
	  schema: {},

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    var top = new THREE.Mesh(new THREE.CylinderGeometry( 0.1, 0.1, 0.02, 10 ), new THREE.MeshLambertMaterial({color: 0xffff00}));
	    this.top = top;
	    var chassis = new THREE.Mesh(new THREE.CylinderGeometry( 0.12, 0.15, 0.02, 10 ), new THREE.MeshNormalMaterial());

	    top.position.y = 0.02;
	    chassis.add(top);

	    this.el.setObject3D('mesh', chassis);
	  },

	  play: function () {

	    this.el.addEventListener('hit', this.onHit);

	    this.el.addEventListener('click', this.onHit);
	  },

	  pause: function () {
	    this.el.removeEventListener('hit', this.onHit);
	  },

	  onHit: function (evt) {
	    var pressed = false;

	    var interval;
	    var threshold = 30;
	    var lastTime = 0;

	    var self = this;

	    if (!pressed) {
	      pressed = true;
	      console.log(self.el);
	      self.el.emit('button-down');
	      interval = setInterval(function() {
	        var delta = performance.now() - lastTime;
	        if (delta > threshold) {
	          pressed = false;
	          lastTime = null;
	          clearInterval(interval);
	          self.el.emit('button-up');
	          self.el.emit('button-pressed');
	        }
	      }, threshold);
	    }

	    lastTime = performance.now();
	  },

	  update: function() {
	    this.el.setAttribute('cursor-listener','');
	  }
	});


/***/ }
/******/ ]);