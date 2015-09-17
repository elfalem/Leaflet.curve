/*
* note that SVG (x, y) corresponds to (long, lat)
* for arcs rx and ry are treated as rlong and rlat respectively with their units being degrees (subtract pixel coords of [0,0])
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
		this._bounds = this._computeBounds();  //TODO: calculate bound as a LatLngBounds object and set to this._bounds 
	},
	
	//TODO: this function must deal with absolute coordinates, perhaps remove all relative commands from the class
	//TODO: take into account H and V commands to a get a more appropriate bounding box
	_computeBounds: function(){
		var points = [];
		var minLat, minLng, maxLat, maxLng, first = true, lastCommand;
		for(var i = 0; i < this._coords.length; i++){
			coord = this._coords[i];
			if(typeof coord == 'string' || coord instanceof String){ //check if command
				lastCommand = coord;
			}else if(lastCommand == 'H' || lastCommand == 'h' || lastCommand == 'V' || lastCommand == 'v'){
				//ignore for now
			}else if(lastCommand == 'A' || lastCommand == 'a'){
				points.push([coord[5], coord[6]]);
			}else{
				points.push(coord);
			}
		}
		return L.latLngBounds(points);
	},
	
	//TODO: use a centroid algorithm instead
	getCenter: function () {
		return this._bounds.getCenter();
	},
	
	_update: function(){
		if (!this._map) { return; }
		
		this._updatePath();
	},
	
	_updatePath: function() {
		this._convertLatlngsToPath();
		this._renderer._updatecurve(this);
	},
	
	_project: function() {
		//nothing needs to be done here, invoked on add
	},
	
	//convert from latlngs to pixel points and assembles the path string that goes in the d attribute
	_convertLatlngsToPath: function(){
		var coord, p, str = '', lastCommand, lastFullCoord;
		
		if(this._coords.length == 0){
			str = 'M0 0';        //not to give an empty path string
		}
		
		for(var ind = 0; ind < this._coords.length; ind++){
			coord = this._coords[ind];
			if(typeof coord == 'string' || coord instanceof String){ //check if command
				if(coord == 'H' || coord == 'V'){
					str += 'L';
				}else if(coord == 'h' || coord == 'v'){
					str += 'l';
				}else{
					str += coord;
				}
				lastCommand = coord;
			}else{
				if(coord.length == 1){
					if(lastCommand == 'H' || lastCommand == 'h'){
						p = this._map.latLngToLayerPoint([lastFullCoord[0], coord[0]]);
					}else{  //coord[0] is 'V' or 'v'
						p = this._map.latLngToLayerPoint([coord[0], lastFullCoord[1]]);
					}
					str += ' ' + p.x + ' ' + p.y;
				}else if(coord.length == 7){ //if an elliptical arc
					p = this._map.latLngToLayerPoint([coord[5], coord[6]]);
					var orig = this._map.latLngToLayerPoint([0, 0]);
					var q = this._map.latLngToLayerPoint([0, coord[0]]);
					var rx = Math.abs(q.x - orig.x);
					var s = this._map.latLngToLayerPoint([coord[1], 0]);
					var ry = Math.abs(s.y - orig.y);
					str += ' ' + rx + ' ' + ry + ' ' + coord[2] + ' ' + coord[3] + ' ' + coord[4] + ' ' + p.x + ' ' + p.y;
				}else{
					p = this._map.latLngToLayerPoint(coord);
					lastFullCoord = coord;
					str += ' ' + p.x + ' ' + p.y;
				}
			}
		}
		
		this._customPath = str;
	}
	
});

L.curve = function (path, options){
	return new L.Curve(path, options);
};

//TODO: currently, the renderer has to be SVG, implement in Canvas too
L.SVG.include({_updatecurve: function(layer){
	this._setPath(layer, layer._customPath);
    } });
