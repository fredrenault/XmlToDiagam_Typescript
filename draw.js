var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var decalCadre = 15;
var colInter = 50;
var ligInter = 50;

var lstRects;
var lstErr;

var arrow = [ [ 2, 0 ], [ -10, -4 ], [ -10, 4 ] ];
var CoordRect = (function () {
	function CoordRect(x, y, h, w) { this.x = x; this.y = y; this.h = h; this.w = w; this.xCoord = x; this.yCoord = y; this.hCoord = h; this.wCoord = w; }
	return CoordRect; })();

var GraphRects = (function () {
	function GraphRects(lig, col, coord) { this.lig = lig; this.col = col; this.coord = coord; this.ligRect = lig; this.colRect = col; this.coordRect = coord; }
	return GraphRects; })();
	
function greaterNum(value1, value2) {
	if(value1 < value2) { return -1; }
	if(value1 > value2) { return 1; }
	return 0;
}

function Draw2(lstGraphNodes) {
	var maxCol = Math.max.apply(Math, lstGraphNodes.map(function (o) { return o.col; }));
	var maxRow = Math.max.apply(Math, lstGraphNodes.map(function (o) { return o.row; }));
	
	var maxLargTitre = Math.max.apply(Math, lstGraphNodes.map(function (o) { return o.largTitre; }));
	var maxHautTitre = Math.max.apply(Math, lstGraphNodes.map(function (o) { return o.hautTitre; }));
	
	var maxLargSsTitre = Math.max.apply(Math, lstGraphNodes.map(function (o) { return o.largSsTitre; }));
	var maxHautSsTitre = Math.max.apply(Math, lstGraphNodes.map(function (o) { return o.hautSsTitre; }));
	var maxHautTitres = maxHautTitre + maxHautSsTitre;
	
	var hautRect = maxHautTitres + (2 * decalCadre);
	var largRect = maxLargTitre + (2 * decalCadre);
	
	var maxLarg = (maxCol * largRect) + ((maxCol) * colInter);
	var maxHaut = (maxRow * hautRect) + ((maxRow) * ligInter);
	
	lstRects = new Array();
	for(var i = 0; lstGraphNodes.length > i; i++) {
		var node = lstGraphNodes[i];
		if(node.col != 0 && node.row != 0) {
			var coordsRect = DrawRectangle(node, hautRect, largRect);
			var graphRect = new GraphRects(node.row, node.col, coordsRect);
			lstRects.push(graphRect);
		}
	}
	
	lstErr = new Array();
	for(var i = 0; lstGraphNodes.length > i; i++) {
		var node = lstGraphNodes[i];
		if(node.col != 0 && node.row != 0) {
			DrawText(node, maxLargTitre, maxHautTitre, maxHautSsTitre);
		}
	}
}

function CalculXY(ligCol, hwRect) {
	var result = ((((ligCol - 1) * hwRect) + (ligCol * colInter)) - decalCadre);
	return result;
}

function DrawRectangle(node, hRect, wRect) {
	var xRect = CalculXY(node.col, wRect);
	var yRect = CalculXY(node.row, hRect);
	
	ctx.beginPath();
	ctx.rect(xRect, yRect, wRect, hRect);
	ctx.fillStyle = "lightgreen";
	ctx.fill();
	
	var coordRect = new CoordRect(xRect, yRect, hRect, wRect);
	return coordRect;
}

function DrawText(node, maxLargTitre, maxHautTitre, maxHautSsTitre) {
	var node2 = node;
	
	var rect = lstRects.filter(function (obj) { return obj.colRect == node2.col && obj.ligRect == node2.row; });
	
	var xTitre = rect[0].coordRect.xCoord + decalCadre;
	var yTitre = rect[0].coordRect.yCoord + decalCadre;
	
	var xSsTitre = xTitre;
	var ySsTitre = yTitre + maxHautTitre;
	
	ctx.fillStyle = node.nodecolor;
	ctx.fillText(node.name, xTitre, yTitre);
	ctx.fillStyle = "black";
	ctx.fillText(node.title, xSsTitre, ySsTitre);
	
	node.hgX = rect[0].coordRect.xCoord;
	node.hgY = rect[0].coordRect.yCoord;
	node.hdX = rect[0].coordRect.xCoord + rect[0].coordRect.wCoord;
	node.hdY = rect[0].coordRect.yCoord;
	node.bgX = rect[0].coordRect.xCoord;
	node.bgY = rect[0].coordRect.yCoord + rect[0].coordRect.hCoord;
	node.bdX = rect[0].coordRect.xCoord + rect[0].coordRect.wCoord;
	node.bdY = rect[0].coordRect.yCoord + rect[0].coordRect.hCoord;
	
	if(node.children != null) {
		for(var i = 0; node.children.length > i; i++) {
			var child = node.children[i];
			var rectFils = lstRects.filter(function (obj) { return obj.colRect == child.col && obj.ligRect == child.row; });
			
			if(rectFils.length > 0) {
				var coordRectArr = rectFils[0].coordRect;
				DrawLine(node, child, rect[0].coordRect, coordRectArr);
			}
		}
	}
}

function DrawLine(nodeDep, nodeArr, coordRectDep, coordRectArr) {
	var xTxtDep = 0;
	var xTxtArr = 0;
	var yTxtDep = 0;
	var yTxtArr = 0;
	
	var xDepBase = coordRectDep.xCoord;
	var yDepBase = coordRectDep.yCoord;
	var xArrBase = coordRectArr.xCoord;
	var yArrBase = coordRectArr.yCoord;
	
	var signLig = greaterNum(nodeDep.row, nodeArr.row);
	var signCol = greaterNum(nodeDep.col, nodeArr.col);
	
	var demiLarg = coordRectDep.wCoord / 2;
	var decalXDep = 0;
	if(nodeDep.col != 1) { decalXDep = demiLarg / (nodeDep.col - 1); } ; ;
	
	switch(signLig) {
		case -1: {
			switch(signCol) {
				case -1: {
					xTxtDep = xDepBase + demiLarg + ((nodeArr.col - nodeDep.col - 1) * decalXDep);
					yTxtDep = yDepBase + coordRectDep.hCoord;
					
					xTxtArr = xArrBase;
					yTxtArr = yArrBase;
					break;
				}
				case 0: {
					xTxtDep = xDepBase + demiLarg;
					yTxtDep = yDepBase + coordRectDep.hCoord;
					
					xTxtArr = xArrBase + demiLarg;
					yTxtArr = yArrBase;
					break;
				}
				case 1: {
					xTxtDep = xDepBase + ((nodeArr.col - 1) * decalXDep);
					yTxtDep = yDepBase + coordRectDep.hCoord;
					
					xTxtArr = xArrBase + coordRectArr.wCoord;
					yTxtArr = yArrBase;
					break;
				}
			}
			break;
		}
		case 0: {
			switch(signCol) {
				case -1: {
					xTxtDep = xDepBase + coordRectDep.wCoord;
					yTxtDep = yDepBase + (coordRectDep.hCoord / 2);
					
					xTxtArr = xArrBase;
					yTxtArr = yArrBase + (coordRectArr.hCoord / 2);
					break;
				}
				case 0: { break; }
				case 1: {
					xTxtDep = xDepBase;
					yTxtDep = yDepBase + (coordRectDep.hCoord / 2);
					
					xTxtArr = xArrBase + coordRectArr.wCoord;
					yTxtArr = yArrBase + (coordRectArr.hCoord / 2);
					break;
				}
			}
			break;
		}
		case 1: {
			switch(signCol) {
				case -1: {
					xTxtDep = xDepBase + demiLarg + ((nodeArr.col - nodeDep.col - 1) * decalXDep);
					yTxtDep = yDepBase;
					
					xTxtArr = xArrBase;
					yTxtArr = yArrBase + coordRectArr.hCoord;
					break;
				}
				case 0: {
					xTxtDep = xDepBase + demiLarg;
					yTxtDep = yDepBase;
					
					xTxtArr = xArrBase + demiLarg;
					yTxtArr = yArrBase + coordRectArr.hCoord;
					break;
				}
				case 1: {
					xTxtDep = xDepBase + ((nodeArr.col - 1) * decalXDep);
					yTxtDep = yDepBase;
					
					xTxtArr = xArrBase + coordRectArr.wCoord;
					yTxtArr = yArrBase + coordRectArr.hCoord;
					break;
				}
			}
			break;
		}
	}
	
	drawLineArrow(xTxtDep, yTxtDep, xTxtArr, yTxtArr);
	
	ctx.beginPath();
	ctx.moveTo(xTxtDep, yTxtDep);
	ctx.lineTo(xTxtArr, yTxtArr);
	ctx.stroke();
}

function drawFilledPolygon(shape) {
	ctx.beginPath();
	ctx.moveTo(shape[0][0], shape[0][1]);
	for(p in shape) { if(p > 0) { ctx.lineTo(shape[p][0], shape[p][1]); } }
	ctx.lineTo(shape[0][0], shape[0][1]);
	ctx.fill();
}

function translateShape(shape, x, y) {
	var rv = [];
	for(p in shape) { rv.push([ shape[p][0] + x, shape[p][1] + y ]); }
	return rv;
}

function rotateShape(shape, ang) {
	var rv = [];
	for(p in shape) { rv.push(rotatePoint(ang, shape[p][0], shape[p][1])); }
	return rv;
}

function rotatePoint(ang, x, y) { return [ (x * Math.cos(ang)) - (y * Math.sin(ang)), (x * Math.sin(ang)) + (y * Math.cos(ang)) ]; }

function drawLineArrow(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	var ang = Math.atan2(y2 - y1, x2 - x1);
	drawFilledPolygon(translateShape(rotateShape(arrow, ang), x2, y2));
}

var lstGraphNodes = [ { "id": "GROUP1", "name": "GRP 1", "title": "", "row": 1, "col": 1, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP2", "name": "GRP 2", "title": "", "row": 1, "col": 2, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP3", "name": "GRP 3", "title": "", "row": 1, "col": 3, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP5", "name": "GROUP5", "title": "", "row": 5, "col": 1, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP6", "name": "GROUP6", "title": "", "row": 6, "col": 1, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP11", "name": "GROUP11", "title": "", "row": 6, "col": 2, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] }, { "id": "GROUP6", "name": "GROUP6", "title": "", "row": 6, "col": 1, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP11", "name": "GROUP11", "title": "", "row": 6, "col": 2, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP4", "name": "GRP 4", "title": "", "row": 4, "col": 1, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP5", "name": "GROUP5", "title": "", "row": 5, "col": 1, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP6", "name": "GROUP6", "title": "", "row": 6, "col": 1, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP11", "name": "GROUP11", "title": "", "row": 6, "col": 2, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] } ] }, { "id": "GROUP8", "name": "GROUP8", "title": "", "row": 5, "col": 3, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP7", "name": "GRP 7", "title": "", "row": 4, "col": 3, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP8", "name": "GROUP8", "title": "", "row": 5, "col": 3, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] }, { "id": "GROUP10", "name": "GROUP10", "title": "", "row": 5, "col": 4, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP9", "name": "GRP 9", "title": "", "row": 4, "col": 4, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP10", "name": "GROUP10", "title": "", "row": 5, "col": 4, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] }, { "id": "GROUP12", "name": "GRP 12", "title": "", "row": 1, "col": 4, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 43.7899246, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP13", "name": "GRP 13", "title": "", "row": 2, "col": 1, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 43.7899246, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP14", "name": "GRP 14", "title": "", "row": 2, "col": 2, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 43.7899246, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "root", "name": "root", "title": "root", "row": 3, "col": 2, "idparent": null, "nodecolor": "green", "hautTitre": 13.4062481, "largTitre": 23.3420124, "hautSsTitre": 0, "largSsTitre": 22.4826374, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP1", "name": "GRP 1", "title": "", "row": 1, "col": 1, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP2", "name": "GRP 2", "title": "", "row": 1, "col": 2, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP3", "name": "GRP 3", "title": "", "row": 1, "col": 3, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP4", "name": "GRP 4", "title": "", "row": 4, "col": 1, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP5", "name": "GROUP5", "title": "", "row": 5, "col": 1, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP6", "name": "GROUP6", "title": "", "row": 6, "col": 1, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP11", "name": "GROUP11", "title": "", "row": 6, "col": 2, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] } ] }, { "id": "GROUP7", "name": "GRP 7", "title": "", "row": 4, "col": 3, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP8", "name": "GROUP8", "title": "", "row": 5, "col": 3, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 51.24305, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] }, { "id": "GROUP9", "name": "GRP 9", "title": "", "row": 4, "col": 4, "idparent": null, "nodecolor": "red", "hautTitre": 13.4062481, "largTitre": 37.4670067, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": [ { "id": "GROUP10", "name": "GROUP10", "title": "", "row": 5, "col": 4, "idparent": null, "nodecolor": "purple", "hautTitre": 13.4062481, "largTitre": 57.5659637, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] }, { "id": "GROUP12", "name": "GRP 12", "title": "", "row": 1, "col": 4, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 43.7899246, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP13", "name": "GRP 13", "title": "", "row": 2, "col": 1, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 43.7899246, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null }, { "id": "GROUP14", "name": "GRP 14", "title": "", "row": 2, "col": 2, "idparent": null, "nodecolor": "blue", "hautTitre": 13.4062481, "largTitre": 43.7899246, "hautSsTitre": 0, "largSsTitre": 0, "hgX": 0, "hgY": 0, "bgX": 0, "bgY": 0, "hdX": 0, "hdY": 0, "bdX": 0, "bdY": 0, "children": null } ] } ];

Draw2(lstGraphNodes);