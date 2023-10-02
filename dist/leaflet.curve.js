L.Curve=L.Path.extend({options:{},initialize:function(t,n){L.setOptions(this,n),this._setPath(t)},setLatLngs:function(t){return this.setPath(t)},getLatLngs:function(){return this.getPath()},_updateBounds:function(){var t=this._clickTolerance(),n=new L.Point(t,t);this._pxBounds=new L.Bounds([this._rawPxBounds.min.subtract(n),this._rawPxBounds.max.add(n)])},getPath:function(){return this._coords},setPath:function(t){return this._setPath(t),this.redraw()},getBounds:function(){return this._bounds},_setPath:function(t){this._coords=t,this._bounds=this._computeBounds()},_computeBounds:function(){for(var t,n,i,a=new L.LatLngBounds,e=0;e<this._coords.length;e++)if("string"==typeof(i=this._coords[e])||i instanceof String)n=i;else if("H"==n)a.extend([t.lat,i[0]]),t=new L.latLng(t.lat,i[0]);else if("V"==n)a.extend([i[0],t.lng]),t=new L.latLng(i[0],t.lng);else if("C"==n){var s=new L.latLng(i[0],i[1]);i=this._coords[++e];var o=new L.latLng(i[0],i[1]);i=this._coords[++e];var r=new L.latLng(i[0],i[1]);a.extend(s),a.extend(o),a.extend(r),r.controlPoint1=s,r.controlPoint2=o,t=r}else if("S"==n){if(o=new L.latLng(i[0],i[1]),i=this._coords[++e],r=new L.latLng(i[0],i[1]),s=t,t.controlPoint2){var h=t.lat-t.controlPoint2.lat,c=t.lng-t.controlPoint2.lng;s=new L.latLng(t.lat+h,t.lng+c)}a.extend(s),a.extend(o),a.extend(r),r.controlPoint1=s,r.controlPoint2=o,t=r}else if("Q"==n){var l=new L.latLng(i[0],i[1]);i=this._coords[++e],r=new L.latLng(i[0],i[1]),a.extend(l),a.extend(r),r.controlPoint=l,t=r}else"T"==n?(r=new L.latLng(i[0],i[1]),l=t,t.controlPoint&&(h=t.lat-t.controlPoint.lat,c=t.lng-t.controlPoint.lng,l=new L.latLng(t.lat+h,t.lng+c)),a.extend(l),a.extend(r),r.controlPoint=l,t=r):(a.extend(i),t=new L.latLng(i[0],i[1]));return a},getCenter:function(){return this._bounds.getCenter()},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._usingCanvas?this._updateCurveCanvas():this._updateCurveSvg()},_project:function(){var t,n,i,a;this._points=[];for(var e=0;e<this._coords.length;e++)if("string"==typeof(t=this._coords[e])||t instanceof String)this._points.push(t),i=t;else{switch(t.length){case 2:a=this._map.latLngToLayerPoint(t),n=t;break;case 1:"H"==i?(a=this._map.latLngToLayerPoint([n[0],t[0]]),n=[n[0],t[0]]):(a=this._map.latLngToLayerPoint([t[0],n[1]]),n=[t[0],n[1]])}this._points.push(a)}if(this._bounds.isValid()){var s=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),o=this._map.latLngToLayerPoint(this._bounds.getSouthEast());this._rawPxBounds=new L.Bounds(s,o),this._updateBounds()}},_curvePointsToPath:function(t){for(var n,i,a="",e=0;e<t.length;e++)if("string"==typeof(n=t[e])||n instanceof String)a+=i=n;else switch(i){case"H":a+=n.x+" ";break;case"V":a+=n.y+" ";break;default:a+=n.x+","+n.y+" "}return a||"M0 0"},beforeAdd:function(t){L.Path.prototype.beforeAdd.call(this,t),this._usingCanvas=this._renderer instanceof L.Canvas,this._usingCanvas&&(this._pathSvgElement=document.createElementNS("http://www.w3.org/2000/svg","path"))},onAdd:function(t){if(this._usingCanvas&&(this._canvasSetDashArray=!this.options.dashArray),L.Path.prototype.onAdd.call(this,t),this._usingCanvas)this.options.animate&&"object"==typeof TWEEN?(this._normalizeCanvasAnimationOptions(),this._tweenedObject={offset:this._pathSvgElement.getTotalLength()},this._tween=new TWEEN.Tween(this._tweenedObject).to({offset:0},this.options.animate.duration).delay(this.options.animate.delay).repeat(this.options.animate.iterations-1).onComplete((l=this,function(){l._canvasAnimating=!1})).start(),this._canvasAnimating=!0,this._animateCanvas()):this._canvasAnimating=!1;else if(this.options.animate&&this._path.animate){var n=Math.min(this._svgSetDashArray(),1e3),i=this.options.dashArray;if(console.log(n,Array.isArray(i)),Array.isArray(i))var a=i,e=i.join(" ");else{if(e=i,i.includes(" "))var s=" ";else s=i.includes(",")?" ":"";a=i.split(s)}var o=0;a.forEach((t=>o+=parseInt(t)));var r=n-n%o,h=(e+" ").repeat(r/o);if(""!=(h=h.substring(0,h.length-1)))var c=o;else c=10;this.options.animate.duration=n,this._path.pathLength.baseVal=r,this._path.animate([{strokeDashoffset:c},{strokeDashoffset:0}],this.options.animate),""!=h&&(this.options.dashArray=h)}var l},_updateCurveSvg:function(){this._renderer._setPath(this,this._curvePointsToPath(this._points)),this.options.animate&&this._svgSetDashArray()},_svgSetDashArray:function(){var t=this._path,n=t.getTotalLength();return this.options.dashArray||(t.style.strokeDasharray=n+" "+n),n},_containsPoint:function(t){return!!this._bounds.isValid()&&this._bounds.contains(this._map.layerPointToLatLng(t))},_normalizeCanvasAnimationOptions:function(){var t={delay:0,duration:0,iterations:1};"number"==typeof this.options.animate?t.duration=this.options.animate:(this.options.animate.duration&&(t.duration=this.options.animate.duration),this.options.animate.delay&&(t.delay=this.options.animate.delay),this.options.animate.iterations&&(t.iterations=this.options.animate.iterations)),this.options.animate=t},_updateCurveCanvas:function(){var t=this._curvePointsToPath(this._points);this._pathSvgElement.setAttribute("d",t),this.options.animate&&"object"==typeof TWEEN&&this._canvasSetDashArray&&(this.options.dashArray=this._pathSvgElement.getTotalLength()+"",this._renderer._updateDashArray(this)),this._curveFillStroke(new Path2D(t),this._renderer._ctx)},_animateCanvas:function(){TWEEN.update(),this._renderer._updatePaths(),this._canvasAnimating&&(this._animationFrameId=L.Util.requestAnimFrame(this._animateCanvas,this))},_curveFillStroke:function(t,n){n.lineDashOffset=this._canvasAnimating?this._tweenedObject.offset:0;var i=this.options;i.fill&&(n.globalAlpha=i.fillOpacity,n.fillStyle=i.fillColor||i.color,n.fill(t,i.fillRule||"evenodd")),i.stroke&&0!==i.weight&&(n.setLineDash&&n.setLineDash(this.options&&this.options._dashArray||[]),n.globalAlpha=i.opacity,n.lineWidth=i.weight,n.strokeStyle=i.color,n.lineCap=i.lineCap,n.lineJoin=i.lineJoin,n.stroke(t))},trace:function(t){if(void 0===this._map||null===this._map)return[];var n,i,a,e,s,o,r;t=t.filter((function(t){return t>=0&&t<=1}));for(var h=[],c=0;c<this._points.length;c++)if("string"==typeof(n=this._points[c])||n instanceof String)"Z"==(i=n)&&(h=h.concat(this._linearTrace(t,e,a)));else switch(i){case"M":a=n,e=n;break;case"L":case"H":case"V":h=h.concat(this._linearTrace(t,e,n)),e=n;break;case"C":s=n,o=this._points[++c],r=this._points[++c],h=h.concat(this._cubicTrace(t,e,s,o,r)),e=r;break;case"S":s=this._reflectPoint(o,e),o=n,r=this._points[++c],h=h.concat(this._cubicTrace(t,e,s,o,r)),e=r;break;case"Q":s=n,o=this._points[++c],h=h.concat(this._quadraticTrace(t,e,s,o)),e=o;break;case"T":s=this._reflectPoint(s,e),o=n,h=h.concat(this._quadraticTrace(t,e,s,o)),e=o}return h},_linearTrace:function(t,n,i){return t.map((t=>{var a=this._singleLinearTrace(t,n.x,i.x),e=this._singleLinearTrace(t,n.y,i.y);return this._map.layerPointToLatLng([a,e])}))},_quadraticTrace:function(t,n,i,a){return t.map((t=>{var e=this._singleQuadraticTrace(t,n.x,i.x,a.x),s=this._singleQuadraticTrace(t,n.y,i.y,a.y);return this._map.layerPointToLatLng([e,s])}))},_cubicTrace:function(t,n,i,a,e){return t.map((t=>{var s=this._singleCubicTrace(t,n.x,i.x,a.x,e.x),o=this._singleCubicTrace(t,n.y,i.y,a.y,e.y);return this._map.layerPointToLatLng([s,o])}))},_singleLinearTrace:function(t,n,i){return n+t*(i-n)},_singleQuadraticTrace:function(t,n,i,a){var e=1-t;return Math.pow(e,2)*n+2*e*t*i+Math.pow(t,2)*a},_singleCubicTrace:function(t,n,i,a,e){var s=1-t;return Math.pow(s,3)*n+3*Math.pow(s,2)*t*i+3*s*Math.pow(t,2)*a+Math.pow(t,3)*e},_reflectPoint:function(t,n){return x=n.x+(n.x-t.x),y=n.y+(n.y-t.y),L.point(x,y)}}),L.curve=function(t,n){return new L.Curve(t,n)};