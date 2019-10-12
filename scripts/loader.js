// Used modules:

// Require.js
// http://requirejs.org/

// Require.js text plugin
// https://github.com/requirejs/text



require.config({

    paths: {
        /*
        utils: ['https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
            'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont',
        */
        fonts: "https://ajax.googleapis.com/ajax/libs/webfont/1/webfont"
    }

});

define(["fontfaceobserver", "jquery-3.2.1.min", "jquery.mousewheel", "paperjs/paper-full", "text", "json", "json!../Tabulae.json", "Descriptio", "Pictor"], function (a, b, c, d, e, f, g, h, i) {

    console.log("Load Tabulae.json: " + f)

    p = new paper.Point(9, 8);
    console.log("Point created: " + p);

    /*
    WebFont.load({
        google: {
            families: ['Lusitana']
        },
        active: function () {
            console.log('Google fonts loaded');
        }
    });
    */


    var font = new FontFaceObserver('Lusitana');

    font.load().then(function () {
        console.log('Lusitana has loaded.');
    }).catch(function () {
        console.log('Lusitana failed to load.');
    });

    /*
    $(window).on('load', function () {
        alert("Window loaded.");
    });
    */


    $(document).ready(function () {
        console.log("Document ready!");

        console.log("Set jQuery mouse handler.");
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
    });
});



/*
jQuery.ajax({
    url: "scripts/paperjs/paper-full.js",
    dataType: "script",
    cache: false,
    attrs: {
        type: "text/javascript"
    }
}).done(function () {
    console.log("Paper.js loaded.");

    //p = new paper.Point(9, 8);
    //console.log("Point created.");
});
*/
/*
$.getScript( "scripts/paperjs/paper-full.js", function( data, textStatus, jqxhr ) {
    console.log( data ); // Data returned
    console.log( textStatus ); // Success
    console.log( jqxhr.status ); // 200
    console.log( "Paper.js loaded." );
    p = new Point(9,8);
    console.log("Point created.");
  });
*/

/*
jQuery.ajax({
    url: "scripts/jqmousewheel/jquery.mousewheel.js",
    dataType: "script",
    cache: false,
    async: false,
    attrs: {
        type: "text/javascript"
    }
}).done(function () {
    console.log("jQuery.mousewheel loaded. Set handler.");

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
});

jQuery.ajax({
    url: "scripts/Descriptio.js",
    dataType: "script",
    cache: false,
    async: false,
    attrs: {
        type: "text/javascript"
    }
}).done(function () {
    console.log("Descriptio.js loaded.");
});

jQuery.ajax({
    url: "scripts/Pictor.js",
    dataType: "script",
    cache: false,
    async: false,
    attrs: {
        type: "text/paperscript",
        canvas: "DescriptioCanvas"
    }
}).done(function () {
    console.log("Pictor.js loaded.");
});

jQuery.ajax({
    url: "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",
    dataType: "script",
    cache: false,
    async: false,
    attrs: {
        type: "text/javascript"
    }
}).done(function () {
    console.log("Webfont.js loaded.");
    WebFont.load({
        google: {
            families: ['Lusitana']
        }
    });
    console.log("Google font Lusitana loaded.");
});

$.getJSON("Tabulae.json", function (data) {
    console.log("Tabulae.json loaded.");
    tabulaeJSON = data;
    console.log("tabulaeJSON saved.");
});

$(window).bind("load", function () {
    console.log("Everything loaded.");

    createCoordinateList();
    drawAlbertisRome();
});

$(document).ready(function () {
    console.log("DOM loaded.");

    var canvas = document.getElementById('DescriptioCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    console.log("paper.js set up");
});
*/