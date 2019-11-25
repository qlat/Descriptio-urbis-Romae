var bigHorizon;
var bigHorizonRadius = 0;
var horizonDegree = 0;
var horizonCenter = 0;

var variantMarkRadius = 5;

var numAnimationsRunning = 0;

// Set up and decoration as present in certain ms
globals.horizonSetup = "O";

// Rotatable radius
globals.radius = null;

// Main list of all AlbertisCoordinates
globals.albertisCoordinates = [];
//globals.mainMs = "Boriaud-Furlan";
globals.mainMs = "Boriaud-Furlan";
globals.variantMss = [];
// Rotation of horizon in multiples of (2*pi/48), i.e. of bigStep
globals.HorizonRotation = 12;

// Possible values are "none", "choose_start_coord", "choose_variant", "measure_distance", "construction"
globals.app_state = "construction";

// Indicates whether a drawing animation is currently active
globals.draw_animation = false;

// Indicates the current state of the variants (expanded/collpased)
globals.variants_expanded = false;

// Draw map according to B/F and "per_unit" and make some adjustments for the insula
globals.niceMap = false;

globals.circleOverlay = false;

globals.construction_cursor = null;


globals.measureOverlay = {
    
    startPoint: null,
    startCoord: null,
    endCoord: null,
    waitingForEndCoord: false,

    // Path to connect start and end coord
    indicatorPath: null,
}

globals.backgroundMap = null;

// Drawing styles
globals.defaultPathStrokeWidth = 3;
globals.defaultStrokeColor = new paper.Color(0.0, 0.0, 0.0);
globals.defaultAngulusRadius = 3;
globals.defaultAvxRadius = 3;

globals.variantPathStrokeColor = new paper.Color(0.8, 0.8, 0.8);
globals.variantCircleStrokeColor = new paper.Color(1.0, 0.51, 0);

globals.horizonNumberColor = new paper.Color(0.18, 0.18, 0.18);
globals.horizonColor = new paper.Color(0.18, 0.18, 0.18);

globals.horizonStrokeWidth = 0.5;


globals.aedificiumDesc = {
    strokeColor: new paper.Color(0, 0, 0),
    fillColor: new paper.Color(0, 0, 0),
    shape: "square",
    strokeWidth: 1,
    size: 2
}

globals.portaDesc = {
    strokeColor: new paper.Color(1, 0, 0),
    fillColor: new paper.Color(1, 0, 0),
    shape: "porta",
    strokeWidth: 2,
    size: 5
}

globals.angulusDesc = {
    strokeColor: new paper.Color(0, 0, 0),
    fillColor: new paper.Color(1, 1, 1),
    shape: "circle",
    strokeWidth: 1.5,
    size: 3
}

globals.avxDesc = {
    strokeColor: new paper.Color(0, 0, 0),
    fillColor: new paper.Color(1, 1, 1),
    shape: "circle",
    strokeWidth: 1.5,
    size: 3
}

globals.insulaAvxDesc = {
    strokeColor: new paper.Color(0,0,0),
    fillColor: new paper.Color(1, 1, 1),
    shape: "circle",
    strokeWidth: 1.5,
    size: 3
}

globals.avxLaterisFluminisDesc = {
    strokeColor: new paper.Color(0, 0.33, 0.86),
    fillColor: new paper.Color(1, 1, 1),
    shape: "circle",
    strokeWidth: 1.5,
    size: 3
}

globals.flumenDesc = {
    strokeColor: new paper.Color(0, 0.33, 0.86),
    fillColor: new paper.Color(1,1,1),
    shape: "circle",
    strokeWidth: 2,
    size: 3
}

globals.latusFluminisDesc = {
    strokeColor: new paper.Color(0, 0.33, 0.86),
    fillColor: new paper.Color(1,1,1),
    shape: "circle",
    strokeWidth: 2,
    size: 3
}


// Global options
globals.options = {
    drawMode: "all", // per table, per unit, all
    showVariants: false,
    includePortae: true,
    includeMonumenta: true
}


// Event management functions
var mouseDownPoint = {};

globals.descriptioMouseDown = function (event) {
    console.log("***Mouse click. Event=" + event);
    console.log("***Item=" + event.item);

    mouseDownPoint = event.point;

    if (event.item) {

        console.log("Clicked on:");
        console.log(event.item.data);
        
        coord = event.item.data;

        if (globals.app_state == "choose_start_coord") {
            //console.log("Choosing start coord...");

            if (coord.hasOwnProperty('coordType')) {
                console.log("Select have a valid coord!");

                // Determine draw mode table this coord belongs to
                dmtIdx = coord.table;
                console.log("Set start coord of table "+coord.table+" to "+coord.index);

                // Set new start coord
                drawModeTables.perTable[dmtIdx].startIndex = coord.index;

                // Set start coord marker
                cartPoint = coord.variants[coord.mainVariantIndex].cartesianPoint;
                p = new paper.Point(cartPoint.x+4, cartPoint.y-7);
                console.log(p);

                drawModeTables.perTable[dmtIdx].startMarker.position = p;
                newStartMarkerPosChoosen = true;
            }
        }

        if (globals.app_state == "choose_variant") {

            isVariant = false;

            if (coord.hasOwnProperty('coordType')) {
                console.log("We have a valid coord!");

                if (coord.variants.length > 1) {

                    for (i=0;i<coord.variants.length;i++) {
                        if (markerName == coord.variants[i].coordMarkerName) {

                            isVariant = true;

                            idx = globals.variantMss.indexOf(coord.variants[i].ms);
                            console.log("About to choose variant from ms "+coord.variants[i].ms+ " with index="+idx);

                            oldMainMs = globals.mainMs;
                            btnId = '#main-ms-' + coord.variants[i].ms.toLowerCase() + '-btn';
                            console.log("Button id for main ms: "+btnId);

                            // Change mss by clicking buttons
                            flashEnabled = false;
                            $(btnId).click();
                            toggleVariantMss('off');

                            chooseVariant(coord.variants[i].ms);
                            
                            break;
                        }
                    }

                }

                if (!isVariant) {
                    console.log("No variant.");
            }

        }
    }

    if (globals.app_state == "measure_distance") {

        console.log("Measure distance:");
        console.log(coord);

        if (coord.hasOwnProperty('coordType')) {
            console.log("Select have a valid coord!");

            if (globals.measureOverlay.startCoord == null) {
                
                globals.measureOverlay.startPoint = new paper.Point(coord.variants[idx].cartesianPoint.x, coord.variants[idx].cartesianPoint.y);
                globals.measureOverlay.startCoord = coord;
                globals.measureOverlay.waitingForEndCoord = true;

                globals.measureLayer.activate();
                placeMeasurePin(coord);
               
                idx = coord.mainVariantIndex;
                path = new paper.Path();
                path.add(coord.variants[idx].cartesianPoint.x, coord.variants[idx].cartesianPoint.y);
                path.add(coord.variants[idx].cartesianPoint.x, coord.variants[idx].cartesianPoint.y);
                path.strokeColor = new paper.Color(0.18,0.18,0.18);
                path.dashArray = [4,3];
                path.strokeWidth = 0.75;

                globals.measureOverlay.indicatorPath = path;


            }
            else {

                globals.measureOverlay.endCoord = coord;
                globals.measureOverlay.waitingForEndCoord = false;

                globals.measureLayer.activate();

                // Save dest point
                idx = coord.mainVariantIndex;
                destPoint = new paper.Point(coord.variants[idx].cartesianPoint.x, coord.variants[idx].cartesianPoint.y);
                globals.measureOverlay.indicatorPath.lastSegment.point = destPoint;

                

                // Get src point
                idx = globals.measureOverlay.startCoord.mainVariantIndex;
                srcPoint = new paper.Point(globals.measureOverlay.startCoord.variants[idx].cartesianPoint.x,
                                        globals.measureOverlay.startCoord.variants[idx].cartesianPoint.y);

                dist = Math.sqrt((destPoint.x-srcPoint.x)*(destPoint.x-srcPoint.x) + (destPoint.y-srcPoint.y)*(destPoint.y-srcPoint.y));


                

                
                //rect = new paper.Rectangle(new paper.Point(srcPoint), new paper.Point(20, 10));
                console.log('srcPoint:');
                console.log(srcPoint);

                rect_width = 30;
                rect_height = 18;
                adjust_y = 2;
                rect = new paper.Rectangle(new paper.Point(srcPoint.x-(rect_width*0.5), srcPoint.y-(rect_height*0.5)-adjust_y), new paper.Size(rect_width, rect_height));
                console.log("rect:");
                console.log(rect);

                // New path that connects start and end point
                measurePath = new paper.Path();
                measurePath.add(srcPoint);
                measurePath.add(srcPoint);
                measurePath.strokeColor = new paper.Color(0.18,0.18,0.18,0.8);
                measurePath.strokeWidth = 1;

                radius = new paper.Size(3, 3);
                rect_path = new paper.Path.Rectangle(rect, radius);
                rect_path.fillColor = new paper.Color(0.94,0.94,0.94,0.9);
                rect_path.strokeColor = new paper.Color(0.18,0.18,0.18,0.8);
                rect_path.strokeWidth = 2;


                

                distText = new paper.PointText(srcPoint);
                distText.content = 0;
                distText.fontSize = 7;
                distText.fontFamily = 'Segoe UI';
                distText.fillColor = new paper.Color(0,0,0);
                distText.justification = "center";
                

                finalPos = new paper.Point(srcPoint.x+(destPoint.x-srcPoint.x)*0.5, srcPoint.y+(destPoint.y-srcPoint.y)*0.5);

                


                tl = anime.timeline({
                    targets: distText,
                    duration: 1000,
                });
                placeMeasurePin(coord, tl).add({
                    targets: distText,
                    content: dist,
                    round: 2,
                    easing: 'easeInSine'
                }, 250).add({
                    targets: distText.point,
                    x: finalPos.x,
                    y: finalPos.y,
                    easing: 'easeInSine'
                }, 250).add({
                    targets: rect_path.position,
                    x: finalPos.x,
                    y: finalPos.y-adjust_y,
                    easing: 'easeInSine',

                }, 250).add({
                    targets: globals.measureOverlay.indicatorPath.firstSegment.point,
                    x: destPoint.x,
                    y: destPoint.y,
                    easing: 'easeInSine'
                }, 250).add({
                    targets: measurePath.lastSegment.point,
                    x: destPoint.x,
                    y: destPoint.y,
                    easing: 'easeInSine',
                }, 250);

                

                globals.measureOverlay.startCoord = null;
                globals.measureOverlay.endCoord = null;
                globals.measureOverlay.indicatorPath = null;
                globals.measureOverlay.waitingForEndCoord = false;

            }
    }

    }

    }
}

globals.descriptioMouseDrag = function (event) {
    
    mouseDragged = true;

    vec = event.point.subtract(mouseDownPoint);
    paper.view.translate(vec);
}


globals.descriptioMouseUp = function (event) {

    mouseDragged = false;
}


globals.descriptioMouseMove = function (event) {
    globals.CurrentMousePosition = event.point;


    if (globals.app_state == "construction") {

        //console.log("x="+event.point.x+", y="+event.point.y+", horizon center: ("+horizonCenter.x+"|"+horizonCenter.y+")");

        relX = event.point.x - horizonCenter.x;
        relY = -(event.point.y - horizonCenter.y);
        //console.log("rel_pos=("+relX+"|"+relY+")");

        hypotenuse = Math.sqrt(relX * relX + relY * relY);

        //angleCart = Math.atan(relY / relX) - (Math.PI / 2);
        //angleCart = Math.asin(relY / hypotenuse) - (Math.PI / 2);
        vec1_x = 0;
        vec1_y = 1;

        len = Math.sqrt(relX * relX + relY * relY);
        relX /= len;
        relY /= len;

        angleCart = Math.acos(vec1_x * relX + vec1_y * relY);
        angleCart *= 180 / Math.PI;

        if (relX < 0) {
            angleCart = 180 + (180 - angleCart);
        }

        angleGradus = Math.round(angleCart / 7.5)
        angleMinuta = Math.round((angleCart - angleGradus * 7.5) / 1.875);


        radiusGradus = Math.round(hypotenuse / (bigHorizonRadius / 50));
        radiusMinuta = Math.round((hypotenuse - radiusGradus * (bigHorizonRadius / 50)) / (bigHorizonRadius / (50 * 4)));

        console.log("HG: " + angleGradus + " HM: " + angleMinuta + " RG: " + radiusGradus + " RM: " + radiusMinuta);

        r = radiusGradus * (bigHorizonRadius / 50) + radiusMinuta * (bigHorizonRadius / (50 * 4));

        // Adjustments
        if (relY < 0) {
            r *= -1;
        }
        
        angleAlberti = angleGradus * (2 * Math.PI / 48) + angleMinuta * (2 * Math.PI / (48 * 4));
        angleAlberti += Math.PI / 2;

        x = r * Math.cos(angleAlberti);  
        y = r * Math.sin(angleAlberti);

        // Lower right quadrant
        if (relX > 0 && relY < 0) {
            x *= -1;
            y *= -1;
        }

        // Lower left quadrant
        if (relX < 0 && relY < 0) {
            x *= -1;
            y *= -1;
        }

        cart_point = new paper.Point(horizonCenter.x-x, horizonCenter.y - y);


        if (globals.construction_cursor != null) {
            globals.construction_cursor.remove();
        }

        globals.construction_cursor = new paper.Path.Circle(cart_point, 2);
        globals.construction_cursor.strokeColor = new paper.Color(1, 0, 0);
        globals.construction_cursor.strokeWidth = 1.5;
    }

    
    if (globals.app_state == "measure_distance" && globals.measureOverlay.waitingForEndCoord) {
        
        //srcPoint = getPointFromCoord(globals.measureOverlay.startCoord);
        
        p = new paper.Point(event.point.x, event.point.y);

        factor = 0.9;

        // Prevent overlay of path over coords
        deltaX = 0.5;
        deltaY = 0.5;

        if (event.point.x <= globals.measureOverlay.startPoint.x) {
            deltaX *= -1;
        }

        if (event.point.y <= globals.measureOverlay.startPoint.y) {
            deltaY *= -1;
        }

        //destPoint = new paper.Point(srcPoint.x+(p.x-srcPoint.x)*factor, srcPoint.y+(p.y-srcPoint.y)*factor);
        destPoint = new paper.Point(p.x-deltaX, p.y-deltaY);

        globals.measureOverlay.indicatorPath.lastSegment.point = destPoint;
    }

    if (event.item) {
        console.log(event.item.data);
        
        coord = event.item.data;

        if (globals.app_state == "choose_start_coord") {
            console.log("Choosing start coord...");

            newStartMarkerPosChoosen = false;

            if (coord.hasOwnProperty('coordType')) {
                console.log("We have a valid coord!");

                // Determine draw mode table this coord belongs to
                dmtIdx = coord.table;
                console.log("Possible start coord for table "+coord.table+": "+coord.index);

                // Fade out every other table
                //highlightDrawModeTable(dmtIdx);

                // Temporarily move start marker
                cartPoint = coord.variants[coord.mainVariantIndex].cartesianPoint;
                p = new paper.Point(cartPoint.x+4, cartPoint.y-7);
                console.log(p);

                drawModeTables.perTable[dmtIdx].startMarker.position = p;

                console.log("Highlight table "+dmtIdx);
                highlightDrawModeTable(dmtIdx);
            }
        }

        if (globals.variants_expanded) {

            console.log(coord);
            console.log("Name: "+event.item.name);

            markerName = event.item.name;

            isVariant = false;

            if (coord.variants.length > 1) {

                for (i=0;i<coord.variants.length;i++) {
                    if (markerName == coord.variants[i].coordMarkerName) {

                        isVariant = true;
                        console.log("Hover variant for ms "+coord.variants[i].ms);
                        break;
                    }
                }

            }

            if (!isVariant) {
                console.log("No variant.");
            }



            
        }

       if (coord.hasOwnProperty('coordType')) {
            console.log("We have a valid coord!");

            variant = coord.variants[coord.mainVariantIndex];
            //console.log(variant);
            console.log("Ms: '" + variant.ms + "', (" + variant.horizonGradus + "," + variant.horizonMinuta + "|" + variant.radiusGradus + "," + variant.radiusMinuta + ")");

       }
        


    }
    else {
        /*
        console.log("No coord, clean up!");
        console.log("New start marker pos choosen="+newStartMarkerPosChoosen);
        console.log("Highlighted = "+dmtHighlighted);
        */

        // No coord choosen => clean up
        if (dmtHighlighted) {

            // Unhighlight all tables
            unhighlightDrawModeTables();

            if (!newStartMarkerPosChoosen) {

                resetStartMarkerPositions();
            }
        }

        
    }
}

// Paper.js animation loop
globals.descriptioFrame = function (event) {

    dT = event.delta;
    //console.log("New frame.");



    if (globals.draw_animation) {

        globals.pathLayer.activate();

        // Security check to avoid errors that awkwardly seem to affect JavaScript 
        if (drawModeTables.perTable != null) {

            for (t = 0; t < drawModeTables.perTable.length; t++) {

                currTable = drawModeTables.perTable[t];

                if (currTable.animate) {

                    currTable.animDelta += dT;

                    if (currTable.path == null) {
                        //console.log("Create path.");
                        currTable.path = new paper.Path();
                        currTable.path.strokeColor = globals.defaultStrokeColor;
                        currTable.path.strokeWidth = globals.defaultPathStrokeWidth;

                        if (globals.niceMap) {

                            // Resort coords
                            if (t == 4) {
                                console.log("Table 4 has "+currTable.animCoords.length+" coords:");
                                console.log(currTable.animCoords);

                                // Insula table
                                currTable.animCoords.move(2,3);
                                // Duplicate start point so we get a closed path
                                currTable.animCoords.push(currTable.animCoords[0]);
                            }

                            if (t == 5) {

                                // Brute force sort the coords to draw nicely
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 1), 0);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 14 && x.origCoordNumber == 1), 1);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 2), 2);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 3), 3);

                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 14 && x.origCoordNumber == 2), 4);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 4), 5);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 14 && x.origCoordNumber == 3), 6);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 5), 7);

                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 6), 8);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 14 && x.origCoordNumber == 4), 9);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 7), 10);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 14 && x.origCoordNumber == 5), 11);
                               currTable.animCoords.move(currTable.animCoords.findIndex(x => x.origTable == 13 && x.origCoordNumber == 8), 12);

                               // Get first coord from next table to connect the river nicely
                               addCoord = drawModeTables.perTable[t+1].animCoords[0];
                               currTable.animCoords.push(addCoord);
                               currTable.animCoords.move(13,8);
                               
                            }

                            

                        }

                        lastWasAvx = false;
                        lastWasFlumen = false;
                        isFlumen = false;
                        for (i = 0; i < currTable.animCoords.length; i++) {

                            // Add new coord
                            newCoord = currTable.animCoords[i];
                            //console.log("choord type=" + newCoord.coordType);
                            console.log("Animate coord type " + newCoord.coordType + " from table #" + newCoord.origTable);

                            cartPoint = newCoord.variants[newCoord.mainVariantIndex].cartesianPoint;
                            currTable.path.add(cartPoint);

                            if (lastWasAvx) {
                                currTable.path.lastSegment.previous.smooth({
                                    type: 'catmull-rom',
                                    factor: 0.5
                                });
                                lastWasAvx = false;


                                globals.circleOverlayLayer.activate();

                                // point3 is guaranteed to exist
                                point3 = currTable.path.lastSegment;

                                if (currTable.path.lastSegment.previous != null) {
                                    point2 = currTable.path.lastSegment.previous;

                                    if (currTable.path.lastSegment.previous.previous != null) {
                                        point1 = currTable.path.lastSegment.previous.previous;
                                    }
                                    else {
                                        point1 = point3;
                                    }
                                }
                                else {
                                    point2 = point3;
                                }
                                c = new paper.Path.Arc(point1.point, point2.point, point3.point);
                                c.strokeColor = new paper.Color(1,0,0);
                                c.strokeWidth = 1.5;
                                
                               globals.pathLayer.activate();
                            }


                            if (newCoord.coordType.includes("Avx")) {
                                lastWasAvx = true;
                            }

                            if (newCoord.coordType.includes("Flum")) {
                                isFlumen = true;
                            } else {
                                console.log("No flumen!");
                                lastWasFlumen = false;
                            }

                        }
                        globals.circleOverlayLayer.visible = false;
                        globals.circleOverlayLayer.opacity = 0;

                        currTable.path.dashOffset = currTable.path.length;
                        currTable.path.dashArray = [currTable.path.length, currTable.path.length];

                        if (globals.options.drawMode == "per_unit" || globals.options.drawMode == "per_table") {
                            if (isFlumen) {
                                currTable.path.strokeColor = globals.flumenDesc.strokeColor;
                                currTable.path.strokeWidth = 6;

                            }
                        }

                        d = 2000;
                        if (globals.options.drawMode == "all") {
                            d = 4000;
                        }
                        if (globals.options.drawMode == 'per_unit') {
                            d = 3000;
                        }

                        anime({
                            targets: currTable.path,
                            dashOffset: 0,
                            easing: 'linear',
                            duration: d,
                            easing: 'easeInOutCubic',
                            round: 1
                        });

                    }

                    currTable.animate = false;
                }

            }

        }

        globals.niceMap = false;

    }

}


function drawHorizon() {

    console.log("Draw horizon according to ms '" + globals.horizonSetup + "'.");
    console.log("paper.view=" + paper.view.viewSize);

    globals.horizonLayer.activate();

    width = paper.view.viewSize.width;
    height = paper.view.viewSize.height;

    // Calculate center and radius based on current viewSize
    horizonCenter = new paper.Point(width / 2, height / 2);
    console.log("Horizon center: " + horizonCenter);



    //bigHorizonRadius = ((width < height ? width : height) / 2) - 25;
    bigHorizonRadius = 535;
    middleHorizonRadius = bigHorizonRadius * 0.9;
    smallHorizonRadius = bigHorizonRadius * 0.8;

    console.log("Big horizon radius: " + bigHorizonRadius);

    if (globals.horizonSetup == "O") {

        // Create the big circle
        bigHorizon = new paper.Path.Circle(horizonCenter, bigHorizonRadius);
        bigHorizon.strokeColor = globals.horizonColor;
        bigHorizon.strokeWidth = globals.horizonStrokeWidth;

        // Create the middle circle
        middleHorizon = new paper.Path.Circle(horizonCenter, middleHorizonRadius);
        middleHorizon.strokeColor = globals.horizonColor;
        middleHorizon.strokeWidth = globals.horizonStrokeWidth;

        // Create the small circle
        smallHorizon = new paper.Path.Circle(horizonCenter, smallHorizonRadius);
        smallHorizon.strokeColor = globals.horizonColor;
        smallHorizon.strokeWidth = globals.horizonStrokeWidth;


        // Precompute values for sin and cos
        bigStep = 2 * Math.PI / 48;
        smallStep = bigStep / 4;

        sinTable = [];
        cosTable = [];
        for (i = 0; i < 48; i++) {
            sinTable[i] = Math.sin((48 - i) * bigStep + globals.HorizonRotation * bigStep - bigStep); // '1' starts *after* 4 horizon minuta
            cosTable[i] = Math.cos((48 - i) * bigStep + globals.HorizonRotation * bigStep - bigStep);
        }

        sinPointTable = [];
        cosPointTable = [];
        for (i = 0; i < 48; i++) {
            sinPointTable[i] = Math.sin((48 - i) * bigStep + globals.HorizonRotation * bigStep - bigStep * 0.5); // '1' starts *after* 4 horizon minuta
            cosPointTable[i] = Math.cos((48 - i) * bigStep + globals.HorizonRotation * bigStep - bigStep * 0.5);
        }

        spikeSinTable = [];
        spikeCosTable = [];
        for (i = 0; i < 192; i++) {
            spikeSinTable[i] = Math.sin((144 - i) * smallStep + globals.HorizonRotation * smallStep - smallStep); // '1' starts *after* 4 horizon minuta
            spikeCosTable[i] = Math.cos((144 - i) * smallStep + globals.HorizonRotation * smallStep - smallStep);
        }

        // Draw little spikes
        for (i = 0; i < 192; i++) {

            if ((i+1) % 4 == 0) {
                continue;
            }

            // Draw lower spike
            x1 = horizonCenter.x + spikeCosTable[i] * smallHorizonRadius;
            y1 = horizonCenter.y - spikeSinTable[i] * smallHorizonRadius;

            x2 = horizonCenter.x + spikeCosTable[i] * (smallHorizonRadius + 4);
            y2 = horizonCenter.y - spikeSinTable[i] * (smallHorizonRadius + 4);

            lowerSpike = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
            lowerSpike.strokeColor = globals.horizonColor;
            lowerSpike.strokeWidth = globals.horizonStrokeWidth;

            // Draw upper spike
            x1 = horizonCenter.x + spikeCosTable[i] * middleHorizonRadius;
            y1 = horizonCenter.y - spikeSinTable[i] * middleHorizonRadius;

            x2 = horizonCenter.x + spikeCosTable[i] * (middleHorizonRadius - 4);
            y2 = horizonCenter.y - spikeSinTable[i] * (middleHorizonRadius - 4);

            upperSpike = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
            upperSpike.strokeColor = globals.horizonColor;
            upperSpike.strokeWidth = globals.horizonStrokeWidth;
        }


        // Draw speichen
        for (i = 0; i < 48; i++) {
            x1 = horizonCenter.x + cosTable[i] * smallHorizonRadius;
            y1 = horizonCenter.y - sinTable[i] * smallHorizonRadius;

            x2 = horizonCenter.x + cosTable[i] * bigHorizonRadius;
            y2 = horizonCenter.y - sinTable[i] * bigHorizonRadius;

            speiche = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
            speiche.strokeColor = globals.horizonColor;
            speiche.strokeWidth = globals.horizonStrokeWidth;
        }



        // Draw numbers
        for (i = 0; i < 48; i++) {

            point = new paper.Point(horizonCenter.x + cosPointTable[i] * bigHorizonRadius,
                horizonCenter.y - sinPointTable[i] * bigHorizonRadius);


            vec = new paper.Point(point.x - horizonCenter.x, point.y - horizonCenter.y);
            //console.log("vec=" + vec + ", bigHorizonRadius =" + bigHorizonRadius);

            //console.log("vec.normalize()=" + vec.normalize());

            vec = vec.normalize();
            vec = vec.multiply(bigHorizonRadius * 0.1 * 0.5);

            //console.log("vec after norm=" + vec);

            numberPoint = new paper.Point(point - vec);

            number = new paper.PointText(point);
            number.justification = 'center';
            number.fillColor = globals.horizonNumberColor;
            number.content = '' + (i + 1);
            number.font = 'Lusitana';

            number.position = number.position.add(new paper.Point(0, number.bounds.height * 0.33));
            number.position = number.position.subtract(vec);
        }


        // TODO Create various horizon designs according to edition(s)

        // Create Radius
        globals.radiusLayer.activate();

        globals.radius = new paper.Group();

        radiusHeight = 18;
        upperHeight = 4;
        bigStep = bigHorizonRadius * 0.1;
        smallStep = bigStep * 0.2;
        miniStep = smallStep * 0.25;

        // Main rectangle
        mainRect = new paper.Path.Rectangle(horizonCenter, new paper.Point(horizonCenter.x - bigHorizonRadius, horizonCenter.y + radiusHeight));
        mainRect.strokeColor = globals.horizonColor;
        mainRect.fillColor = new paper.Color(1,1,1);
        mainRect.strokeWidth = globals.horizonStrokeWidth;
        globals.radius.addChild(mainRect);

        // Second line
        upperLine = new paper.Path(new paper.Point(horizonCenter.x, horizonCenter.y + upperHeight),
                                   new paper.Point(horizonCenter.x - bigHorizonRadius, horizonCenter.y + upperHeight));
        upperLine.strokeColor = globals.horizonColor;
        upperLine.strokeWidth = globals.horizonStrokeWidth;
        globals.radius.addChild(upperLine);


        startPoint = new paper.Point(horizonCenter.x - bigHorizonRadius - radiusHeight, horizonCenter.y);

        arcPoint = new paper.Point(horizonCenter.x - bigHorizonRadius - Math.cos(45)*radiusHeight,
                                   horizonCenter.y + radiusHeight - Math.sin(45)*radiusHeight);

        endPoint = new paper.Point(horizonCenter.x - bigHorizonRadius, horizonCenter.y + radiusHeight);

        spike = new paper.Path();
        spike.add(new paper.Point(endPoint));
        spike.add(new paper.Point(endPoint.x, endPoint.y - radiusHeight));
        spike.add(new paper.Point(startPoint));
        spike.arcTo(arcPoint, endPoint);

        spike.strokeColor = globals.horizonColor;
        spike.fillColor = new paper.Color(1,1,1);
        spike.strokeWidth = globals.horizonStrokeWidth;
        globals.radius.addChild(spike);

        // Big separators, top to bottom
        for (i = 0; i < 10; i++) {
            bigSector = new paper.Path(new paper.Point(horizonCenter.x - (i+1)*bigStep, horizonCenter.y),
                                       new paper.Point(horizonCenter.x - (i+1)*bigStep, horizonCenter.y + radiusHeight));
            bigSector.strokeColor = globals.horizonColor;
            bigSector.strokeWidth = globals.horizonStrokeWidth;
            globals.radius.addChild(bigSector);

            // Place numbers
            numberPoint = new paper.Point(horizonCenter.x - (bigStep*0.5) - i*bigStep,
                                          horizonCenter.y + upperHeight + (radiusHeight-upperHeight)*0.5);

            radiusNumber = new paper.PointText(numberPoint);
            radiusNumber.justification = 'center';
            radiusNumber.fillColor = globals.horizonNumberColor;
            radiusNumber.content = '' + ((i + 1)*5);
            radiusNumber.fontSize = 6;
            radiusNumber.font = 'Lusitana';
            radiusNumber.position.y += radiusNumber.strokeBounds.height*0.3;

            globals.radius.addChild(radiusNumber);
        }

        // Small separators, top to bottom

        for (i = 0; i < 50; i++) {

            x = horizonCenter.x - (i)*smallStep;

            if (i % 5 == 0) {

                // Create three mini spikes
                for (j = 0; j < 3; j++) {
                    
                    littleX = x - (j + 1) * miniStep;

                    miniSpike = new paper.Path(new paper.Point(littleX, horizonCenter.y),
                                            new paper.Point(littleX, horizonCenter.y + (upperHeight*0.5)));
                    miniSpike.strokeWidth = globals.horizonStrokeWidth;
                    miniSpike.strokeColor = globals.horizonColor;
                    globals.radius.addChild(miniSpike);
                }

                continue;
            }
            
            littleSpike = new paper.Path(new paper.Point(x, horizonCenter.y),
                                        new paper.Point(x, horizonCenter.y + upperHeight));
            littleSpike.strokeWidth = globals.horizonStrokeWidth;
            littleSpike.strokeColor = globals.horizonColor;
            globals.radius.addChild(littleSpike);

            // Create three mini spikes
            for (j = 0; j < 3; j++) {
                
                littleX = x - (j + 1) * miniStep;

                miniSpike = new paper.Path(new paper.Point(littleX, horizonCenter.y),
                                           new paper.Point(littleX, horizonCenter.y + (upperHeight*0.5)));
                miniSpike.strokeWidth = globals.horizonStrokeWidth;
                miniSpike.strokeColor = globals.horizonColor;
                globals.radius.addChild(miniSpike);
            }
        }


        // Rotate to 0
        globals.radius.rotate(90 + 326.25, horizonCenter);
        //globals.radius.rotate(90 + 322.5, horizonCenter);
        //globals.radius.rotate(90, horizonCenter);
        globals.radius.visible = false;


        // Contained inside MS O
        // TODO Change in future versions
        if (globals.app_state == "construction") {

            // Degrees
            x1 = horizonCenter.x;
            y1 = horizonCenter.y;

            for (i = 0; i < 48; i++) {
                x2 = horizonCenter.x + cosTable[i] * smallHorizonRadius;
                y2 = horizonCenter.y - sinTable[i] * smallHorizonRadius;

                speiche = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
                speiche.strokeColor = globals.horizonColor;
                speiche.strokeWidth = globals.horizonStrokeWidth*0.5;
            }

            // Minuta
            for (i = 0; i < 192; i++) {

                if ((i+1) % 4 == 0) {
                    continue;
                }

                x2 = horizonCenter.x + spikeCosTable[i] * (smallHorizonRadius + 4);
                y2 = horizonCenter.y - spikeSinTable[i] * (smallHorizonRadius + 4);

                lowerSpike = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2));
                lowerSpike.strokeColor = globals.horizonColor;
                lowerSpike.strokeWidth = globals.horizonStrokeWidth*0.5;
            }

            // Radius
            radiusStep = smallHorizonRadius / 50 / 4;
            for (i = 0; i < 50*4; i++) {

                middleHorizon = new paper.Path.Circle(horizonCenter, radiusStep * i);
                middleHorizon.strokeColor = globals.horizonColor;
                middleHorizon.strokeWidth = globals.horizonStrokeWidth*0.5;

            }

        }
    }
}



function showTooltip(item) {

    console.log("Show tooltip for:");
    console.log(item);

    coord = item.data;
    variantIndex = item.data2;
    variant = coord.variants[variantIndex];

    var group = new paper.Group();
    group.name = 'tooltip';
    group.opacity = 0;

    // Create tooltip from rectangle
    
    x = item.position.x;
    y = item.position.y;

    view_point = paper.project.view.projectToView(new paper.Point(x,y));

    tooltipSpan = document.getElementById('tooltip-span');

    console.log("Tooltip:");
    console.log(tooltipSpan);

    tooltipSpan.style.display = 'block';
    tooltipSpan.style.position = 'fixed';
    tooltipSpan.style.overflow = 'hidden'; 

    tooltipSpan.style.top = view_point.y + 'px';
    tooltipSpan.style.left = view_point.x + 'px';

    console.log("Set table to "+toRoman(coord.origTable)+' '+coord.origCoordNumber);

    // Set values
    table = document.getElementById('tt-table');
    table.setAttribute('data-value', toRoman(coord.origTable)+' '+coord.origCoordNumber);

    ms = document.getElementById('tt-ms');
    //ms.setAttribute('data-value', variant.ms=='Boriaud-Furlan'?'BF':variant.ms+"1".sup());
    ms.innerHTML = (variant.ms=='Boriaud-Furlan'?'BF':superscriptMs(variant.ms));

    hg = document.getElementById('tt-hg');
    hg.setAttribute('data-value', numberWithFraction(variant.horizonGradus.toString()));

    hm = document.getElementById('tt-hm');
    hm.setAttribute('data-value', numberWithFraction(variant.horizonMinuta.toString()));

    rg = document.getElementById('tt-rg');
    rg.setAttribute('data-value', numberWithFraction(variant.radiusGradus.toString()));

    rm = document.getElementById('tt-rm');
    rm.setAttribute('data-value', numberWithFraction(variant.radiusMinuta.toString()));

    tooltipSpan.style.opacity = 0.0;
    
    anime({
        targets: '.descriptio-tooltip',
        opacity: 1,
        duration: 150,
        easing: 'linear',
    });
    

    console.log("Point="+x+"|"+y);

}


/**
 * Draw little dots for Alberti's coordinates
 * 
 * @param  {AlbertisCoordinate[]} coords List of coords to draw.
 */
function drawCoordMarks(coords, color) {

    console.log("Draw coord marks, length=" + coords.length);

    //for (i = 0; i < globals.albertisCoordinates.length; i++) {
    for (i = 0; i < coords.length; i++) {

        //currentAC = globals.albertisCoordinates[i];
        currentAC = coords[i];
        //console.log("Draw coord number=" + currentAC.coordNumber);

        mvi = currentAC.mainVariantIndex;

        desc = null;
        x = currentAC.variants[mvi].cartesianPoint.x;
        y = currentAC.variants[mvi].cartesianPoint.y;

        //console.log("Coord type: " + currentAC.coordType);
        //console.log(currentAC);



        // Select correct coord desc
        switch (currentAC.coordType) {

            case "Angulus":
                desc = globals.angulusDesc;
                break;

            case "Avx":
                desc = globals.avxDesc;
                break;

            case "Porta":
                desc = globals.portaDesc;
                break;

            case "Flumen":
                desc = globals.flumenDesc;
                break;

            case "LatusFluminis":
                desc = globals.latusFluminisDesc;
                break;

            case "InsulaeCaput":
                desc = globals.angulusDesc;
                break;

            case "InsulaeAvx":
                desc = globals.insulaAvxDesc;
                break;

            case "AvxLaterisFluminis":
                desc = globals.avxLaterisFluminisDesc;
                break;

            case "Aedificium":
                desc = globals.aedificiumDesc;
                break;

            default:
                console.log("default case: " + currentAC.coordType);
                break;
        }


        // Create Paper.js shape
        newMark = null;
        globals.coordMarkerLayer.activate();

        switch (desc.shape) {

            case "circle":

                p = new paper.Point(x, y);

                //console.log("Create circle..."+p);

                // TODO Test for Avx
                newMark = null;

                if (currentAC.coordType.includes("Avx")) {

                    newMark = new paper.Path.RegularPolygon(p, 6, desc.size);
                    newMark.rotation = -30;
                }
                else {
                    newMark = new paper.Shape.Circle(p, desc.size);
                }

                newMark.strokeWidth = desc.strokeWidth;

                if (color != null) {
                    newMark.strokeColor = color;
                    newMark.fillColor = new paper.Color(1, 1, 1);
                } else {
                    newMark.strokeColor = desc.strokeColor;
                    newMark.fillColor = desc.fillColor;
                }

                

                if (currentAC.variants.length > 1) {

                    //newMark.fillColor = new paper.Color(1, 0.55, 0);
                    //newMark.fillColor = new paper.Color(0.97,0.82,0.84);
                    newMark.fillColor = new paper.Color(0.87,0.28,0.37);

                    globals.variantSignalLayer.activate();
                    
                    variantSignal = new paper.Shape.Circle(p, 5);

                    
                    //variantSignal.strokeColor = new paper.Color(1, 0.55, 0);
                    variantSignal.fillColor = new paper.Color(0.87,0.28,0.37);
                    //variantSignal.fillColor = new paper.Color(0.97,0.82,0.84);
                    variantSignal.opacity = 0.1;
                    variantSignal.scaling = 1.0;                   

                    
                    tl = anime.timeline({
                        targets: variantSignal,
                        loop: true,
                    }).add({
                        opacity: 0.25,
                        scaling: 1.3,
                        easing: 'easeInSine',
                        duration: 1000
                    }, 0).add({
                        opacity: 0.0,
                        scaling: 1.7,
                        easing: 'linear',
                        duration: 750
                    }, 1000);
                                       

                    globals.coordMarkerLayer.activate();
                }

                break;


            case "square":
                //console.log("Create square...");


                halfSize = desc.size * 0.5;
                p = new paper.Point(x - halfSize, y - halfSize);
                s = new paper.Size(desc.size, desc.size);
                newMark = new paper.Shape.Rectangle(p, s);

                newMark.strokeColor = desc.strokeColor;
                newMark.fillColor = desc.fillColor;

                if (currentAC.variants.length > 1) {
                    //newMark.fillColor = new paper.Color(1, 0.55, 0);
                    newMark.fillColor = new paper.Color(0.87,0.28,0.37);

                    globals.variantSignalLayer.activate();

                    variantSignal = new paper.Shape.Rectangle(p, s);
                    
                    //variantSignal.strokeColor = new paper.Color(1, 0.55, 0);
                    variantSignal.fillColor = new paper.Color(0.87,0.28,0.37);
                    //variantSignal.fillColor = new paper.Color(0.97,0.82,0.84);
                    variantSignal.applyMatrix = false; 

                    variantSignal.opacity = 0;
                    variantSignal.scaling = 1;                 

                    
                    tl = anime.timeline({
                        targets: variantSignal,
                        loop: true,
                    }).add({
                        opacity: 0.4,
                        scaling: 2.5,
                        easing: 'easeInSine',
                        duration: 1000
                    }, 0).add({
                        opacity: 0.0,
                        scaling: 4.5,
                        easing: 'linear',
                        duration: 950
                    }, 1000);
                    
                    globals.coordMarkerLayer.activate();

                }

                break;
            
            case "porta":
                            
                //newMark = svg_porta_icon.place();

                portaWidth = 6;
                baseHeight = 5.5;
                arcHeight = 3;

                base = new paper.Path();
                base.add(new paper.Point(x - (portaWidth/2), y-baseHeight));
                base.add(new paper.Point(x - (portaWidth/2), y));
                base.add(new paper.Point(x + (portaWidth/2), y));
                base.add(new paper.Point(x + (portaWidth/2), y-baseHeight));

                arc = new paper.Path.Arc(new paper.Point(x + (portaWidth/2), y-baseHeight+0.4),
                                         new paper.Point(x, y-baseHeight-arcHeight),
                                         new paper.Point(x - (portaWidth/2), y-baseHeight+0.4));

                
                newMark = new paper.CompoundPath(arc, base);
                newMark.position = new paper.Point(x, y);
                //newMark.scale(0.3,0.3);

                //console.log("Symbol stroke color="+newMark.strokeColor);

                newMark.strokeColor = new paper.Color(0,0,0);
                newMark.fillColor = new paper.Color(1,1,1);
                newMark.strokeWidth = 2;


                if (currentAC.variants.length > 1) {

                    //newMark.fillColor = new paper.Color(1, 0.55, 0);
                    //newMark.fillColor = new paper.Color(0.97,0.82,0.84);
                    newMark.fillColor = new paper.Color(0.87,0.28,0.37);

                    globals.variantSignalLayer.activate();
                    
                    //variantSignal = new paper.Shape.Circle(p, 5);
                    
                    varbase = new paper.Path();
                    varbase.add(new paper.Point(x - (portaWidth/2), y-baseHeight));
                    varbase.add(new paper.Point(x - (portaWidth/2), y));
                    varbase.add(new paper.Point(x + (portaWidth/2), y));
                    varbase.add(new paper.Point(x + (portaWidth/2), y-baseHeight));

                    vararc = new paper.Path.Arc(new paper.Point(x + (portaWidth/2), y-baseHeight+0.4),
                                            new paper.Point(x, y-baseHeight-arcHeight),
                                            new paper.Point(x - (portaWidth/2), y-baseHeight+0.4));

                    
                    variantSignal = new paper.CompoundPath(vararc, varbase);
                    variantSignal.position = new paper.Point(x, y);

                    
                    //variantSignal.strokeColor = new paper.Color(1, 0.55, 0);
                    variantSignal.fillColor = new paper.Color(0.87,0.28,0.37);
                    //variantSignal.fillColor = new paper.Color(0.97,0.82,0.84);
                    variantSignal.opacity = 0.1;
                    variantSignal.scaling = 1.3;
                    variantSignal.applyMatrix = false;                   

                    
                    tl = anime.timeline({
                        targets: variantSignal,
                        loop: true,
                    }).add({
                        opacity: 0.25,
                        scaling: 1.3,
                        easing: 'easeInSine',
                        duration: 1000
                    }, 0).add({
                        opacity: 0.0,
                        scaling: 1.8,
                        easing: 'linear',
                        duration: 800
                    }, 1000);

                    globals.coordMarkerLayer.activate();
                }



                break;
        }

        // Save coord to paper.js object
        newMark.data = currentAC;
        newMark.data2 = currentAC.mainVariantIndex;

        name = "object_"+newMark.id.toString();
        newMark.name = name;
        currentAC.variants[currentAC.mainVariantIndex].coordMarkerName = name;

        newMark.onMouseEnter = function(event) {
            console.log("This is:")
            console.log(this);

            if (globals.app_state != "choose_start_coord") {
                showTooltip(this);
            }
            
            //showTooltip(currentAC.variants[currentAC.mainVariantIndex]);
            //showTooltip(newMark);

            
        }

        newMark.onMouseLeave = function(event) {
            console.log("Leave coordinate!");

            tooltipSpan = document.getElementById('tooltip-span');
            tooltipSpan.style.display = 'none';

            //this.parent.children['tooltip'].remove();

        }

        //console.log("Current coord has "+currentAC.variants.length+" variants.");

        // Clone marker for every variant, change color and hide

        srcPoint = new paper.Point(x,y);
        
        for (j=0;j<currentAC.variants.length;j++) {
            
            if (j != currentAC.mainVariantIndex) {

                currVar = currentAC.variants[j];
                console.log("Variant: " +currVar);
                //console.log(currVar);

                destPoint = new paper.Point(srcPoint.x, srcPoint.y);

                // TODO Insert event handler here!
                variantMarker = newMark.clone();
                //variantMarker = new paper.Path.Circle(new paper.Point(0,0), new paper.Size(2.5,2.5));
                variantMarker.data = currentAC;
                variantMarker.data2 = j;
                
                variantMarker.onMouseEnter = function(event) {

                    if (globals.app_state != "choose_start_coord") {
                        showTooltip(this);
                    }
                }
                
                variantMarker.onMouseLeave = function(event) {
                    console.log("Leave coordinate!");
                    //this.parent.children['tooltip'].remove();
                    tooltipSpan = document.getElementById('tooltip-span');
                    tooltipSpan.style.display = 'none';
                }
                
                variantMarker.position = new paper.Point(srcPoint);
                variantMarker.strokeColor = new paper.Color(0.18,0.18,0.18);
                //variantMarker.strokeColor = new paper.Color(1,0,0);
                //variantMarker.fillColor = new paper.Color(0.8,0.8,0.8);
                variantMarker.fillColor = new paper.Color(1,1,1);
                variantMarker.dashArray = [2,1];
                variantMarker.strokeWidth = 0.75;
                
                //variantMarker.fillColor = new paper.Color(1,1,1);
                variantMarker.visible = false;


                name = "object_" + variantMarker.id.toString();
                currVar.coordMarkerName = name;
                variantMarker.name = name;


                // Path that connects normal coord with this variant
                globals.pathLayer.activate();

                varPath = new paper.Path();
                varPath.strokeColor = new paper.Color(0.18,0.18,0.18);
                varPath.add(srcPoint);
                varPath.add(destPoint);
                varPath.visible = false;
                varPath.dashArray = [6,3];
                varPath.strokeWidth = 0.75;

                // Reorient if we have an aedificium
                console.log("coord type="+currentAC.coordType);

                pathOrientation = 3;
                if (currentAC.coordType == "Aedificium") {
                    console.log("reorient path!");
                    pathOrientation *= -1;
                }

                if (currentAC.coordType.startsWith("Avx")) {
                    console.log("reorient path!");
                    pathOrientation *= -1;
                }

                pathName = "path_" + varPath.id.toString();
                varPath.name = pathName;
                currVar.variantPathName = pathName;

               varPath.variantPathAnimation = anime.timeline({
                    duration: 2500,
                    easing: 'linear',
                    autoplay: false,
                    loop: true
               });
               varPath.variantPathAnimation.add({
                    targets: varPath,
                    dashOffset: -9
               }, 0).add({
                   targets: variantMarker,
                   dashOffset: pathOrientation
               }, 0);
               

            }
            
        }
    }

}


function drawCoordinates() {

    console.log("Draw coordinates.");

    switch (globals.options.drawMode) {

        case "per_table":
            console.log("Draw mode: per_table.");

            drawCoordMarks(drawModeTables.perTable[0].coords);
            drawCoordMarks(drawModeTables.perTable[1].coords);
            drawCoordMarks(drawModeTables.perTable[2].coords);
            drawCoordMarks(drawModeTables.perTable[3].coords);
            drawCoordMarks(drawModeTables.perTable[4].coords);
            drawCoordMarks(drawModeTables.perTable[5].coords);
            drawCoordMarks(drawModeTables.perTable[6].coords);
            drawCoordMarks(drawModeTables.perTable[7].coords);
            drawCoordMarks(drawModeTables.perTable[8].coords);
            drawCoordMarks(drawModeTables.perTable[9].coords);
            drawCoordMarks(drawModeTables.perTable[10].coords);
            drawCoordMarks(drawModeTables.perTable[11].coords);
            drawCoordMarks(drawModeTables.perTable[12].coords);
            drawCoordMarks(drawModeTables.perTable[13].coords);
            drawCoordMarks(drawModeTables.perTable[14].coords);

            break;

        case "per_unit":

            console.log("Draw mode: per_unit.");

            drawCoordMarks(drawModeTables.perTable[0].coords);
            drawCoordMarks(drawModeTables.perTable[1].coords);
            drawCoordMarks(drawModeTables.perTable[2].coords);
            drawCoordMarks(drawModeTables.perTable[3].coords);
            drawCoordMarks(drawModeTables.perTable[4].coords);
            drawCoordMarks(drawModeTables.perTable[5].coords);
            drawCoordMarks(drawModeTables.perTable[6].coords);

            break;


        case "all":

            console.log("Draw mode: all.");

            drawCoordMarks(drawModeTables.perTable[0].coords);

            break;

    }

    // Create aedificia
    drawCoordMarks(aedificiaTable.coords);

}

/**
 * For every draw mode table, create a path through all points.
 * Points are supposed to be sorted.
 */
function createPath() {

}

function showVariant(coord, variant_index) {

}

function showVariants() {

    //globals.markerLayer.activate();

    for (i=0; i<drawModeTables.perTable.length;i++) {
        currTable = drawModeTables.perTable[i];

        for (j=0;j<currTable.coords.length;j++) {
            currAC = currTable.coords[j];


            if (currAC.variants.length > 1) {

                for (k=0;k<currAC.variants.length;k++) {

                    if (k != currAC.mainVariantIndex) {

                        name = currAC.variants[k].coordMarkerName;
                                    marker = globals.coordMarkerLayer.children[name];

                                    console.log("Marker name="+name);

                                    marker.visible = true;
                                    marker.opacity = 1.0;

                                   new_x = currAC.variants[k].cartesianPoint.x;
                                   new_y = currAC.variants[k].cartesianPoint.y;

                                   srcPoint = new paper.Point(currAC.variants[currAC.mainVariantIndex].cartesianPoint.x, currAC.variants[currAC.mainVariantIndex].cartesianPoint.y);

                                   marker.position = srcPoint;

                                   // Get variant path
                                   pathName = currAC.variants[k].variantPathName;
                                   console.log("path name="+pathName);

                                   //variantPath = paper.project.activeLayer.children[pathName];
                                   variantPath = globals.pathLayer.children[pathName];
                                   variantPath.visible = true;
                                   variantPath.opacity = 1.0;
                                   console.log("variant path:");
                                   console.log(variantPath);
                                    

                                   anime({
                                       targets: [marker.position, variantPath.lastSegment.point],
                                       x: new_x,
                                       y: new_y,
                                       round: 1
                                   });

                                   variantPath.variantPathAnimation.play();

                    }
                }
            }
        }
    }

    // Handle Aedifica separately
    for (j=0;j<aedificiaTable.coords.length;j++) {
        currAC = aedificiaTable.coords[j];

        if (currAC.variants.length > 1) {

            for (k=0;k<currAC.variants.length;k++) {

                if (k != currAC.mainVariantIndex) {

                    // Get variant coord marker by name
                    name = currAC.variants[k].coordMarkerName;
                    marker = globals.coordMarkerLayer.children[name];

                    console.log("Variant marker name="+name);

                    marker.visible = true;
                    marker.opacity = 1.0;

                    new_x = currAC.variants[k].cartesianPoint.x;
                    new_y = currAC.variants[k].cartesianPoint.y;

                    srcPoint = new paper.Point(currAC.variants[currAC.mainVariantIndex].cartesianPoint.x, currAC.variants[currAC.mainVariantIndex].cartesianPoint.y);

                    marker.position = srcPoint;

                    // Get variant path
                    pathName = currAC.variants[k].variantPathName;
                    console.log("path name="+pathName);

                    //variantPath = paper.project.activeLayer.children[pathName];
                    variantPath = globals.pathLayer.children[pathName];
                    variantPath.visible = true;
                    variantPath.opacity = 1.0;
                    console.log("variant path:");
                    console.log(variantPath);
                    

                    anime({
                        targets: [marker.position, variantPath.lastSegment.point],
                        x: new_x,
                        y: new_y,
                        round: 1
                    });

                    variantPath.variantPathAnimation.play();


                }
            }
        }
    }

    globals.app_state = "choose_variant";

}

function hideVariants() {

    console.log("Hiding variants...");

    for (i=0; i<drawModeTables.perTable.length;i++) {
        currTable = drawModeTables.perTable[i];

        for (j=0;j<currTable.coords.length;j++) {
            currAC = currTable.coords[j];


            if (currAC.variants.length > 1) {

                for (k=0;k<currAC.variants.length;k++) {

                    if (k != currAC.mainVariantIndex) {

                        name = currAC.variants[k].coordMarkerName;
                        //marker = paper.project.activeLayer.children[name];
                        marker = globals.coordMarkerLayer.children[name];

                       new_x = currAC.variants[currAC.mainVariantIndex].cartesianPoint.x;
                        new_y = currAC.variants[currAC.mainVariantIndex].cartesianPoint.y;

                        // Get variant path
                        pathName = currAC.variants[k].variantPathName;
                        console.log("path name="+pathName);

                        //variantPath = paper.project.activeLayer.children[pathName];
                        variantPath = globals.pathLayer.children[pathName];
                        //variantPath.visible = true;
                        console.log("variant path:");
                        console.log(variantPath);

                       tl = anime.timeline({
                                easing: 'easeOutCubic',
                                duration: 1000
                            });
                        tl.add({
                            targets: [marker.position, variantPath.lastSegment.point],
                            x: new_x,
                            y: new_y,
                        }, 0).add({
                            targets: [marker, variantPath],
                            opacity: 0.0,
                        }, 200);

                        variantPath.variantPathAnimation.pause();
                    }
                }
            }
        }
    }

    // Handle aedificia separately

    for (j=0;j<aedificiaTable.coords.length;j++) {
        currAC = aedificiaTable.coords[j];

        if (currAC.variants.length > 1) {

            for (k=0;k<currAC.variants.length;k++) {

                if (k != currAC.mainVariantIndex) {

                    name = currAC.variants[k].coordMarkerName;
                    //marker = paper.project.activeLayer.children[name];
                    marker = globals.coordMarkerLayer.children[name];

                    new_x = currAC.variants[currAC.mainVariantIndex].cartesianPoint.x;
                    new_y = currAC.variants[currAC.mainVariantIndex].cartesianPoint.y;

                    // Get variant path
                    pathName = currAC.variants[k].variantPathName;
                    console.log("path name="+pathName);

                    //variantPath = paper.project.activeLayer.children[pathName];
                    variantPath = globals.pathLayer.children[pathName];
                    //variantPath.visible = true;
                    console.log("variant path:");
                    console.log(variantPath);

                    tl = anime.timeline({
                            easing: 'easeOutCubic',
                            duration: 1000
                        });
                    tl.add({
                        targets: [marker.position, variantPath.lastSegment.point],
                        x: new_x,
                        y: new_y,
                    }, 0).add({
                        targets: [marker, variantPath],
                        opacity: 0.0,
                    }, 300);

                    variantPath.variantPathAnimation.pause();
                }
            }
        }

    }

    globals.app_state = "none";

}

function chooseVariant(newMs) {

    console.log("Old main ms: "+globals.mainMs+ ", old variant mss: "+globals.variantMss);
    console.log("New ms = "+newMs);

    // Remove all variant signals
    globals.variantSignalLayer.removeChildren();


    // Animate main coords to variant coords
    for (i=0; i<drawModeTables.perTable.length;i++) {
        currTable = drawModeTables.perTable[i];
        //console.log("Current table:");
        //console.log(currTable);

        for (j=0;j<currTable.coords.length;j++) {
            currAC = currTable.coords[j];

            //console.log("Current AC:");
            //console.log(currAC);

            markerName = currAC.variants[currAC.mainVariantIndex].coordMarkerName;
            marker = globals.coordMarkerLayer.children[markerName];
            //marker = paper.project.activeLayer.children[markerName];
            

            if (currAC.variants.length > 1) {

                for (k=0;k<currAC.variants.length;k++) {

                    if (currAC.variants[k].ms == newMs) {

                        newVar = currAC.variants[k];

                        pathName = newVar.variantPathName;
                        console.log("path name="+pathName);
                        //variantPath = paper.project.activeLayer.children[pathName];
                        variantPath = globals.pathLayer.children[pathName];

                        numAnimationsRunning++;

                        
                        tl = anime.timeline({
                            easing: 'easeInCubic',
                            duration: 750
                        });

                        tl.add({
                            targets: [marker.position, variantPath.firstSegment.point],
                            //targets: marker.position,
                            x: newVar.cartesianPoint.x,
                            y: newVar.cartesianPoint.y,
                            complete: function(anim) {
                                numAnimationsRunning--;

                                if (numAnimationsRunning == 0) {
                                    console.log("ALL ANIMATIONS FINISHED!");

                                    $('#variants-btn').blur();
                                    
                                    drawAlbertisRome();
                                    flashEnabled = true;
                                }
                              }
                        }, 0);

                        
                    }
                }
            }
            
        }
    }


    console.log("New main ms: "+globals.mainMs+ ", new variant mss: "+globals.variantMss);

    globals.variants_expanded = false;

}

function createLayers() {

    globals.mapLayer = new paper.Layer();

    globals.horizonLayer = new paper.Layer();
    globals.pathLayer = new paper.Layer();
    globals.circleOverlayLayer = new paper.Layer();
    globals.variantSignalLayer = new paper.Layer();
    globals.coordMarkerLayer = new paper.Layer();
    globals.labelLayer = new paper.Layer();
    globals.markerLayer = new paper.Layer();
    globals.radiusLayer = new paper.Layer();
    globals.measureLayer = new paper.Layer();
    globals.msOverlayLayer = new paper.Layer();
}

function clearLayers() {

    globals.mapLayer.removeChildren();
    globals.horizonLayer.removeChildren();
    globals.pathLayer.removeChildren();
    globals.circleOverlayLayer.removeChildren();
    globals.variantSignalLayer.removeChildren();
    globals.coordMarkerLayer.removeChildren();
    globals.labelLayer.removeChildren();
    globals.markerLayer.removeChildren();
    globals.radiusLayer.removeChildren();
    globals.measureLayer.removeChildren(); 

    paper.view.draw();

}

function resetStartMarkerPositions() {

    console.log("Reset start markers.");

    for (i=0; i<drawModeTables.perTable.length;i++) {

        console.log("  Table "+i);

        currTable = drawModeTables.perTable[i];

        startIndex = currTable.startIndex;
        startCoord = currTable.coords[startIndex];

        cartCoord = startCoord.variants[startCoord.mainVariantIndex].cartesianPoint;
        cartPoint = new paper.Point(cartCoord.x+4, cartCoord.y - 7);

        currTable.startMarker.position = cartPoint;

    }  
}

function toggleMap() {

    if (show) {

    } else {

    }
}

function drawAlbertisRome() {

    console.log("Drawing Alberti’s Rome.")

    // Clear canvas
    clearLayers();

    // Create a list of coordinates and variants depending
    // on the ms(s) to draw
    createCoordinateList();    

    // Calculate horizon and draw it
    drawHorizon();
    
    globals.mapLayer.activate();

    center = horizonCenter;

    globals.backgroundMap = new paper.Raster({
        source: 'img/ancient-rome.jpg',
        position: center
    });

    console.log("Map center="+center);

    // 447: Empirically established value
    globals.backgroundMap.scale(0.28 * (bigHorizonRadius / 447));
    globals.backgroundMap.opacity = 0;
    globals.backgroundMap.rotation = -7;
    globals.backgroundMap.visible = false;

    // Calculate cartesian coordinates based on horizon parameters
    calculateCartesianCoordinates();

    createDrawModeTables();

    drawCoordinates();

    createLabels();

    globals.coordMarkerLayer.activate();
    
}