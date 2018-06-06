window.PLANET = window.PLANET || {};
PLANET.utils = PLANET.utils || {};

//Utils - Boris
//Functions that are used in other js files
//Functions that make params more understandable in control panel, in percentage
PLANET.utils = function () {
    THREE.Object3D.call(this);

    //Range mapping with caps
    //a1 must be less than a2
    this.map = function (x, a1, a2, b1, b2) {
        if (x < a1) return b1;                          //return b1 if value is lower than min
        if (x > a2) return b2;                          //return b2 if value is larger than max
        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);   //normal range mapping equation
    };

    //Return max terrain height in pixel form percent
    this.getPeakLevel = function () {
        return params.PlanetRadius * (1 + params.TerrainDisplacement / 100);
    };

    //Return min terrain height in pixel from percent
    this.getBottomLevel = function () {
        return params.PlanetRadius * (1 - params.TerrainDisplacement / 100);
    };

    //Calculate level from percentage, support both from top and from bottom
    this.GET_FROM = {TOP: 0, BOTTOM: 1};
    this.getLevel = function (max, min, from, percentage) {
        switch (from) {
            case this.GET_FROM.TOP:
                return max - (max - min) * percentage;
            case this.GET_FROM.BOTTOM:
                return (max - min) * percentage + min;
        }
    };

    //Return sea level in pixel
    this.getSeaLevel = function () {
        return this.getLevel(this.getPeakLevel(), this.getBottomLevel(), this.GET_FROM.BOTTOM, params.SeaLevel / 100);
    };

    //Return lava level in pixel
    this.getLavaLevel = function () {
        return this.getLevel(this.getPeakLevel(), this.getBottomLevel(), this.GET_FROM.BOTTOM, params.LavaLevel / 100);
    };

    //Return snow level in pixel
    this.getSnowLevel = function () {
        return this.getLevel(this.getPeakLevel(), this.getSeaLevel(), this.GET_FROM.TOP, params.SnowLevel / 100);
    };

    //Return sand level in pixel
    this.getSandLevel = function () {
        return this.getLevel(this.getPeakLevel(), this.getSeaLevel(), this.GET_FROM.BOTTOM, params.SandLevel / 100);
    };

    //Return seabed level in pixel, considering wave height
    this.getSeabedLevel = function () {
        return this.getSeaLevel() - params.WaveHeight * 10;
    };
};

PLANET.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);