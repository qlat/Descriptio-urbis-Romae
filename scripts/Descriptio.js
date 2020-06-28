// Global functions and variables for PaperScript to work with JavaScript
// Source: https://stackoverflow.com/questions/32053017/call-a-function-inside-paperscript-from-outside
var globals = {};

// Tables of coords to draw, depending on current draw mode.
// Modes:
//   per_table: one table for each of Alberti's tables
//   per_unit:  one table for each of Alberti's units
//   all:       one table for all
//
// Type:
/*
type drawModeTable {
    AlbertisCoordinate[] coords;
    boolean animate;
    int animIndex = 0;
    float animDelta = 0;
    int startIndex = 0;
    Path path;
    Item startMarker;
}
*/
// All entries: Arrays of coordinates
var drawModeTables = {
    perTable: null,
    perUnit: null,
    all: null
};

var aedificiaTable = [];

// Indicates whether a draw mode table has just been highlighted
// to avoid unnecessary unhighlighting.
var dmtIndex = -1;
var dmtHighlighted = false;

// Indicates if a new marker position has been choosen
// to avoid resetting position
var newStartMarkerPosChoosen = false;

var svg_location_pin = null;

var svg_porta_icon = null;

var svg_measure_pin = null;

var tabulaeJSON = null;


// Variables for zoom factor
var ZoomLevel = 0;
var ZoomMultiplicationFactor = 1.2;
var ZoomInFactor = 1 / ZoomMultiplicationFactor;
var ZoomOutFactor = ZoomMultiplicationFactor;
var MinZoomLevel = -10;

var jsonLoaded = false;
var fontLoaded = false;

var flashBtnAnim = null;
var flashEnabled = false;


function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'Tabulae.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function findBestMsIndex(ms, ms_dict) {

    console.log("Find best ms index for >"+ms+"<.");

    if (ms_dict.hasOwnProperty(ms)) {
        console.log("  Variant ms "+ms+" found. Return "+ms_dict[ms]);
        return ms_dict[ms];
    }

    // Not found => select another ms.
    switch (ms) {

        // A1 contains only tables VII to IX and XI to XVI.
        // Select A1pc or A if they exists, B/F otherwise.
        case "A1":
            // Check if we have A1pc
            if (ms_dict.hasOwnProperty("A1pc")) {
                console.log("  Variant ms "+ms+" not found. Return A1pc.");
                return ms_dict["A1pc"];
            }
            if (ms_dict.hasOwnProperty("A")) {
                console.log("  Variant ms "+ms+" not found. Return A.");
                return ms_dict["A"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;


        // A2 contains corrections to A and A1.
        // Select A1 or A if they exist, B/F otherwise.
        case "A2":
            if (ms_dict.hasOwnProperty("A1")) {
                console.log("  Variant ms "+ms+" not found. Return A1.");
                return ms_dict["A1"];
            }
            if (ms_dict.hasOwnProperty("A")) {
                console.log("  Variant ms "+ms+" not found. Return A.");
                return ms_dict["A"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;


        // Only in X 9 there is Bpc instead of B
        case "B":
            if (ms_dict.hasOwnProperty("Bpc")) {
                console.log("  Variant ms "+ms+" not found. Return Bpc.");
                return ms_dict["Bpc"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;
            
        // Three cases with Bac, but there is no B. => Return B/F.
        case "Bac":
            if (ms_dict.hasOwnProperty("B")) {
                console.log("  Variant ms " + ms + " not found. Return B.");
                return ms_dict["B"];
            } else {
                console.log("  Variant ms " + ms + " not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;

        // B1 contains corrections only to tables VII-IX and XI-XVI
        // => If B1 is required and does not exist, return B.
        case "B1":
            if (ms_dict.hasOwnProperty("B")) {
                console.log("  Variant ms "+ms+" not found. Return B.");
                return ms_dict["B"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
        break;
        
        // Many cases where there is Cac/pc, but no C.
        // => If C is required, return Cpc.
        // => If Cac/pc is required, return C.
        case "C":
            if (ms_dict.hasOwnProperty("Cpc")) {
                console.log("  Variant ms "+ms+" not found. Return Cpc.");
                return ms_dict["Cpc"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;
        case "Cac":
        case "Cpc":
            if (ms_dict.hasOwnProperty("C")) {
                console.log("  Variant ms "+ms+" not found. Return C.");
                return ms_dict["C"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;

        // Nac: 8x, Npc: 3x, sometimes no N
        // => If Nac is required, return N.
        // => If Npc is required, return N.
        // => If N is required, return Npc.
        case "Nac":
        case "Npc":
            if (ms_dict.hasOwnProperty("N")) {
                console.log("  Variant ms "+ms+" not found. Return N.");
                return ms_dict["N"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;

        case "N":
            if (ms_dict.hasOwnProperty("Npc")) {
                console.log("  Variant ms "+ms+" not found. Return Npc.");
                return ms_dict["Npc"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
        break;

        // O: Same as with N
        case "Oac":
        case "Opc":
            if (ms_dict.hasOwnProperty("O")) {
                console.log("  Variant ms "+ms+" not found. Return O.");
                return ms_dict["O"];
            }
            else {
                console.log("  Variant ms "+ms+" not found. Return B/F.");
                return ms_dict["Boriaud-Furlan"];
            }
            break;

            case "O":
                if (ms_dict.hasOwnProperty("Opc")) {
                    console.log("  Variant ms "+ms+" not found. Return Opc.");
                    return ms_dict["Opc"];
                }
                else {
                    console.log("  Variant ms "+ms+" not found. Return B/F.");
                    return ms_dict["Boriaud-Furlan"];
                }
            break;
    }

    console.log("We are still here => Return Boriaud-Furlan.");


    // Still not found. Return Boriaud-Furlan.
    return ms_dict["Boriaud-Furlan"];
}


// Create list of variants according to the mss to draw
function createCoordinateList() {

    console.log("Create coordinate list from ms '" + globals.mainMs + "'.");

    // Index for the creation of global coord list
    acIndex = 0;
    // For debugging purposes
    varCounter = 0;

    for (i = 0; i < tabulaeJSON.length; i++) {
        currentTable = tabulaeJSON[i];

        for (j = 0; j < currentTable.Coords.length; j++) {

            console.log("(" + (acIndex + 1) + ") ---");
            currentAC = currentTable.Coords[j];
            console.log(currentAC);

            // New AlbertisCoordinate that is to be added to the global list
            newAC = {};
            // Set some values that will be needed later
            newAC.coordType = currentAC.CoordType;
            newAC.coordNumber = currentAC.CoordNumber;
            //newAC.coordMarkerName = null;
            newAC.expanded = false;
            newAC.expansionValue = 0.0;
            newAC.variants = [];
            newAC.circles = [];
            newAC.table = -1; // Virtual table depending on draw mode
            newAC.index = -1; // Index in virtual table
            newAC.origTable = currentTable.TableNumber;
            newAC.origCoordNumber = currentAC.CoordNumber;

            if (currentAC.hasOwnProperty("Nomen")) {
                newAC.nomen = currentAC.Nomen;
            }

            // Select main variant
            newAC.mainVariantIndex = 0;
            newMainVar = {};

            // If there are no variants at all, take the coords we have
            if (currentAC.Variants.length == 1) {

                newMainVar.ms = globals.mainMs;
                newMainVar.mainVariant = true;
                newMainVar.coordMarkerName = null;
                newMainVar.variantPathName = null;
                newMainVar.animVector = null;
                newMainVar.horizonGradus = currentAC.Variants[0].HorizonGradus;
                newMainVar.horizonMinuta = currentAC.Variants[0].HorizonMinuta;
                newMainVar.radiusGradus = currentAC.Variants[0].RadiusGradus;
                newMainVar.radiusMinuta = currentAC.Variants[0].RadiusMinuta;

                // Save at default main variant index (0)
                newAC.variants[0] = newMainVar;

            } else {

                // There are variants for this coord, so look up the requested
                // main and variants mss.

                varIndex = 0;
                varCounter++;

                // Fetch the requested variants
                for (k = -1; k < globals.variantMss.length; k++) {

                    currentVarMs = "";

                    // Workaround: Also inspect main ms
                    if (k == -1) {
                        currentVarMs = globals.mainMs;
                    } else {
                        currentVarMs = globals.variantMss[k];
                    }

                    // New variant structure for new variant ms
                    newVar = {};

                    varFound = false;
                    bfIndex = -1;
                    tmpVarIndex = -1;

                    // Create object of ms -> var index
                    var_obj = {};
                    currentAC.Variants.forEach(function(variant, index) {

                        varArray = variant.Mss.split(',');
                        varArray.forEach(function(ms_string) {
                            var_obj[ms_string] = index;
                        });

                    });
                    console.log("Ms dictionary:");
                    console.log(var_obj);

                    bfIndex = var_obj["Boriaud-Furlan"];

                    tmpVarIndex = findBestMsIndex(currentVarMs, var_obj);

                    newVar.ms = currentVarMs;
                    newVar.coordMarkerName = null;
                    newVar.variantPathName = null;
                    newVar.mainVariant = false;
                    newVar.animVector = null;
                    newVar.horizonGradus = currentAC.Variants[tmpVarIndex].HorizonGradus;
                    newVar.horizonMinuta = currentAC.Variants[tmpVarIndex].HorizonMinuta;
                    newVar.radiusGradus = currentAC.Variants[tmpVarIndex].RadiusGradus;
                    newVar.radiusMinuta = currentAC.Variants[tmpVarIndex].RadiusMinuta;

                    // Only save new variant if it is a real variant, i.e. not equal to another variant/coord
                    realVar = true;

                    for (m = 0; m < newAC.variants.length; m++) {
                        if (albertisCoordinateEquals(newAC.variants[m], newVar)) {
                            realVar = false;
                            break;
                        }
                    }

                    if (realVar) {
                        console.log("  Real variant => save.");

                        // Create null animation vector for expand/collapse
                        newVar.animVector = null;

                        newAC.variants[varIndex] = newVar;
                        // Create empty variantPaths array
                        newAC.variantPaths = [];

                        // Workaround for mainMs
                        if (k == -1) {
                            console.log("    ...even main variant.");
                            newVar.mainVariantIndex = varIndex;
                        }
                        varIndex++;
                    } else {
                        console.log("  *NO* real variant!");
                    }

                }
            }

            // Read recte coordinate
            if (currentAC.Recte != null) {

                newAC.recte = {};
                newAC.recte.horizonGradus = currentAC.Recte.HorizonGradus;
                newAC.recte.horizonMinuta = currentAC.Recte.HorizonMinuta;
                newAC.recte.radiusGradus = currentAC.Recte.RadiusGradus;
                newAC.recte.radiusMinuta = currentAC.Recte.RadiusMinuta;

                console.log("Recte: (" + newAC.recte.horizonGradus + "|" 
                                       + newAC.recte.horizonMinuta + "|"
                                       + newAC.recte.radiusGradus  + "|"
                                       + newAC.recte.radiusMinuta  + ")");

            }
            

            globals.albertisCoordinates[acIndex++] = newAC;

        }
    }

    console.log("Total number of coordinates: " + acIndex);
    console.log("Total number of variants: " + varCounter + ", i.e. " + (varCounter * 100 / acIndex) + "%.");
}

function createLabels() {

    globals.labelLayer.activate();

    // Create labels
    anchor_array = [];
    label_array = [];
    text_array = [];
    link_array = [];

    labelTable = [];
    labelTable = labelTable.concat(aedificiaTable.coords);
    labelTable = labelTable.concat(getTableCoordinates(6)); // PORTAE IN LATIO
    labelTable = labelTable.concat(getTableCoordinates(7)); // PORTAE IN MVRIS TRANS TYBERIM
    labelTable = labelTable.concat(getTableCoordinates(8)); // PORTAE IN MVRIS LEONINAE

    console.log(labelTable);
    
    // Create labels for aedificia
    for (i=0;i<labelTable.length;i++) {

        coord = labelTable[i];
        

        idx = coord.mainVariantIndex;
        xval = coord.variants[idx].cartesianPoint.x;
        yval = coord.variants[idx].cartesianPoint.y;
        

        // Create PointText
        text = new paper.PointText(new paper.Point(xval, yval));
        text.content = coord.nomen;
        text.fillColor = new paper.Color(0.45,0.45,0.45);
        text.fontSize = 7;
        text.fontFamily = "Segoe UI";
        text.justification = 'left';
        text_array.push(text);

        console.log("Aedificium >"+coord.nomen+"< : ("+text.strokeBounds.width+"|"+text.strokeBounds.height+")");

        // Create link to coord
        link = new paper.Path();
        link.add(new paper.Point(xval, yval));
        link.add(new paper.Point(xval, yval));
        link.strokeColor = new paper.Color(0.45,0.45,0.45);
        link.strokeWidth = 0.5;
        link_array.push(link);

        label_offset_y = 7;
        radius = 5;
        anchor_array.push({x: xval, y: yval, r: radius});
        label_array.push({x: xval, y: yval-label_offset_y, name: coord.nomen, width: text.strokeBounds.width, height: text.strokeBounds.height});
        //label_array.push({x: xval, y: yval -label_offset_y , name: coord.nomen, width: 0.0, height: 0.0});
    }

    screen_width = paper.view.viewSize.width;
    screen_height = paper.view.viewSize.height;

    console.log("Placing labels...");
    
   
    
    // Setup labels
     var sim_ann = d3.labeler()
        .label(label_array)
        .anchor(anchor_array)
        .width(screen_width)
        .height(screen_height)
        .start(1000);
        
    

    
    for (i=0;i<label_array.length;i++) {

        label = label_array[i];

        text = text_array[i];
        link = link_array[i];

       
        text.justification = 'left';
        text.position = new paper.Point(label.x+text.strokeBounds.width*0.5, label.y+text.strokeBounds.height*0.5);

        console.log("New x position="+text.position.x);

        link.lastSegment.point = new paper.Point(label.x, label.y+text.strokeBounds.height*0.5);
    }

}

function placeMeasurePin(coord, tl) {

    pin_point = getPointFromCoord(coord);
    pin_point = new paper.Point(pin_point.x, pin_point.y - 15.928174*0.5 + 1); // Height of pin

    pin = svg_measure_pin.place();
    pin.position = new paper.Point(pin_point.x, pin_point.y - 8);
    pin.opacity = 0;

    pin.shadowColor = new paper.Color(0,0,0);
    pin.shadowBlur = 12;
    pin.shadowOffset = new paper.Point(10,10);

    if (tl != null) {
        return tl.add({
            targets: pin.position,
            y: pin_point.y,
            duration: 250,
            easing: 'linear'
        }, 0).add({
            targets: pin,
            opacity: 1.0,
            duration: 250,
            easing: 'linear'
        }, 0);
    }
    else {

        anime.timeline({
            duration: 250,
            easing: 'linear'
        }).add({
            targets: pin.position,
            y: pin_point.y,
        }, 0).add({
            targets: pin,
            opacity: 1.0
        }, 0);
    }
}


function showStartMarkers(show) {

    console.log("Show start markers: "+show);

    for (i = 0; i < drawModeTables.perTable.length; i++) {

        startMarker = drawModeTables.perTable[i].startMarker;

        if (show) {

            startMarker.visible = true;
            startMarker.opacity = 0.0;

            anime({
                targets: startMarker,
                opacity: 1.0,
                duration: 250,
                easing: 'linear'
            });
        } else {
            anime({
                targets: startMarker,
                opacity: 0.0,
                duration: 250,
                easing: 'linear',
                complete: function (anim) {
                    startMarker.visible = false;
                }
            });
        }
    }
}

function initWindowAfterLoading() {
    if (jsonLoaded && fontLoaded) {
        console.log("Everything loaded. Init window.");

        createLayers();

        drawAlbertisRome();

        // Hide loading screen
        $.LoadingOverlay("hide");
    } else {
        console.log("Loading not finished: jsonLoaded=" + jsonLoaded + ", fontLoaded=" + fontLoaded);
    }
}

$(document).ready(function () {

    // Show loading overlay
    $.LoadingOverlay("show");

    $('.selectpicker').selectpicker('val', 'None');

    $('#main-ms-bf-btn').prop("checked", true);

    $('#main-ms-a-btn').prop("checked", false);
    $('#main-ms-a1-btn').prop("checked", false);
    $('#main-ms-a2-btn').prop("checked", false);

    $('#main-ms-b-btn').prop("checked", false);
    $('#main-ms-bac-btn').prop("checked", false);
    $('#main-ms-b1-btn').prop("checked", false);

    $('#main-ms-c-btn').prop("checked", false);
    $('#main-ms-cac-btn').prop("checked", false);
    $('#main-ms-cpc-btn').prop("checked", false);
    $('#main-ms-m-btn').prop("checked", false);
    $('#main-ms-n-btn').prop("checked", false);
    $('#main-ms-nac-btn').prop("checked", false);
    $('#main-ms-npc-btn').prop("checked", false);
    $('#main-ms-o-btn').prop("checked", false);
    $('#main-ms-oac-btn').prop("checked", false);
    $('#main-ms-opc-btn').prop("checked", false);


    toggleVariantMss('off');
    $('#var-ms-bf-toggle').bootstrapToggle('disable');


    $('.leftmenutrigger').on('click', function (e) {
        $('.side-nav').toggleClass("open");
        e.preventDefault();
    });
    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }

    });


    $('#update-btn').on('click', function (e) {

        $('#update-btn').blur();

        console.log("Redraw button clicked.");

        resetDrawModeTables();
        sortDrawModeTables();
        globals.draw_animation = true;

    });


    $('#points-btn').on('click', function (e) {

        $('#points-btn').blur();

        if (flashBtnAnim != null) {
            flashBtnAnim.seek(0);
            flashBtnAnim.pause();
            flashBtnAnim = null;
        }

        if (globals.variants_expanded) {
            $('#variants-btn').blur();

            hideVariants();
            globals.variants_expanded = false;
        }


        console.log("Redraw points.");

        resetDrawModeTables();
        sortDrawModeTables();

        drawAlbertisRome();

    });


    $('#svg-export-btn').on('click', function (e) {

        $('#svg-export-btn').blur();

        console.log("Save to svg");

        svgelem = paper.project.exportSVG({
            asString: true
        });
        console.log(typeof svgelem);
        console.log(svgelem);

        var blob = new Blob([svgelem], {
            type: "image/svg+xml;charset=utf-8"
        });
        saveAs(blob, "descriptio.svg");

    });

    $('#nice-map-btn').on('click', function (e) {

        console.log("Draw nice map.");
        $('#nice-map-btn').blur();

        if (!globals.niceMap) {

            globals.niceMap = true;

            $('.selectpicker').selectpicker('val', 'Unit');
            globals.options.drawMode = "per_unit";

            toggleVariantMss('off');
            $('#main-ms-bf-btn').click();
            $('#points-btn').click();

            resetDrawModeTables();
            sortDrawModeTables();
            globals.draw_animation = true;
        }

    });


    $('#variants-btn').on('click', function (e) {

        console.log("Variants button clicked.");

        if (globals.variants_expanded) {
            $('#variants-btn').blur();

            hideVariants();
            globals.variants_expanded = false;
        } else {
            showVariants();
            globals.variants_expanded = true;
        }

    });

    $('#starts-btn').on('click', function (e) {

        console.log("Choose new starting points...");

        if (globals.app_state == "choose_start_coord") {

            $('#starts-btn').blur();

            showStartMarkers(false);
            globals.app_state = "none";
        } else {
            showStartMarkers(true);
            globals.app_state = "choose_start_coord";
        }
    });

    $('#measure-btn').on('click', function (e) {

        console.log("Measure distance...");

        if (globals.app_state == "measure_distance") {

            $('#measure-btn').blur();

            globals.measureLayer.removeChildren();
            globals.app_state = "none";

        } else {
            globals.app_state = "measure_distance";
        }

    });

    $('#map-btn').on('click', function (e) {

        console.log("Toggle map...");

        if (globals.backgroundMap.visible) {

            $('#map-btn').blur();

            anime({
                targets: globals.backgroundMap,
                opacity: 0,
                duration: 200,
                easing: 'linear',
                complete: function (anim) {
                    globals.backgroundMap.visible = false;
                }
            });

        } else {
            globals.backgroundMap.visible = true;

            anime({
                targets: globals.backgroundMap,
                opacity: 0.7,
                duration: 200,
                easing: 'linear'
            });
        }

    });

    $('#circle-btn').on('click', function (e) {

        console.log("Circle overlay...");

        $('#circle-btn').blur();

        if (globals.circleOverlayLayer.visible) {

            console.log("Hide overlay layer...");

            anime({
                targets: globals.circleOverlayLayer,
                opacity: 0,
                duration: 100,
                easing: 'linear',
                complete: function (anim) {
                    globals.circleOverlayLayer.visible = false;
                }
            });

        } else {
            console.log("Show overlay layer...");

            globals.circleOverlayLayer.visible = true;

            anime({
                targets: globals.circleOverlayLayer,
                opacity: 1,
                duration: 100,
                easing: 'linear'
            });

        }

    });

    $("#method-select").change(function () {

        // Unfocus bootstrap-select. Source: https://stackoverflow.com/a/42161771
        $(".btn").blur();

        var selected = $('#method-select option:selected').val();
        console.log("Method selected: " + selected);

        switch (selected) {
            case "Table":
                globals.options.drawMode = "per_table";
                break;

            case "Unit":
                globals.options.drawMode = "per_unit";
                break;

            case "None":
                globals.options.drawMode = "all";
                break;
        }

        drawAlbertisRome();
    });

    $("#mainms-select").change(function () {
        var selected = $('#mainms-select option:selected').val();
        console.log("Main ms selected: " + selected);
    });

    flashEnabled = true;


});


// TODO window on load
$(window).on("load", function () {
    console.log("Window loaded.");

    // TODO Show load screen

    console.log("Run some tests...");

    var canvas = document.getElementById('DescriptioCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    // Does this help?
    // https://stackoverflow.com/questions/32825525/paper-js-why-does-tool-onmousedown-not-trigger
    var tool = new paper.Tool();
    tool.activate();

    elem = document.getElementById('location_pin');
    svg_location_pin = new paper.Symbol(paper.project.importSVG(elem));
    elem.parentNode.removeChild(elem);

    elem = document.getElementById('porta_icon');
    svg_porta_icon = new paper.Symbol(paper.project.importSVG(elem));
    elem.parentNode.removeChild(elem);

    elem = document.getElementById('svg_measure_pin');
    svg_measure_pin = new paper.Symbol(paper.project.importSVG(elem));
    elem.parentNode.removeChild(elem);


    tool.onMouseDown = function (event) {
        console.log("Mouse down!");
        globals.descriptioMouseDown(event);
    }

    tool.onMouseDrag = function (event) {
        console.log("Mouse dragged!");
        globals.descriptioMouseDrag(event);
    }

    tool.onMouseUp = function (event) {
        console.log("Mouse up!");
        globals.descriptioMouseUp(event);
    }

    tool.onMouseMove = function (event) {
        globals.descriptioMouseMove(event);
    }

    paper.view.onFrame = function (event) {
        globals.descriptioFrame(event);
    }


    console.log("Paper.js initialized.");


    // Expensive loading
    WebFont.load({
        active: function () {
            fontLoaded = true;
            console.log("Font Lusitana loaded.");
            initWindowAfterLoading();
        },
        google: {
            families: ['Lusitana']
        }
    });


    $('#DescriptioCanvas').mousewheel(function (event, delta) {

        if (delta < 0) {
            ZoomLevel++;
            paper.view.scale(ZoomInFactor, globals.CurrentMousePosition);
        } else {
            ZoomLevel--;
            if (ZoomLevel > MinZoomLevel) {
                paper.view.scale(ZoomOutFactor, globals.CurrentMousePosition);
            }
        }

        return false; // prevent default
    });
    console.log("jQuery mouse wheel handler set up.")


    // Expensive loading
    $.getJSON("Tabulae.json", function (data) {
        console.log("Tabulae.json loaded!");
        console.log("Data:" + data);

        tabulaeJSON = data;

        jsonLoaded = true;
        console.log("JSON parsed.");
        initWindowAfterLoading();

    });
});