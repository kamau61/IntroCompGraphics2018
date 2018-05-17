window.PLANET = window.PLANET || {};
PLANET.temperature = PLANET.temperature || {};

let map = function (x, a1, a2, b1, b2) {
    if (x < a1) return b1;
    if (x > a2) return b2;
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
};

PLANET.temperature.set = function (value) {
    params.Temperature = Math.min(Math.max(value, CONSTANTS.FREEZE_POINT), CONSTANTS.BOIL_POINT);
    let opt = CONSTANTS.OPT_TEMP;
    let cold = opt - CONSTANTS.OPT_RANGE;
    let hot = opt + CONSTANTS.OPT_RANGE;
    let freeze = CONSTANTS.FREEZE_POINT;
    let melt = opt * 2 - freeze;
    let boil = CONSTANTS.BOIL_POINT;
    params.SnowLevel = map(value, freeze, melt, 1, 0);
    params.SandLevel = map(value, melt, boil, 0.1, 1 + 1 / params.TerrainDisplacement);
    params.WaterLevel = map(value, melt, boil, 100, params.PlanetRadius * (1 - params.TerrainDisplacement));
    params.GrassSpread = Math.min(map(value, cold, opt, 1, -0.5), map(value, opt, hot, -0.5, -1));
    params.TreeSpread = Math.min(map(value, cold, opt, 1, 0.5), map(value, opt, hot, -0.5, 0.5));
    planet.update();
};

