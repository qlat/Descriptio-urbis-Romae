/**
 * @param  {int} t Number of table to return, starting at 0.
 */
function getTableCoordinates(t) {

    table = [];

    start = -1;
    end = -1;

    switch (t) {
        case 0: // ANGVLI MVRORUM IN LATIO
            start = 0;
            end = 36;
            break;
        case 1: // AVX MVRORUM IN LATIO
            start = 36;
            end = 50;
            break;
        case 2: // ANGVLI MVRORVM TRANS TYBERIM
            start = 50;
            end = 57;
            break;
        case 3: // AVGES MVRORVM TRANS TYBERIM
            start = 57;
            end = 60;
            break;
        case 4: // ANGULI MVRORVM AD LEONIDAM
            start = 60;
            end = 73;
            break;
        case 5: // AVGES MVRORVM AD LEONINAM
            start = 73;
            end = 77;
            break;
        case 6: // PORTAE IN LATIO
            start = 77;
            end = 87;
            break;
        case 7: // PORTAE IN MVRIS TRANS TYBERIM
            start = 87;
            end = 90;
            break;
        case 8: // PORTAE IN MVRIS LEONINAE
            start = 90;
            end = 95;
            break;
        case 9: // TYBERIS FLVVII LINEA MEDIANA
            start = 95;
            end = 114;
            break;
        case 10: // INSULAE CAPITA
            start = 114;
            end = 116;
            break;
        case 11: // INSULAE AVGES
            start = 116;
            end = 118;
            break;
        case 12: // LATERA FLVMINIS
            start = 118;
            end = 126;
            break;
        case 13: // LATERA FLVMINIS ???
            start = 126;
            end = 131;
            break;
        case 14: // ITERVM MEDIANA LINEA FLVMINIS A PONTE INFRA
            start = 131;
            end = 141;
            break;
        case 15: // TEMPLA ET PVBLICA VRBIS AEDIFICIA
            start = 141;
            end = 176;
            break;
    }

    return globals.albertisCoordinates.slice(start, end);
}


function getMuriInLatioCoords() {

    console.log("Include portae: " + globals.options.includePortae);

    muriInLatio = [];
    
    muriInLatio.push(globals.albertisCoordinates[0]);
    muriInLatio.push(globals.albertisCoordinates[1]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[77]);
    }
    muriInLatio.push(globals.albertisCoordinates[2]);
    muriInLatio.push(globals.albertisCoordinates[36]);
    muriInLatio.push(globals.albertisCoordinates[3]);
    muriInLatio.push(globals.albertisCoordinates[37]);
    muriInLatio.push(globals.albertisCoordinates[4]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[78]);
    }
    muriInLatio.push(globals.albertisCoordinates[5]);
    muriInLatio.push(globals.albertisCoordinates[6]);
    muriInLatio.push(globals.albertisCoordinates[7]);
    muriInLatio.push(globals.albertisCoordinates[8]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[79]);
    }
    muriInLatio.push(globals.albertisCoordinates[38]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[80]);
    }
    muriInLatio.push(globals.albertisCoordinates[9]);
    muriInLatio.push(globals.albertisCoordinates[10]);
    muriInLatio.push(globals.albertisCoordinates[11]);
    muriInLatio.push(globals.albertisCoordinates[12]);
    muriInLatio.push(globals.albertisCoordinates[13]);
    muriInLatio.push(globals.albertisCoordinates[14]);
    muriInLatio.push(globals.albertisCoordinates[39]);
    muriInLatio.push(globals.albertisCoordinates[15]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[81]);
    }
    muriInLatio.push(globals.albertisCoordinates[40]);
    muriInLatio.push(globals.albertisCoordinates[16]);
    muriInLatio.push(globals.albertisCoordinates[41]);
    muriInLatio.push(globals.albertisCoordinates[17]);
    muriInLatio.push(globals.albertisCoordinates[18]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[82]);
    }
    muriInLatio.push(globals.albertisCoordinates[19]);
    muriInLatio.push(globals.albertisCoordinates[20]);
    muriInLatio.push(globals.albertisCoordinates[21]);
    muriInLatio.push(globals.albertisCoordinates[22]);
    muriInLatio.push(globals.albertisCoordinates[42]);
    muriInLatio.push(globals.albertisCoordinates[23]);
    muriInLatio.push(globals.albertisCoordinates[24]);
    muriInLatio.push(globals.albertisCoordinates[43]);
    muriInLatio.push(globals.albertisCoordinates[25]);
    muriInLatio.push(globals.albertisCoordinates[44]);
    muriInLatio.push(globals.albertisCoordinates[26]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[83]);
    }
    muriInLatio.push(globals.albertisCoordinates[27]);
    muriInLatio.push(globals.albertisCoordinates[45]);
    muriInLatio.push(globals.albertisCoordinates[28]);
    muriInLatio.push(globals.albertisCoordinates[46]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[84]);
    }
    muriInLatio.push(globals.albertisCoordinates[29]);
    muriInLatio.push(globals.albertisCoordinates[47]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[85]);
    }
    muriInLatio.push(globals.albertisCoordinates[30]);
    muriInLatio.push(globals.albertisCoordinates[31]);
    muriInLatio.push(globals.albertisCoordinates[48]);
    muriInLatio.push(globals.albertisCoordinates[32]);
    muriInLatio.push(globals.albertisCoordinates[33]);
    muriInLatio.push(globals.albertisCoordinates[49]);
    muriInLatio.push(globals.albertisCoordinates[34]);
    if (globals.options.includePortae) {
        muriInLatio.push(globals.albertisCoordinates[86]);
    }
    muriInLatio.push(globals.albertisCoordinates[35]);
    

    return muriInLatio;
}


function getMuriTransTyberimCoords() {

    muriTransTyberim = [];
    muriTransTyberim.push(globals.albertisCoordinates[50]);
    if (globals.options.includePortae) {
        muriTransTyberim.push(globals.albertisCoordinates[87]);
    }
    muriTransTyberim.push(globals.albertisCoordinates[51]);
    muriTransTyberim.push(globals.albertisCoordinates[52]);
    muriTransTyberim.push(globals.albertisCoordinates[57]);
    muriTransTyberim.push(globals.albertisCoordinates[53]);
    muriTransTyberim.push(globals.albertisCoordinates[54]);
    muriTransTyberim.push(globals.albertisCoordinates[58]);
    if (globals.options.includePortae) {
        muriTransTyberim.push(globals.albertisCoordinates[88]);
    }
    muriTransTyberim.push(globals.albertisCoordinates[55]);
    muriTransTyberim.push(globals.albertisCoordinates[59]);
    if (globals.options.includePortae) {
        muriTransTyberim.push(globals.albertisCoordinates[89]);
    }
    muriTransTyberim.push(globals.albertisCoordinates[56]);

    return muriTransTyberim;
}

function getMuriAdLeoninamCoords() {

    muriAdLeoninam = [];
    muriAdLeoninam.push(globals.albertisCoordinates[60]);
    if (globals.options.includePortae) {
        muriAdLeoninam.push(globals.albertisCoordinates[90]);
    }
    muriAdLeoninam.push(globals.albertisCoordinates[61]);
    muriAdLeoninam.push(globals.albertisCoordinates[73]);
    muriAdLeoninam.push(globals.albertisCoordinates[62]);
    muriAdLeoninam.push(globals.albertisCoordinates[63]);
    if (globals.options.includePortae) {
        muriAdLeoninam.push(globals.albertisCoordinates[91]);
    }
    muriAdLeoninam.push(globals.albertisCoordinates[64]);
    if (globals.options.includePortae) {
        muriAdLeoninam.push(globals.albertisCoordinates[92]);
    }
    muriAdLeoninam.push(globals.albertisCoordinates[65]);
    muriAdLeoninam.push(globals.albertisCoordinates[66]);
    muriAdLeoninam.push(globals.albertisCoordinates[74]);
    muriAdLeoninam.push(globals.albertisCoordinates[67]);
    muriAdLeoninam.push(globals.albertisCoordinates[68]);
    muriAdLeoninam.push(globals.albertisCoordinates[69]);
    if (globals.options.includePortae) {
        muriAdLeoninam.push(globals.albertisCoordinates[93]);
    }
    muriAdLeoninam.push(globals.albertisCoordinates[70]);
    muriAdLeoninam.push(globals.albertisCoordinates[75]);
    muriAdLeoninam.push(globals.albertisCoordinates[71]);
    muriAdLeoninam.push(globals.albertisCoordinates[76]);
    if (globals.options.includePortae) {
        muriAdLeoninam.push(globals.albertisCoordinates[94]);
    }
    muriAdLeoninam.push(globals.albertisCoordinates[72]);

    return muriAdLeoninam;
}

function getFlumenCoords() {

    flumen = [globals.albertisCoordinates[95],
        globals.albertisCoordinates[96],
        globals.albertisCoordinates[97],
        globals.albertisCoordinates[98],
        globals.albertisCoordinates[99],
        globals.albertisCoordinates[100],
        globals.albertisCoordinates[101],
        globals.albertisCoordinates[102],
        globals.albertisCoordinates[103],
        globals.albertisCoordinates[104],
        globals.albertisCoordinates[105],
        globals.albertisCoordinates[106],
        globals.albertisCoordinates[107],
        globals.albertisCoordinates[108],
        globals.albertisCoordinates[109],
        globals.albertisCoordinates[110],
        globals.albertisCoordinates[111],
        globals.albertisCoordinates[112],
        globals.albertisCoordinates[113],
    ];

    return flumen;
}

function getInsulaCoords() {

    insula = [globals.albertisCoordinates[114],
        globals.albertisCoordinates[116],
        globals.albertisCoordinates[115],
        globals.albertisCoordinates[117],
        //globals.albertisCoordinates[114]

    ];

    return insula;
}


function getLateraFluminisCoords() {
    lateraFluminis = [globals.albertisCoordinates[118],
        globals.albertisCoordinates[126],
        globals.albertisCoordinates[119],
        globals.albertisCoordinates[120],
        globals.albertisCoordinates[127],
        globals.albertisCoordinates[121],
        globals.albertisCoordinates[128],
        globals.albertisCoordinates[122],
        //globals.albertisCoordinates[131], // <- From the following table
        globals.albertisCoordinates[123],
        globals.albertisCoordinates[129],
        globals.albertisCoordinates[124],
        globals.albertisCoordinates[130],
        globals.albertisCoordinates[125]
    ];

    return lateraFluminis;
}


function getIterumFlumenCoords() {
    iterumFlumen = [globals.albertisCoordinates[131],
        globals.albertisCoordinates[132],
        globals.albertisCoordinates[133],
        globals.albertisCoordinates[134],
        globals.albertisCoordinates[135],
        globals.albertisCoordinates[136],
        globals.albertisCoordinates[137],
        globals.albertisCoordinates[138],
        globals.albertisCoordinates[139],
        globals.albertisCoordinates[140]
    ];

    return iterumFlumen;
}

function createDrawModeTables() {

    console.log("Creating draw mode tables...");

    // Per table: Transfer each table
    drawModeTables.perTable = [];

    switch (globals.options.drawMode) {

        case "per_table":
            newTable = createDrawModeTable(getTableCoordinates(0), 0);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(1), 1);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(2), 2);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(3), 3);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(4), 4);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(5), 5);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(6), 6);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(7), 7);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(8), 8);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(9), 9);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(10), 10);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(11), 11);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(12), 12);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(13), 13);
            drawModeTables.perTable.push(newTable);
        
            newTable = createDrawModeTable(getTableCoordinates(14), 14);
            drawModeTables.perTable.push(newTable);

            break;

        case "per_unit":
            newTable = createDrawModeTable(getMuriInLatioCoords(), 0);
            drawModeTables.perTable.push(newTable);

            newTable = createDrawModeTable(getMuriTransTyberimCoords(), 1);
            drawModeTables.perTable.push(newTable);

            newTable = createDrawModeTable(getMuriAdLeoninamCoords(), 2);
            drawModeTables.perTable.push(newTable);
            
            newTable = createDrawModeTable(getFlumenCoords(), 3);
            drawModeTables.perTable.push(newTable);
            
            newTable = createDrawModeTable(getInsulaCoords(), 4);
            drawModeTables.perTable.push(newTable);

            newTable = createDrawModeTable(getLateraFluminisCoords(), 5);
            drawModeTables.perTable.push(newTable);

            newTable = createDrawModeTable(getIterumFlumenCoords(), 6);
            drawModeTables.perTable.push(newTable);


            break;

            
        case "all":

            newTable = createDrawModeTable(globals.albertisCoordinates.slice(0, 141), 0);
            drawModeTables.perTable.push(newTable);

            break;
    }

    aedificiaTable = createDrawModeTable(getTableCoordinates(15), 0);
    console.log("aedificiaTable:");
    console.log(aedificiaTable);

}

function createDrawModeTable(coords, table_index) {

    tmp_coords = coords;
    tmp_coords.forEach(function (part, index, theArray) {
        theArray[index].table = table_index;
        theArray[index].index = index;
    });


    idx = tmp_coords[0].mainVariantIndex;
    p = tmp_coords[0].variants[idx].cartesianPoint;

    globals.markerLayer.activate();
    marker_point = new paper.Point(p.x + 2, p.y - 8);
  


   markerIcon = svg_location_pin.place();
   markerIcon.position = marker_point;//new paper.Point(0,0);
   markerIcon.visible = false;


    dmTable = {
        coords: tmp_coords,
        animCoords: null,
        animate: false,
        animIndex: 0,
        animDelta: 0,
        path: null,
        startMarker: markerIcon,
        startIndex: 0
    }

    return dmTable;

}

function sortDrawModeTables() {

    console.log("Sorting draw mode tables...");
    console.log("Length="+drawModeTables.perTable.length);
    

    for (i=0;i<drawModeTables.perTable.length;i++) {

        coords = drawModeTables.perTable[i].coords.slice(0);
    
        startCoord = coords[drawModeTables.perTable[i].startIndex];
    
        // Sort
        drawModeTables.perTable[i].animCoords = sortCoords(coords, startCoord);
        //sorted = sortCoords(coords, startCoord);
        drawModeTables.perTable[i].animate = true;
    }
    
}

function resetDrawModeTables() {

    for (i=0; i < drawModeTables.perTable.length; i++) {
        if (drawModeTables.perTable[i].path != null) {
            drawModeTables.perTable[i].path.remove();
            drawModeTables.perTable[i].path = null;
        }
        
    }

}

function highlightDrawModeTable(table_index) {

    console.log("Hightlight table "+table_index);



    //console.log("Draw mode 'per_table'.");

    markers = [];

    for (i = 0; i < drawModeTables.perTable.length; i++) {

        //console.log("Looking in table "+i+ " with length "+drawModeTables.perTable[i].coords.length);
        //console.log(drawModeTables.perTable[i]);

        if (i == table_index) {
            //console.log("Continue for table "+i);
            continue;
        }

        console.log("Fade out table "+i+" != "+table_index);
        currTable = drawModeTables.perTable[i];

        // Fade out start marker
        startMarker = currTable.startMarker;
        markers.push(startMarker);
        //startMarker.opacity = 0.2;

        

        for (j = 0; j < currTable.coords.length; j++) {

            //console.log("Looking in coord "+j);
            //console.log(drawModeTables.perTable[i][j]);
            
            //marker = paper.project.activeLayer.children[drawModeTables.perTable[i].coords[j].coordMarkerName];
            coord = currTable.coords[j];
            name = coord.variants[coord.mainVariantIndex].coordMarkerName;
            //marker = paper.project.activeLayer.children[name];
            marker = globals.coordMarkerLayer.children[name];
            markers.push(marker);

            //console.log("Name=>"+name+"<");
            //console.log(paper.project.activeLayer.children[name]);
            //console.log(globals.coordMarkerLayer.children[name]);

            //marker.opacity = 0.2;

            

            
            //console.log("New alpha = "+drawModeTables.perTable[i].coords[j].coordMarker.strokeColor.alpha);

        }
    }

    //console.log("Animate "+markers.length+" markers...");
    //console.log(markers);
    anime({
        targets: markers,
        opacity: 0.2,
        duration: 50,
        easing: 'linear',
    });

    dmtHighlighted = true;
}

function unhighlightDrawModeTables() {

    console.log("Unhighlight tables.");

    markers = [];

    for (i = 0; i < drawModeTables.perTable.length; i++) {

        currTable = drawModeTables.perTable[i];

        // Fade out start marker
        startMarker = currTable.startMarker;
        //startMarker.opacity = 1.0;
        markers.push(startMarker);

        for (j = 0; j < drawModeTables.perTable[i].coords.length; j++) {

            coord = drawModeTables.perTable[i].coords[j];
            name = coord.variants[coord.mainVariantIndex].coordMarkerName;

            marker = globals.coordMarkerLayer.children[name];
            markers.push(marker);

            //marker.opacity = 1.0;
        }
    }

    anime({
        targets: markers,
        opacity: 1.0,
        duration: 50,
        easing: 'linear',
    });


    dmtHighlighted = false;
}