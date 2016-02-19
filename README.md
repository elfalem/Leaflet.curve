# Leaflet.curve
A [Leaflet](http://leafletjs.com) plugin for drawing Bézier curves and other complex shapes. ([DEMO](http://elfalem.github.io/Leaflet.curve/))

### Install
```
npm install --save leaflet-curve
```


### Usage
Include the plugin after Leaflet:
```
<script src="leaflet.js"></script>
<script src="leaflet.curve.js"></script>
```
Add a path that includes a Bézier curve and straight lines:
```
var path = L.curve(['M',[50.54136296522163,28.520507812500004],
					'C',[52.214338608258224,28.564453125000004],
						[48.45835188280866,33.57421875000001],
						[50.680797145321655,33.83789062500001],
					'V',[48.40003249610685],
					'L',[47.45839225859763,31.201171875],
						[48.40003249610685,28.564453125000004],'Z'],
					{color:'red',fill:true}).addTo(map);
```
### Requirements
* This plugin is based on Leaflet version 1.0-beta 2.
* Currently, only SVG rendering is supported.
* Browser and device compatibility testing is very limited.

### API
The first argument to L.curve() is an array of path data. This is composed of commands and coordinates. The commands are a subset of the SVG path [specification](http://www.w3.org/TR/SVG/paths.html).

|Command|Parameters|Description|
|-------|----------|-----------|
|M|[lat,lng]+|move to [lat,lng]|
|L|[lat,lng]+|line to [lat,lng]|
|H|[lng]+|horizontal line to [lng]|
|V|[lat]+|vertical line to [lat]|
|C|([lat1,lng1],[lat2,lng2],[lat,lng])+|cubic Bézier curve to [lat,lng] with control points at [lat1,lng1] and [lat2,lng2]|
|S|([lat2,lng2],[lat,lng])+|cubic bézier curve to [lat,lng] with control points at reflection of second control point of previous curve [lat1,lng1] and [lat2,lng2]|
|Q|([lat1,lng1],[lat,lng])+|quadratic Bézier curve to [lat,lng] with control point at [lat1,lng1]|
|T|([lat,lng])+|quadratic Bézier curve to [lat,lng] with control point at reflection of control point of previous curve [lat1,lng1]|
|Z||close path (line to M)|

Note that only absolute commands (uppercase) are implemented. It's possible to approximate elliptical arcs (command 'A') with Bézier curves (the `elliptical-arc` branch implements this command if you're interested).

The `L.Curve` class extends `L.Path` so options, events, and methods inherited from `L.Path` are available. No new options, events, or methods are introduced by `L.Curve`.

### License
MIT

### Contributions
* Bug reports and pull requests are welcome!
