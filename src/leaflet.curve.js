/*
 * Leaflet.curve v0.4.1 - a plugin for Leaflet mapping library. https://github.com/elfalem/Leaflet.curve
 * (c) elfalem 2015-2019
 */
/*
 * note that SVG (x, y) corresponds to (long, lat)
 */

L.Curve = L.Path.extend({
	options: {
	},
	
	initialize: function(path, options){
		L.setOptions(this, options);
		this._setPath(path);
	},
	
	getPath: function(){
		return this._coords;
	},
	
	setPath: function(path){
		this._setPath(path);
		return this.redraw();
	},
	
	getBounds: function() {
		return this._bounds;
	},

	_setPath: function(path){
		this._coords = path;
		this._bounds = this._computeBounds();
	},
	
	_computeBounds: function(){
		var bound = new L.LatLngBounds();
		var lastPoint;
		var lastCommand;
		var coord;
		for(var i = 0; i < this._coords.length; i++){
			coord = this._coords[i];
			if(typeof coord == 'string' || coord instanceof String){
				lastCommand = coord;
			}else if(lastCommand == 'H'){
				bound.extend([lastPoint.lat,coord[0]]);
				lastPoint = new L.latLng(lastPoint.lat,coord[0]);
			}else if(lastCommand == 'V'){
				bound.extend([coord[0], lastPoint.lng]);
				lastPoint = new L.latLng(coord[0], lastPoint.lng);
			}else if(lastCommand == 'C'){
				var controlPoint1 = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var controlPoint2 = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var endPoint = new L.latLng(coord[0], coord[1]);

				bound.extend(controlPoint1);
				bound.extend(controlPoint2);
				bound.extend(endPoint);

				endPoint.controlPoint1 = controlPoint1;
				endPoint.controlPoint2 = controlPoint2;
				lastPoint = endPoint;
			}else if(lastCommand == 'S'){
				var controlPoint2 = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var endPoint = new L.latLng(coord[0], coord[1]);

				var controlPoint1 = lastPoint;
				if(lastPoint.controlPoint2){
					var diffLat = lastPoint.lat - lastPoint.controlPoint2.lat;
					var diffLng = lastPoint.lng - lastPoint.controlPoint2.lng;
					controlPoint1 = new L.latLng(lastPoint.lat + diffLat, lastPoint.lng + diffLng);
				}

				bound.extend(controlPoint1);
				bound.extend(controlPoint2);
				bound.extend(endPoint);

				endPoint.controlPoint1 = controlPoint1;
				endPoint.controlPoint2 = controlPoint2;
				lastPoint = endPoint;
			}else if(lastCommand == 'Q'){
				var controlPoint = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var endPoint = new L.latLng(coord[0], coord[1]);

				bound.extend(controlPoint);
				bound.extend(endPoint);

				endPoint.controlPoint = controlPoint;
				lastPoint = endPoint;
			}else if(lastCommand == 'T'){
				var endPoint = new L.latLng(coord[0], coord[1]);

				var controlPoint = lastPoint;
				if(lastPoint.controlPoint){
					var diffLat = lastPoint.lat - lastPoint.controlPoint.lat;
					var diffLng = lastPoint.lng - lastPoint.controlPoint.lng;
					controlPoint = new L.latLng(lastPoint.lat + diffLat, lastPoint.lng + diffLng);
				}

				bound.extend(controlPoint);
				bound.extend(endPoint);

				endPoint.controlPoint = controlPoint;
				lastPoint = endPoint;
			}else{
				bound.extend(coord);
				lastPoint = new L.latLng(coord[0], coord[1]);
			}
		}
		return bound;
	},
	
	getCenter: function () {
		return this._bounds.getCenter();
	},
	
	_update: function(){
		if (!this._map) { return; }
		
		this._updatePath();
	},
	
	_updatePath: function() {
		if(this._usingCanvas){
			this._updateCurveCanvas();
		}else{
			this._updateCurveSvg();
		}
	},

	_project: function() {
		var coord, lastCoord, curCommand, curPoint;

		this._points = [];

		for(var i = 0; i < this._coords.length; i++){
			coord = this._coords[i];
			if(typeof coord == 'string' || coord instanceof String){
				this._points.push(coord);
				curCommand = coord;
			}else {
				switch(coord.length){
					case 2:
						curPoint = this._latLngToPointFn.call(this._map, coord);
						lastCoord = coord;
					break;
					case 1:
						if(curCommand == 'H'){
							curPoint = this._latLngToPointFn.call(this._map, [lastCoord[0], coord[0]]);
							lastCoord = [lastCoord[0], coord[0]];
						}else{
							curPoint = this._latLngToPointFn.call(this._map, [coord[0], lastCoord[1]]);
							lastCoord = [coord[0], lastCoord[1]];
						}
					break;
				}
				this._points.push(curPoint);
			}
		}
	},

	_curvePointsToPath: function(points){
		var point, curCommand, str = '';
		for(var i = 0; i < points.length; i++){
			point = points[i];
			if(typeof point == 'string' || point instanceof String){
				curCommand = point;
				str += curCommand;
			}else{
				switch(curCommand){
					case 'H':
						str += point.x + ' ';
						break;
					case 'V':
						str += point.y + ' ';
						break;
					default:
						str += point.x + ',' + point.y + ' ';
						break;
				}
			}
		}
		return str || 'M0 0';
	},

	beforeAdd: function(map){
		L.Path.prototype.beforeAdd.call(this, map);

		this._usingCanvas = this._renderer instanceof L.Canvas;

		this._latLngToPointFn = this._usingCanvas ? map.latLngToContainerPoint : map.latLngToLayerPoint;
		if(this._usingCanvas){
			this._pathSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');			
		}
	},

	onAdd: function(map){
		if(this._usingCanvas){
			// determine if dash array is set by user
			this._canvasSetDashArray = !this.options.dashArray;
		}
		
		L.Path.prototype.onAdd.call(this, map); // calls _update()

		if(this._usingCanvas){
			this._animationCanvasElement = this._insertCustomCanvasElement();

			this._resizeCanvas();

			map.on('resize', this._resizeCanvas, this);

			if(this.options.animate && typeof(TWEEN) === 'object'){
				this._pathLength = this._pathSvgElement.getTotalLength();

				this._normalizeCanvasAnimationOptions();

				this._tweenedObject = {offset: this._pathLength};
				this._tween = new TWEEN.Tween(this._tweenedObject)
					.to({offset: 0}, this.options.animate.duration)
					// difference of behavior with SVG, delay occurs on every iteration
					.delay(this.options.animate.delay)
					.repeat(this.options.animate.iterations - 1)
					.onComplete(function(scope){
						return function(){
							scope._canvasAnimating = false;
						}
					}(this))
					.start();

				this._canvasAnimating = true;
				this._animateCanvas();
			}else{
				this._canvasAnimating = false;
			}
		}else{
			if(this.options.animate){
				var length = this._svgSetDashArray();
				
				this._path.animate([
					{strokeDashoffset: length},
					{strokeDashoffset: 0}
				], this.options.animate);
			}
		}
	},

	onRemove: function(map){
		L.Path.prototype.onRemove.call(this, map);

		if(this._usingCanvas){
			this._clearCanvas();
			L.DomUtil.remove(this._animationCanvasElement);
			map.off('resize', this._resizeCanvas, this);
		}
	},

	// SVG specific logic
	_updateCurveSvg: function(){
		this._renderer._setPath(this, this._curvePointsToPath(this._points));

		if(this.options.animate){			
			this._svgSetDashArray();
		}
	},

	_svgSetDashArray: function(){
		var path = this._path;
		var length = path.getTotalLength();
		
		if(!this.options.dashArray){
			path.style.strokeDasharray = length + ' ' + length;
		}
		return length;
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function(layerPoint) {
		return this._bounds.contains(this._map.layerPointToLatLng(layerPoint));
	},

	// Canvas specific logic below here
	_insertCustomCanvasElement: function(){
		var element = L.DomUtil.create('canvas', 'leaflet-zoom-animated');
		var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
		element.style[originProp] = '50% 50%';
		var pane = this._map.getPane(this.options.pane);
		pane.insertBefore(element, pane.firstChild);

		return element;
	},

	_normalizeCanvasAnimationOptions: function(){
		var opts = {
			delay: 0,
			duration: 0,
			iterations:	1
		};
		if(typeof(this.options.animate) == "number"){
			opts.duration = this.options.animate;
		}else{
			if(this.options.animate.duration){
				opts.duration = this.options.animate.duration;
			}
			if(this.options.animate.delay){
				opts.delay =this.options.animate.delay;
			}
			if(this.options.animate.iterations){
				opts.iterations = this.options.animate.iterations;
			}
		}

		this.options.animate = opts;
	},

	_updateCurveCanvas: function(){
		this._project();

		var pathString = this._curvePointsToPath(this._points);
		this._pathSvgElement.setAttribute('d', pathString);
		
		if(this.options.animate && typeof(TWEEN) === 'object' && this._canvasSetDashArray){
			this._pathLength = this._pathSvgElement.getTotalLength();
			this.options.dashArray = this._pathLength + '';
			this._renderer._updateDashArray(this);
		}

		this._path2d = new Path2D(pathString);

		if(this._animationCanvasElement){
			this._resetCanvas();
		}

		
	},

	_animationCanvasElement: null,

	_resizeCanvas: function() {
		var size = this._map.getSize();
		this._animationCanvasElement.width = size.x;
		this._animationCanvasElement.height = size.y;

		this._resetCanvas();
	},

	_resetCanvas: function() {
		var topLeft = this._map.containerPointToLayerPoint([0, 0]);
		L.DomUtil.setPosition(this._animationCanvasElement, topLeft);

		this._redrawCanvas();
	},

	_redrawCanvas: function(){
		if(!this._canvasAnimating){
			this._clearCanvas();
			var ctx = this._animationCanvasElement.getContext('2d');
			this._curveFillStroke(this._path2d, ctx);
		}
	},

	_clearCanvas: function() {
		this._animationCanvasElement.getContext('2d').clearRect(0, 0, this._animationCanvasElement.width, this._animationCanvasElement.height);
	},
  
	_animateCanvas: function(time){
		TWEEN.update(time);
	
		var ctx = this._animationCanvasElement.getContext('2d');
		ctx.clearRect(0, 0, this._animationCanvasElement.width, this._animationCanvasElement.height);
		ctx.lineDashOffset = this._tweenedObject.offset;

		this._curveFillStroke(this._path2d, ctx);

		if(this._canvasAnimating){
			this._animationFrameId = L.Util.requestAnimFrame(this._animateCanvas, this);
		}
	},

	// similar to Canvas._fillStroke(ctx, layer)
	_curveFillStroke: function (path2d, ctx) {
		var options = this.options;

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill(path2d, options.fillRule || 'evenodd');
		}

		if (options.stroke && options.weight !== 0) {
			if (ctx.setLineDash) {
				ctx.setLineDash(this.options && this.options._dashArray || []);
			}
			ctx.globalAlpha = options.opacity;
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke(path2d);
		}
	}
});

L.curve = function (path, options){
	return new L.Curve(path, options);
};