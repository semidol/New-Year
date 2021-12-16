
/**
 *
 * Скрипт новогоднего праздника xD
 *
 * Licensed under the MIT license.
 * https://www.opensource.org/licenses/mit-license.php
 * 
 * Идея Script Tutorials
 * https://www.script-tutorials.com
 * 
 * Адаптация
 * https://www.ipetrenko.ru 
 */

// canvas and context objects
var canvas, ctx;

//Snowflakes object
Snowflakes = (function () {

    // sprites information
    var sprCnt = 15;
    var sprWidth = 80;
    var sprHeight = 68;

    // arrays of snowflakes and sprites
    var snowflakes = [];
    var snowflakeSprites = [];

    // other inner params
    var minScale = 0.2; // min scale for flakes
    var maxScale = 1.2; // max scale for flakes

    var minVerticalVelocity = 2; // min vertical velocity
    var maxVerticalVelocity = 5; // max vertical velocity
    var minHorizontalVelocity = -2; // min horizontal velocity
    var maxHorizontalVelocity = 3; // max horizontal velocity

    var minOpacity = 0.1; // min opacity
    var maxOpacity = 0.9; // max opacity
    var maxOpacityIncrement = 60; // opacity increment

    // every flake swings in the interim between next deltas:
    var minHorizontalDelta = 1;
    var maxHorizontalDelta = 4;

    var speed = 2; // speed

    // get random number between x1 and x2
    function getRandom(x1, x2) {
        return Math.random() * (x2 - x1) + x1
    }

    // initialize sprites
    function initializeSprites() {
        var img = new Image();
        img.onload = function () {

            // fill snowflakeSprites with every sprite of sprite.png
            for (var i = 0; i < sprCnt; i++) {
                // create new canvas
                var sprite = document.createElement('canvas');
                sprite.width = sprWidth;
                sprite.height = sprHeight;
                var context = sprite.getContext('2d');

                // and draw every sprite at this canvas
                context.drawImage(img, i * sprWidth, 0, sprWidth, sprHeight, 0, 0, sprWidth, sprHeight);

                // and fill array
                snowflakeSprites.push(sprite);
            }
        }
        img.src = 'https://nwo.ucoz.ua/demo/ny/sprite.png';
    };

    // initialize snowflakes
    function initialize(number) {
        // initialize sprites
        initializeSprites();

        // prepare a necessary amount of snowflakes
        for (var i = 0; i < number; i++) {
            snowflakes.push(initializeSnowflake());
        }
    };

    // initialize snowflake
    function initializeSnowflake() {
        // get random scale
        var scale = getRandom(minScale, maxScale);

        return {
            x: Math.random() * ctx.canvas.width, // x and
            y: Math.random() * ctx.canvas.height, // y positions
            vv: getRandom(minVerticalVelocity, maxVerticalVelocity), // vertical and
            hv: getRandom(minHorizontalVelocity, maxHorizontalVelocity), // horizontal velocity
            o: getRandom(minOpacity, maxOpacity), // opacity
            oi: Math.random() / maxOpacityIncrement, // opacity increment
            mhd: getRandom(minHorizontalDelta, maxHorizontalDelta), // maximum horizontal delta
            hd: 0, // horizontal delta
            hdi: Math.random() / (maxHorizontalVelocity * minHorizontalDelta), // horizontal delta increment
            sw: scale * sprWidth, // scaled sprite width
            sh: scale * sprHeight, // and height
            si: Math.ceil(Math.random() * (sprCnt - 1)) // sprite index
        }
    };

    // move flakes
    function moveFlakes() {
        for (var i = 0; i < snowflakes.length; i++) {
            var osf = snowflakes[i];

            // shift X and Y position
            osf.x += (osf.hd + osf.hv) * speed;
            osf.y += osf.vv * speed;

            // swings             
            osf.hd += osf.hdi;
            if (osf.hd < -osf.mhd || osf.hd > osf.mhd) {
                osf.hdi = -osf.hdi;
            };

            // collision with borders
            if (osf.y > ctx.canvas.height + sprHeight / 2) {
                osf.y = 0
            };
            if (osf.y < 0) {
                osf.y = ctx.canvas.height
            };
            if (osf.x > ctx.canvas.width + sprWidth / 2) {
                osf.x = 0
            };
            if (osf.x < 0) {
                osf.x = ctx.canvas.width
            };

            // toggle opacity
            osf.o += osf.oi;
            if (osf.o > maxOpacity || osf.o < minOpacity) {
                osf.oi = -osf.oi
            };
            if (osf.o > maxOpacity)
                osf.o = maxOpacity;
            if (osf.o < minOpacity)
                osf.o = minOpacity;
        }
    }

    // render frame
    function renderFrame() {

        // move (shift) our flakes
        moveFlakes();

        // clear content
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // draw each flake
        for (var i = 0; i < snowflakes.length; i++) {
            var osf = snowflakes[i];
            ctx.globalAlpha = osf.o;
            ctx.drawImage(snowflakeSprites[osf.si], 0, 0, sprWidth, sprHeight, osf.x, osf.y, osf.sw, osf.sh);
        }
    }

    return {
        'initialize': initialize,
        'render': renderFrame,
    }
})();

// main initialization
function initialization() {

    // create canvas and context objects
    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');

    // set canvas size - fullscreen
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // loop main scene
    setInterval(Snowflakes.render, 40);
    Snowflakes.initialize(100);
}

// window onload event handler
if (window.attachEvent) {
    window.attachEvent('onload', initialization);
} else {
    if (window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            initialization();
        };
        window.onload = newonload;
    } else {
        window.onload = initialization;
    }
}