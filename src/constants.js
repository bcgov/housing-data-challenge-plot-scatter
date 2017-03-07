class Constants {}

Constants.DATA_DIRECTORY = 'data/';
Constants.DATA_SOURCE_FILE = Constants.DATA_DIRECTORY + 'data-sources.json';
Constants.HOUSEHOLD_INDEX_FILE = Constants.DATA_DIRECTORY +'boundary-linked/household-index.csv';

Constants.LOW_COLOR = '#253494';
Constants.LOW_COLOR = 'green';
Constants.MID_COLOR = '#1D91C0';
Constants.MID_COLOR = 'orange';
Constants.HIGH_COLOR = '#41B6C4';
Constants.HIGH_COLOR = 'red';

Constants.MAP_BASE_LAYER_URL = 'https://api.mapbox.com/styles/v1/heatherarmstrong/cizosh07h00462sp84qm1muk2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVhdGhlcmFybXN0cm9uZyIsImEiOiJjaXR4djd6dW0wMnZuMnRxbm44bWo3ankwIn0.9WZTjmVn07UmQ9EwI3awtg';
Constants.MAP_BASE_LAYER_ATTRIBUTION = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
Constants.MAP_INITIAL_BOUNDS = new L.LatLngBounds(
    new L.LatLng(48.308916, -139.052201),
    new L.LatLng(60.000062, -114.054221)
);
Constants.MAP_INITIAL_CENTER = [49.2827, -123.1207];
Constants.MAP_INITIAL_ZOOM = 12;
Constants.MAP_MIN_ZOOM = 4;
Constants.MAP_MAX_ZOOM = 14;

Constants.MAP_BASE_FEATURE_STYLES = {
    weight: 0.2,
    fillOpacity: 0.5,
    color: 'black',
    fillColor: 'grey',
    fill: true
};

Constants.DIVISION = '/';
Constants.MULTIPLICATION = '*';

Constants.BOUNDARY_DATA_TYPE = 'boundary-linked';

Constants.NUM_QUANTILES = 10;

Constants.MAP_BOUNDARY_INFO = {
    census_subdivisions: {
        url: 'http://plotandscatter.com:8080/data/municipalities/{z}/{x}/{y}.pbf',
        featureIdProperty: 'CSDUID',
        featureNameProperty: 'CSDNAME',
        layerName: 'Municipalities_geo',
        label: 'Municipalities'
    },
    economic_regions: {
        url: 'http://plotandscatter.com:8080/data/econregions/{z}/{x}/{y}.pbf',
        featureIdProperty: 'DR_NUM',
        featureNameProperty: 'DR_NAME',
        layerName: 'EconRegions_geo',
        label: 'Economic Regions'
    },
    regional_districts: {
        url: 'http://plotandscatter.com:8080/data/regdistricts/{z}/{x}/{y}.pbf',
        featureIdProperty: 'CDUID',
        featureNameProperty: 'CDNAME',
        layerName: 'RegDistricts_geo',
        label: 'Regional Districts'
    },
    census_tracts: {
        url: 'http://plotandscatter.com:8080/data/census-tracts/{z}/{x}/{y}.pbf',
        featureIdProperty: 'OBJECTID', // TODO: update with better ID
        featureNameProperty: 'OBJECTID // TODO: update with better ID',
        layerName: 'CensusTracts_geo',
        label: 'Census Tracts'
    },
    // census_blocks: {
    //     url: 'http://plotandscatter.com:8080/data/census-dissemination-blocks/{z}/{x}/{y}.pbf',
    //     featureIdProperty: 'OBJECTID', // TODO: update with better ID
    //     featureNameProperty: 'OBJECTID // TODO: update with better ID',
    //     layerName: 'DisseminationBlocks_geo',
    //     label: 'Census Blocks'
    // },
    census_areas: {
        url: 'http://plotandscatter.com:8080/data/census-dissemination-areas-2/{z}/{x}/{y}.pbf',
        featureIdProperty: 'DAUID',
        featureNameProperty: 'CCSNAME',
        layerName: 'DisseminationAreas_clipped',
        label: 'Census Areas'
    }
};

Constants.formatNumber = (number, decimals=2, addCommas=false) => {
    let numToReturn = number;
    if (numToReturn && !isNaN(numToReturn)) {
        if (numToReturn != parseInt(numToReturn)) {
            numToReturn = (+numToReturn).toFixed(decimals).replace(/[.,]00$/, '');
        }
        if (addCommas) { numToReturn = Constants.numberWithCommas(numToReturn); }
    }
    return numToReturn;
};

Constants.getUniqueValues = (array) => {
    return array.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

// From http://stackoverflow.com/a/2901298/715870
Constants.numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// From http://stackoverflow.com/a/8809472/715870
Constants.generateUUID = () => {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

Constants.processBoundaryData = (data) => {

    const accessorFunction = (d => {
        const isNull = d => {
            return d.value === 'Null' || d.value === null || d.value === undefined;
        };
        return isNull(d) ? null : +d.value;
    });

    let min = d3.min(data.data, accessorFunction);
    let max = d3.max(data.data, accessorFunction);
    let median = d3.median(data.data, accessorFunction);
    let domain = data.data.map(accessorFunction).sort((a, b) => a - b);

    let quantileCount = Constants.NUM_QUANTILES;


    // FOR "NICE" SCALE
    // const quantileRange = Array.from(new Array(quantileCount), (value, index) => index);
    //
    // Get the top and bottom quantile values
    // const quantiles = d3.scaleQuantile().domain(domain).range(quantileRange).quantiles();
    // const lowQuantile = quantiles[0];
    // const highQuantile = quantiles[quantiles.length-1];
    // const ticks = d3.ticks(lowQuantile, highQuantile, quantileCount);

    // const numTicks = ticks.length + 1;

    // const scaleValues = Array.from(new Array(numTicks), (value, index) => index/numTicks);
    // const scaleColors = scaleValues.map((value) => d3.interpolatePlasma(value));

    // let colorScale = d3.scaleThreshold()
    //             .domain(ticks)
    //             .range(scaleColors);
    //
    // Add min and max to the quantiles list
    // const scaleQuantiles = [min, ...ticks, max];
    //
    // END "NICE" SCALE

    // FOR "QUANTILE" SCALE
    const scaleValues = Array.from(new Array(quantileCount), (value, index) => index/quantileCount);
    const scaleColors = scaleValues.map((value) => d3.interpolatePlasma(value));

    let colorScale = d3.scaleQuantile()
                .domain(domain)
                .range(scaleColors);

    // Add min and max to the quantiles list
    const scaleQuantiles = [min, ...colorScale.quantiles(), max];
    // END "QUANTILE" SCALE

    let dataDictionary = {};

    data.data.forEach(d => {
        d.color = colorScale(accessorFunction(d));
        dataDictionary[d.geography] = d;
    });

    return {
        minValue: min,
        maxValue: max,
        medianValue: median,
        scaleQuantiles: scaleQuantiles,
        scaleColors: scaleColors,
        dataKeyMapping: data.dataKeyMapping,
        dataSource: data.dataSource,
        dataDictionary: dataDictionary
    };
};

module.exports = Constants;