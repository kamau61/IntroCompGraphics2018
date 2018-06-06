window.PLANET = window.PLANET || {};
PLANET.climate = PLANET.climate || {};

//Climate - Boris
//Climate to link params together in order to visualise their changes in a logical sense
PLANET.climate.Climate = function () {
    let climate = {};
    climate.temperature = params.Temperature;

    //Set temperature to a value and changes all params accordingly
    climate.set = function (value) {
        let opt = CONSTANTS.OPT_TEMP;           //optimal temperature at which planet has most plants
        let freeze = CONSTANTS.FREEZE_POINT;    //temperature at which ocean freezes
        let melt = opt * 2 - freeze;            //temperature at which all snow melts
        let boil = CONSTANTS.BOIL_POINT;        //temperature at which ocean vaporizes
        let lava = CONSTANTS.LAVA_POINT;        //temperature at which planet is covered in lava
        climate.temperature = Math.min(Math.max(value, freeze), boil); //ensure that temperature is in range
        params.SnowLevel = utils.map(value, freeze, melt, 100, 0);
        params.SandLevel = utils.map(value, melt, boil, 10, 100);
        params.SeaLevel = utils.map(value, melt, boil, 50, 0);
        planet.ocean.visible = params.SeaLevel > 0;
        params.LavaLevel = utils.map(value, boil, lava, 0, 50);
        planet.lava.visible = params.LavaLevel > 0;
        params.GrassSpread = Math.max(utils.map(value, freeze, opt, 0.6, -0.5), utils.map(value, opt, boil, -0.5, 0.6));
        params.TreeSpread = Math.max(utils.map(value, freeze, opt, 0.8, 0.5), utils.map(value, opt, boil, 0.5, 0.8));
        planet.update();
    };

    return climate;
};
