// Typescript code was compiled and tested on http://fiddlesalad.com/typescript/
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var decalCadre: number = 15;
var colInter: number = 50;
var ligInter: number = 50;

var lstRects;
var lstErr;

var arrow = [
    [ 2, 0 ],
    [ -10, -4 ],
    [ -10, 4]
];

interface GraphNode {
	id: string;
	name: string;
	title: string;
	row: number;
	col: number;
	idparent: number;
	nodecolor: string;

	hautTitre: number;
	largTitre: number;
	hautSsTitre: number;
	largSsTitre: number;

	hgX: number;
	hgY: number;
	bgX: number;
	bgY: number;
	hdX: number;
	hdY: number;
	bdX: number;
	bdY: number;

	children: GraphNode;
}

class CoordRect {
	xCoord: number;
	yCoord: number;
	hCoord: number;
	wCoord: number;
	
	constructor(public x, public y, public h, public w) {
        this.xCoord = x;
		this.yCoord = y;
		this.hCoord = h;
		this.wCoord = w;
    }
}

class GraphRects {
	ligRect: number;
	colRect: number;
	coordRect: CoordRect;
	
	constructor(public lig, public col, public coord) {
        this.ligRect = lig;
		this.colRect = col;
		this.coordRect = coord;
    }
}

function greaterNum(value1: number, value2: number){
	if(value1 < value2) {
		return -1;
	}
	
	if(value1 > value2) {
		return 1;
	}
	
	return 0;
}

function Draw2(lstGraphNodes: GraphNode) {
	// Get number of rows and columns for the graph
	var maxCol: number = Math.max.apply(Math,lstGraphNodes.map(function(o){return o.col;}));
	var maxRow: number = Math.max.apply(Math,lstGraphNodes.map(function(o){return o.row;}));
	
	// Get max width / height for the graph
	var maxLargTitre: number = Math.max.apply(Math,lstGraphNodes.map(function(o){return o.largTitre;}));
	var maxHautTitre: number = Math.max.apply(Math,lstGraphNodes.map(function(o){return o.hautTitre;}));
	
	var maxLargSsTitre: number = Math.max.apply(Math,lstGraphNodes.map(function(o){return o.largSsTitre;}));
	var maxHautSsTitre: number = Math.max.apply(Math,lstGraphNodes.map(function(o){return o.hautSsTitre;}));
	var maxHautTitres: number = maxHautTitre + maxHautSsTitre;
	
	// Get size of 1 node
	var hautRect: number = maxHautTitres + (2 * decalCadre);
	var largRect: number = maxLargTitre + (2 * decalCadre);
	
	// Size max of the graph
	var maxLarg: number = (maxCol * largRect) + ((maxCol) * colInter);
    var maxHaut: number = (maxRow * hautRect) + ((maxRow) * ligInter);
	
	// Draw green rectangles and fill list containing their location
	lstRects = new GraphRects[];
	for (var i = 0; lstGraphNodes.length > i; i++) {
		var node: GraphNode = lstGraphNodes[i];
		
		if(node.col != 0 && node.row != 0) {
			var coordsRect: CoordRect = DrawRectangle(node, hautRect, largRect);
			var graphRect = new GraphRects(node.row, node.col, coordsRect);
			lstRects.push(graphRect);
		}
	}
	
	// Draw titles and subtitles based on green rectangles
	lstErr = new string[];
	for (var i = 0; lstGraphNodes.length > i; i++) {
		var node: GraphNode = lstGraphNodes[i];
		
		if(node.col != 0 && node.row != 0) {
			DrawText(node, maxLargTitre, maxHautTitre, maxHautSsTitre);
		}
	}
	
	//console.info(lstRects);
}

// Function used to calculate X / Y coordinates of rectangle
function CalculXY(ligCol: number, hwRect: number) {
	var result: number = ((((ligCol - 1) * hwRect) + (ligCol * colInter)) - decalCadre);
    return result;
}

function DrawRectangle(node: GraphNode, hRect: number, wRect: number) {
	// X / Y calculation of green rectangle
	var xRect: number = CalculXY(node.col, wRect);
    var yRect: number = CalculXY(node.row, hRect);
	
	// Draw of green rectangle
	ctx.beginPath();
	ctx.rect(xRect, yRect, wRect, hRect);
	ctx.fillStyle = "lightgreen";
	ctx.fill();
	
	// Send back location and size of green rectangle
	var coordRect = new CoordRect(xRect, yRect, hRect, wRect);
	return coordRect;
}

function DrawText(node: GraphNode, maxLargTitre: number, maxHautTitre: number, maxHautSsTitre: number) {
	// Get rectangle associated with the current node
	var node2: GraphNode = node;
	var rect: GraphRects = lstRects.filter(function( obj ) {
		return obj.colRect == node2.col && obj.ligRect == node2.row;
	});
	
	// Calculation of title's coordinates based on the rectangle
	var xTitre: number = rect[0].coordRect.xCoord + decalCadre;
	var yTitre: number = rect[0].coordRect.yCoord + decalCadre;
	
	// Calculation of subtitle's coordinates
	var xSsTitre: number = xTitre;
	var ySsTitre: number = yTitre + maxHautTitre;
	
	// Title's font color + writing
	ctx.fillStyle = node.nodecolor;
	ctx.fillText(node.name, xTitre, yTitre);
	// Subtitle's font color + writing
	ctx.fillStyle = "black";
	ctx.fillText(node.title, xSsTitre, ySsTitre);
	
	// Update of X/Y coordinates for all the corners of the rectangle
	node.hgX = rect[0].coordRect.xCoord;
	node.hgY = rect[0].coordRect.yCoord;

	node.hdX = rect[0].coordRect.xCoord + rect[0].coordRect.wCoord;
	node.hdY = rect[0].coordRect.yCoord;

	node.bgX = rect[0].coordRect.xCoord;
	node.bgY = rect[0].coordRect.yCoord + rect[0].coordRect.hCoord;

	node.bdX = rect[0].coordRect.xCoord + rect[0].coordRect.wCoord;
	node.bdY = rect[0].coordRect.yCoord + rect[0].coordRect.hCoord;
	
	// Draw of lines to child node
	if (node.children != null) {
		for (var i = 0; node.children.length > i; i++) {
			var child: GraphNode = node.children[i];
			
			// Get coordinates of child node's rectangle
			var rectFils: GraphRects = lstRects.filter(function( obj ) {
				return obj.colRect == child.col && obj.ligRect == child.row;
			});
			
			if(rectFils.length > 0) {
				var coordRectArr: CoordRect = rectFils[0].coordRect;
                DrawLine(node, child, rect[0].coordRect, coordRectArr);
			}
		}
	}
}

function DrawLine(nodeDep: GraphNode, nodeArr: GraphNode, coordRectDep: CoordRect, coordRectArr: CoordRect) {
	// Creation of the arrow
	
	// Initialization of arrow's coordiantes
	var xTxtDep: number = 0;
	var xTxtArr: number = 0;
	var yTxtDep: number = 0;
	var yTxtArr: number = 0;
	
	// Default coordinates of arrow
	var xDepBase: number = coordRectDep.xCoord;
	var yDepBase: number = coordRectDep.yCoord;
	var xArrBase: number = coordRectArr.xCoord;
	var yArrBase: number = coordRectArr.yCoord;
	
	// Final calculation of arrow's coordinates
	// To have :
	//     -1  if Row/Col start lesser than Row/Col end
	//     0   if Row/Col start equals to Row/Col end
	//     1   if Row/Col start greater than Row/Col end
	var signLig: number = greaterNum(nodeDep.row, nodeArr.row);
	var signCol: number = greaterNum(nodeDep.col, nodeArr.col);
	
	var demiLarg: number = coordRectDep.wCoord / 2;
	var decalXDep: number = 0;
	if (nodeDep.col != 1) { decalXDep = demiLarg / (nodeDep.col - 1) };
	switch (signLig) {
		// Row start lesser than Row end
		case -1:
			switch (signCol) {
				// Col start lesser than Col end
				case -1:
					xTxtDep = xDepBase + demiLarg + ((nodeArr.col - nodeDep.col - 1) * decalXDep);
					yTxtDep = yDepBase + coordRectDep.hCoord;

					xTxtArr = xArrBase;
					yTxtArr = yArrBase;
					break;
					
				// Col start equals to Col end
				case 0:
					xTxtDep = xDepBase + demiLarg;
					yTxtDep = yDepBase + coordRectDep.hCoord;

					xTxtArr = xArrBase + demiLarg;
					yTxtArr = yArrBase;
					break;
					
				// Col start greater than Col end
				case 1:
					xTxtDep = xDepBase + ((nodeArr.col - 1) * decalXDep);
					yTxtDep = yDepBase + coordRectDep.hCoord;

					xTxtArr = xArrBase + coordRectArr.wCoord;
					yTxtArr = yArrBase;
					break;
			}
			break;
			
		// Row start equals to Row end
		case 0:
			switch (signCol) {
				// Col start lesser than Col end
				case -1:
					xTxtDep = xDepBase + coordRectDep.wCoord;
					yTxtDep = yDepBase + (coordRectDep.hCoord / 2);

					xTxtArr = xArrBase;
					yTxtArr = yArrBase + (coordRectArr.hCoord / 2);
					break;
					
				// Col start equals to Col end
				case 0:
					break;
					
				// Col start greater than Col end
				case 1:
					xTxtDep = xDepBase;
					yTxtDep = yDepBase + (coordRectDep.hCoord / 2);

					xTxtArr = xArrBase + coordRectArr.wCoord;
					yTxtArr = yArrBase + (coordRectArr.hCoord / 2);
					break;
			}
			break;
			
		// Row start greater than Row end
		case 1:
			switch (signCol) {
				// Col start lesser than Col end
				case -1:
					xTxtDep = xDepBase + demiLarg + ((nodeArr.col - nodeDep.col - 1) * decalXDep);
					yTxtDep = yDepBase;

					xTxtArr = xArrBase;
					yTxtArr = yArrBase + coordRectArr.hCoord;
					break;
					
				// Col start equals to Col end
				case 0:
					xTxtDep = xDepBase + demiLarg;
					yTxtDep = yDepBase;

					xTxtArr = xArrBase + demiLarg;
					yTxtArr = yArrBase + coordRectArr.hCoord;
					break;
					
				// Col start greater than Col end
				case 1:
					xTxtDep = xDepBase + ((nodeArr.col - 1) * decalXDep);
					yTxtDep = yDepBase;

					xTxtArr = xArrBase + coordRectArr.wCoord;
					yTxtArr = yArrBase + coordRectArr.hCoord;
					break;
			}
			break;
	}
	
	// Drawing of arrow
	drawLineArrow(xTxtDep, yTxtDep, xTxtArr, yTxtArr);
	// Draw line
	ctx.beginPath();
	ctx.moveTo(xTxtDep, yTxtDep);
	ctx.lineTo(xTxtArr, yTxtArr);
	ctx.stroke();
}

function drawFilledPolygon(shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0][0], shape[0][1]);

    for(p in shape)
        if (p > 0) ctx.lineTo(shape[p][0], shape[p][1]);

    ctx.lineTo(shape[0][0], shape[0][1]);
    ctx.fill();
}

function translateShape(shape, x, y) {
    var rv = [];
    for(p in shape)
        rv.push([ shape[p][0] + x, shape[p][1] + y ]);
    return rv;
}

function rotateShape(shape, ang) {
    var rv = [];
    for(p in shape)
        rv.push(rotatePoint(ang, shape[p][0], shape[p][1]));
    return rv;
}

function rotatePoint(ang, x, y) {
    return [
        (x * Math.cos(ang)) - (y * Math.sin(ang)),
        (x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
}

function drawLineArrow(x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    var ang = Math.atan2(y2-y1, x2-x1);
    drawFilledPolygon(translateShape(rotateShape(arrow, ang), x2, y2));
}

var lstGraphNodes = [{"id":"GROUP1","name":"GRP 1","title":"","row":1,"col":1,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP2","name":"GRP 2","title":"","row":1,"col":2,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP3","name":"GRP 3","title":"","row":1,"col":3,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP5","name":"GROUP5","title":"","row":5,"col":1,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP6","name":"GROUP6","title":"","row":6,"col":1,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP11","name":"GROUP11","title":"","row":6,"col":2,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]},{"id":"GROUP6","name":"GROUP6","title":"","row":6,"col":1,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP11","name":"GROUP11","title":"","row":6,"col":2,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP4","name":"GRP 4","title":"","row":4,"col":1,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP5","name":"GROUP5","title":"","row":5,"col":1,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP6","name":"GROUP6","title":"","row":6,"col":1,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP11","name":"GROUP11","title":"","row":6,"col":2,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]}]},{"id":"GROUP8","name":"GROUP8","title":"","row":5,"col":3,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP7","name":"GRP 7","title":"","row":4,"col":3,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP8","name":"GROUP8","title":"","row":5,"col":3,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]},{"id":"GROUP10","name":"GROUP10","title":"","row":5,"col":4,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP9","name":"GRP 9","title":"","row":4,"col":4,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP10","name":"GROUP10","title":"","row":5,"col":4,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]},{"id":"GROUP12","name":"GRP 12","title":"","row":1,"col":4,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":43.7899246,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP13","name":"GRP 13","title":"","row":2,"col":1,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":43.7899246,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP14","name":"GRP 14","title":"","row":2,"col":2,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":43.7899246,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"root","name":"root","title":"root","row":3,"col":2,"idparent":null,"nodecolor":"green","hautTitre":13.4062481,"largTitre":23.3420124,"hautSsTitre":0,"largSsTitre":22.4826374,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP1","name":"GRP 1","title":"","row":1,"col":1,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP2","name":"GRP 2","title":"","row":1,"col":2,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP3","name":"GRP 3","title":"","row":1,"col":3,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP4","name":"GRP 4","title":"","row":4,"col":1,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP5","name":"GROUP5","title":"","row":5,"col":1,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP6","name":"GROUP6","title":"","row":6,"col":1,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP11","name":"GROUP11","title":"","row":6,"col":2,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]}]},{"id":"GROUP7","name":"GRP 7","title":"","row":4,"col":3,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP8","name":"GROUP8","title":"","row":5,"col":3,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":51.24305,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]},{"id":"GROUP9","name":"GRP 9","title":"","row":4,"col":4,"idparent":null,"nodecolor":"red","hautTitre":13.4062481,"largTitre":37.4670067,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":[{"id":"GROUP10","name":"GROUP10","title":"","row":5,"col":4,"idparent":null,"nodecolor":"purple","hautTitre":13.4062481,"largTitre":57.5659637,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]},{"id":"GROUP12","name":"GRP 12","title":"","row":1,"col":4,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":43.7899246,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP13","name":"GRP 13","title":"","row":2,"col":1,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":43.7899246,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null},{"id":"GROUP14","name":"GRP 14","title":"","row":2,"col":2,"idparent":null,"nodecolor":"blue","hautTitre":13.4062481,"largTitre":43.7899246,"hautSsTitre":0,"largSsTitre":0,"hgX":0,"hgY":0,"bgX":0,"bgY":0,"hdX":0,"hdY":0,"bdX":0,"bdY":0,"children":null}]}];

Draw2(lstGraphNodes);
//document.body.innerHTML = Draw2(lstGraphNodes);