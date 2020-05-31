// Transform points from Alberti's coordinates to cartesian coordinates
// and apply current view port dimensions.
function calculateCartesianCoordinates() {

    console.log("Calculate points from Albeti’s coordinates to cartesian coordinates.");
    console.log("Number of coordinates: " + globals.albertisCoordinates.length);

    // Alberti’s horizon is divided into 48 gradus, each of which is in turn divided into 4 minuta.
    // Alberti’s radius is divided into 50 gradus, each of which is in turn divided into 4 minuta.
    
    // Calculate one "radius gradus/minuta" and "horizon gradus/minuta" based on
    // dimensions of current viewport
    oneRadiusGradus = bigHorizonRadius / 50;
    oneRadiusMinuta = oneRadiusGradus / 4;

    oneHorizonGradus = 2 * Math.PI / 48;
    oneHorizonMinuta = oneHorizonGradus / 4;

    //console.log(oneRadiusGradus + " " + oneRadiusMinuta + " " + oneHorizonGradus + " " + oneHorizonMinuta);

    for (i = 0; i < globals.albertisCoordinates.length; i++) {

        currentAC = globals.albertisCoordinates[i];

        //console.log(albertisCoordToString(currentAC));

        //console.log("  Current coord: " + currentAC.variants.length + " variants.");
        // Go through all variants
        for (j = 0; j < currentAC.variants.length; j++) {
            currentVar = currentAC.variants[j];

            //console.log("Variante:")
            //console.log(currentVar);

            r = currentVar.radiusGradus * oneRadiusGradus + currentVar.radiusMinuta * oneRadiusMinuta;
            phi = currentVar.horizonGradus * oneHorizonGradus + currentVar.horizonMinuta * oneHorizonMinuta;
            phi -= globals.HorizonRotation * oneHorizonGradus;

            //console.log("r="+r+", phi="+phi+", cos(phi)="+Math.cos(phi)+", horizon center="+horizonCenter);
            // x = r*cos(phi)
            // y = r*sin(phi)

            x = horizonCenter.x + (r * Math.cos(phi));
            y = horizonCenter.y + (r * Math.sin(phi));
            currentVar.cartesianPoint = new paper.Point(x, y);

            //console.log("x: " + x + ", y: " + y + " CP: " + currentVar.cartesianPoint);
        }

        // Transform recte coordinate
        if (currentAC.recte != null) {
            r = currentAC.recte.radiusGradus * oneRadiusGradus + currentAC.recte.radiusMinuta * oneRadiusMinuta;
            phi = currentAC.recte.horizonGradus * oneHorizonGradus + currentAC.recte.horizonMinuta * oneHorizonMinuta;
            phi -= globals.HorizonRotation * oneHorizonGradus;

            x = horizonCenter.x + (r * Math.cos(phi));
            y = horizonCenter.y + (r * Math.sin(phi));
            currentAC.recteCartesianPoint = new paper.Point(x, y);
        }

        //console.log(currentAC);
    }
}

function superscriptMs(ms) {

    if (ms.endsWith('1')) {
        return ms.substring(0, ms.length - 1) + "1".sup();
    }

    if (ms.endsWith('2')) {
        return ms.substring(0, ms.length - 1) + "2".sup();
    }

    if (ms.endsWith('ac')) {
        return ms.substring(0, ms.length - 2) + "ac".sup();
    }

    if (ms.endsWith('pc')) {
        return ms.substring(0, ms.length - 2) + "pc".sup();
    }

    return ms;
}

function numberWithFraction(number) {

    switch (number) {
        case '0.333':
            return '⅓';

        case '0.666':
            return '⅔';

        case '0.5':
            return '½';
    }

    if (number.endsWith('.333')) {
        return number.substring(0, number.length - 4) + "⅓";
    }

    if (number.endsWith('.666')) {
        return number.substring(0, number.length - 4) + "⅔";
    }

    if (number.endsWith('.5')) {
        return number.substring(0, number.length - 2) + "½";
    }

    return number;
}


function albertisCoordToString(a) {
    return "(" + a.HorizonGradus + "," + a.HorizonMinuta + "|" + a.RadiusGradus + "," + a.RadiusMinuta + ")";
}

function getPointFromCoord(a) {
    
    idx = a.mainVariantIndex;
    result = new paper.Point(a.variants[idx].cartesianPoint.x, a.variants[idx].cartesianPoint.y);

    return result;
}

function albertisCoordinateEquals(a, b) {

    if (a.horizonGradus == b.horizonGradus &&
        a.horizonMinuta == b.horizonMinuta &&
        a.radiusGradus == b.radiusGradus &&
        a.radiusMinuta == b.radiusMinuta) {
        return true;
    }
    return false;
}

function toRoman(arabic) {

    switch (arabic) {
        case 1:
        return "I";
        case 2:
        return "II";
        case 3:
        return "III";
        case 4:
        return "IV";
        case 5:
        return "V";
        case 6:
        return "VI";
        case 7:
        return "VII";
        case 8:
        return "VIII";
        case 9:
        return "IX";
        case 10:
        return "X";
        case 11:
        return "XI";
        case 12:
        return "XII";
        case 13:
        return "XIII";
        case 14:
        return "XIV";
        case 15:
        return "XV";
        case 16:
        return "XVI";
    }
}

/**
 * @param  {Array} coordList Unsorted list of AlbertisCoordinates.
 * @param  {AlbertisCoordinate} startCoord Coordinate to use as a starting point for sorting.
 */
function sortCoords(coordList, startCoord) {

    //console.log("Sort coords.");


    result = [];
    result.push(startCoord);


    // Find index of start coordinate and remove it from array
    //i = coordList.indexOf(startCoord);
    //console.log("Index of start coord: "+i);

    currX = startCoord.variants[startCoord.mainVariantIndex].cartesianPoint.x;
    currY = startCoord.variants[startCoord.mainVariantIndex].cartesianPoint.y;
    //console.log("index coord = ("+tx+"|"+ty+") start coord = (" + currX + "|" + currY + ")");


    //errorI = 0;

    startIdx = coordList.indexOf(startCoord);
    coordList.splice(startIdx, 1);

    

    while (coordList.length > 0) {

        // Save min distance and corresponding index
        minDist = Number.MAX_SAFE_INTEGER;
        minIndex = -1;
        //console.log("Max="+minDist);

        // Loop through remaining coordinates
        for (j = 0; j < coordList.length; j++) {

            currCoord = coordList[j];
            nextX = currCoord.variants[currCoord.mainVariantIndex].cartesianPoint.x;
            nextY = currCoord.variants[currCoord.mainVariantIndex].cartesianPoint.y;
            //console.log("  curr coord = (" + nextX + "|" + nextY + ")");

            newDist = Math.pow(nextX - currX, 2) + Math.pow(nextY - currY, 2);
            //console.log("dist=" + newDist);

            if (newDist < minDist) {

                // Save current index and new distance
                minIndex = j;
                minDist = newDist;
            }

        }



        // Add to result and remove from array
        //console.log("min dist=" + minDist + ", min index=" + minIndex);

        result.push(coordList[minIndex]);

        // Update currX/currY
        currX = coordList[minIndex].variants[coordList[minIndex].mainVariantIndex].cartesianPoint.x;
        currY = coordList[minIndex].variants[coordList[minIndex].mainVariantIndex].cartesianPoint.y;

        coordList.splice(minIndex, 1);
        //console.log("list length=" + coordList.length);

        
        //errorI++;
        //if (errorI > 50) {
        //    console.log("***ERROR BREAK.");
        //    break;
        //}
        

    }

    

    console.log("List sorted!");
    return result;
}


function createCoordMark(x, y, desc) {

    switch (desc.shape) {

        case "square":
            console.log("Create square...");

            halfSize = desc.size * 0.5;

            p = new paper.Point(x - halfSize, y - halfSize);
            s = new paper.Size(desc.size, desc.size);
            square = new paper.Shape.Rectangle(p, s);
            square.strokeColor = desc.strokeColor;
            square.fillColor = desc.fillColor;

            break;

    }
}

// Source: https://jsperf.com/array-prototype-move
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

function setVariantMs(ms, toggle) {

    flashUpdateBtn();

    console.log("Set variant ms: " + ms);
    console.log("Toggle: " + toggle + ", checked=" + document.getElementById(toggle).checked);

    if (document.getElementById(toggle).checked) {
        globals.variantMss.push(ms);
    } else {
        idx = globals.variantMss.indexOf(ms);
        if (idx > -1) {
            globals.variantMss.splice(idx, 1);
        }
    }

    console.log("Main ms: >" + globals.mainMs + "<, variant mss: " + globals.variantMss);
}

function flashUpdateBtn() {

    console.log("flashUpdateBtn(), flashBtnAnim=" + flashBtnAnim + ", flashEnabled=" + flashEnabled);

    if (flashBtnAnim == null && flashEnabled) {

        console.log("Make new flash button...");

        flashBtnAnim = anime({
            targets: '#points-btn',
            backgroundColor: '#EF96A2',
            easing: 'steps(1)',
            duration: 750,
            direction: 'alternate',
            loop: true,
        });
    }
}

function toggleVariantMss(toggle) {

    $('#var-ms-bf-toggle').bootstrapToggle(toggle);
    $('#var-ms-a-toggle').bootstrapToggle(toggle);
    $('#var-ms-a1-toggle').bootstrapToggle(toggle);
    $('#var-ms-a2-toggle').bootstrapToggle(toggle);

    $('#var-ms-b-toggle').bootstrapToggle(toggle);
    $('#var-ms-bac-toggle').bootstrapToggle(toggle);
    $('#var-ms-b1-toggle').bootstrapToggle(toggle);

    $('#var-ms-c-toggle').bootstrapToggle(toggle);
    $('#var-ms-cac-toggle').bootstrapToggle(toggle);
    $('#var-ms-cpc-toggle').bootstrapToggle(toggle);
    $('#var-ms-m-toggle').bootstrapToggle(toggle);
    $('#var-ms-n-toggle').bootstrapToggle(toggle);
    $('#var-ms-nac-toggle').bootstrapToggle(toggle);
    $('#var-ms-npc-toggle').bootstrapToggle(toggle);
    $('#var-ms-o-toggle').bootstrapToggle(toggle);
    $('#var-ms-oac-toggle').bootstrapToggle(toggle);
    $('#var-ms-opc-toggle').bootstrapToggle(toggle);

}

function setMainMs(ms) {

    flashUpdateBtn();

    // Deactivate variant switches
    enableAllVariantToggles();

    switch (ms) {

        case "Boriaud-Furlan":
            $('#var-ms-bf-toggle').bootstrapToggle('off');
            $('#var-ms-bf-toggle').bootstrapToggle('disable');
            break;

        case "A":
            $('#var-ms-a-toggle').bootstrapToggle('off');
            $('#var-ms-a-toggle').bootstrapToggle('disable');
            break;

        case "A1":
            $('#var-ms-a1-toggle').bootstrapToggle('off');
            $('#var-ms-a1-toggle').bootstrapToggle('disable');
            break;

        case "A2":
            $('#var-ms-a2-toggle').bootstrapToggle('off');
            $('#var-ms-a2-toggle').bootstrapToggle('disable');
            break;

        case "B":
            $('#var-ms-b-toggle').bootstrapToggle('off');
            $('#var-ms-b-toggle').bootstrapToggle('disable');
            break;

        case "Bac":
            $('#var-ms-bac-toggle').bootstrapToggle('off');
            $('#var-ms-bac-toggle').bootstrapToggle('disable');
            break;

        case "B1":
            $('#var-ms-b1-toggle').bootstrapToggle('off');
            $('#var-ms-b1-toggle').bootstrapToggle('disable');
            break;

        case "C":
            $('#var-ms-c-toggle').bootstrapToggle('off');
            $('#var-ms-c-toggle').bootstrapToggle('disable');
            break;

        case "Cac":
            $('#var-ms-cac-toggle').bootstrapToggle('off');
            $('#var-ms-cac-toggle').bootstrapToggle('disable');
            break;

        case "Cpc":
            $('#var-ms-cpc-toggle').bootstrapToggle('off');
            $('#var-ms-cpc-toggle').bootstrapToggle('disable');
            break;

        case "M":
            $('#var-ms-m-toggle').bootstrapToggle('off');
            $('#var-ms-m-toggle').bootstrapToggle('disable');
            break;

        case "N":
            $('#var-ms-n-toggle').bootstrapToggle('off');
            $('#var-ms-n-toggle').bootstrapToggle('disable');
            break;

        case "Nac":
            $('#var-ms-nac-toggle').bootstrapToggle('off');
            $('#var-ms-nac-toggle').bootstrapToggle('disable');
            break;

        case "Npc":
            $('#var-ms-npc-toggle').bootstrapToggle('off');
            $('#var-ms-npc-toggle').bootstrapToggle('disable');
            break;

        case "O":
            $('#var-ms-o-toggle').bootstrapToggle('off');
            $('#var-ms-o-toggle').bootstrapToggle('disable');
            break;

        case "Oac":
            $('#var-ms-oac-toggle').bootstrapToggle('off');
            $('#var-ms-oac-toggle').bootstrapToggle('disable');
            break;

        case "Opc":
            $('#var-ms-opc-toggle').bootstrapToggle('off');
            $('#var-ms-opc-toggle').bootstrapToggle('disable');
            break;

    }


    console.log("Set main ms to >" + ms + "<.");
    globals.mainMs = ms;

    // Remove ms from variant mss if it were listed there
    while (globals.variantMss.indexOf(ms) > -1) {
        globals.variantMss.splice(globals.variantMss.indexOf(ms), 1);
    }

    console.log("Main ms: >" + globals.mainMs + "<, variant mss: " + globals.variantMss);

}

function enableAllVariantToggles() {

    $('#var-ms-bf-toggle').bootstrapToggle('enable');
    $('#var-ms-a-toggle').bootstrapToggle('enable');
    $('#var-ms-a1-toggle').bootstrapToggle('enable');
    //$('#var-ms-a1ac-toggle').bootstrapToggle('enable');
    //$('#var-ms-a1pc-toggle').bootstrapToggle('enable');
    $('#var-ms-a2-toggle').bootstrapToggle('enable');

    $('#var-ms-b-toggle').bootstrapToggle('enable');
    $('#var-ms-bac-toggle').bootstrapToggle('enable');
    //$('#var-ms-bpc-toggle').bootstrapToggle('enable');
    $('#var-ms-b1-toggle').bootstrapToggle('enable');

    $('#var-ms-c-toggle').bootstrapToggle('enable');
    $('#var-ms-cac-toggle').bootstrapToggle('enable');
    $('#var-ms-cpc-toggle').bootstrapToggle('enable');
    $('#var-ms-m-toggle').bootstrapToggle('enable');
    $('#var-ms-n-toggle').bootstrapToggle('enable');
    $('#var-ms-nac-toggle').bootstrapToggle('enable');
    $('#var-ms-npc-toggle').bootstrapToggle('enable');
    $('#var-ms-o-toggle').bootstrapToggle('enable');
    $('#var-ms-oac-toggle').bootstrapToggle('enable');
    $('#var-ms-opc-toggle').bootstrapToggle('enable');

}