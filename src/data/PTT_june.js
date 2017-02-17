var DATA_PTT_JUNE = [
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "FRASER VALLEY",
        "Municipality": "Abbotsford",
        "md_PPT": 7220.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "FRASER VALLEY",
        "Municipality": "Chilliwack",
        "md_PPT": 5000.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "FRASER VALLEY",
        "Municipality": "Rest of Fraser Valley",
        "md_PPT": 6200.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "METRO VANCOUVER",
        "Municipality": "Burnaby",
        "md_PPT": 9730.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "METRO VANCOUVER",
        "Municipality": "Rest of Metro Vancouver",
        "md_PPT": 10928.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "METRO VANCOUVER",
        "Municipality": "Richmond",
        "md_PPT": 11300.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "METRO VANCOUVER",
        "Municipality": "Surrey",
        "md_PPT": 10740.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "METRO VANCOUVER",
        "Municipality": "Vancouver",
        "md_PPT": 13033.01
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "METRO VANCOUVER",
        "Municipality": "Vancouver",
        "md_PPT": 11830.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "SQUAMISH-LILLOOET",
        "Municipality": "Rest of Squamish-Lillooet",
        "md_PPT": 6998.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Mainland\/Southwest",
        "RegionalDistrict": "SQUAMISH-LILLOOET",
        "Municipality": "Whistler",
        "md_PPT": 11395.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Thompson\/Okanagan",
        "RegionalDistrict": "CENTRAL OKANAGAN",
        "Municipality": "Kelowna",
        "md_PPT": 6600.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Thompson\/Okanagan",
        "RegionalDistrict": "CENTRAL OKANAGAN",
        "Municipality": "Rest of Central Okanagan",
        "md_PPT": 6770.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Vancouver Island\/Coast",
        "RegionalDistrict": "CAPITAL",
        "Municipality": "Peninsula & Westshore",
        "md_PPT": 6600.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Vancouver Island\/Coast",
        "RegionalDistrict": "CAPITAL",
        "Municipality": "Victoria, Esquimalt, Oak Bay, Saanich & View Royal",
        "md_PPT": 7798.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Vancouver Island\/Coast",
        "RegionalDistrict": "NANAIMO",
        "Municipality": "Nanaimo",
        "md_PPT": 4060.0
    },
    {
        "trans_period": "2016-06-01",
        "DevelopmentRegion": "Vancouver Island\/Coast",
        "RegionalDistrict": "NANAIMO",
        "Municipality": "Rest of Nanaimo RD",
        "md_PPT": 5300.0
    }
];

// Yes, this is dumb! But works for illustrative purposes.
function quantilizeData(data, accessorFunction, numQuantiles=4) {

    var quantiles = {};

    var valueArray = data.map(accessorFunction);

    valueArray = valueArray.sort((a, b) => {
        return a - b;
    });
    
    const numItemsPerQuantile = Math.round(valueArray.length / numQuantiles);

    for (var i = 0; i < numQuantiles; i++) {
        
        var sliceStart = i*numItemsPerQuantile;
        var sliceEnd = (i < (numQuantiles-1)) ? (i+1)*numItemsPerQuantile : valueArray.length;

        quantiles[i+1] = valueArray.slice(sliceStart, sliceEnd);
    }

    return quantiles;
}

function categorizeDataByMedianTransferTaxQuartile(data) {
    
    var accessorFunction = (item) => { return item.md_PPT };

    var quartiles = quantilizeData(DATA_PTT_JUNE, accessorFunction, 4);

    console.log('quartiles', quartiles);

    for (var item of data) {
        item.quartile = getQuantileForValue(quartiles, +item.md_PPT);
    }

    return data;
}

function getQuantileForValue(quantileMap, value) {
    for (var key in quantileMap) {
        if (quantileMap[key].indexOf(value) > -1) { return key; };
    };
    return null;
};

DATA_PTT_JUNE = categorizeDataByMedianTransferTaxQuartile(DATA_PTT_JUNE);

module.exports = DATA_PTT_JUNE;