import React from 'react';
// import DataSelect from './data-select';
import DataBoundaries from './data-boundaries';
import DataLayers from './data-layers';
// import DataFilters from './data-filters';
// import DataGrouping from './data-grouping';
// import DataSummary from './data-summary';
import Constants from '../constants';

class DataSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            boundaryDataSources: {},
            layerDataSources: {}
        };

        this.handleBoundaryDataUpdate = this.handleBoundaryDataUpdate.bind(this);
        this.addDataLayer = this.addDataLayer.bind(this);
        this.removeDataLayer = this.removeDataLayer.bind(this);

        this.loadDataSources();
    }

    loadDataSources() {
        d3.json(Constants.DATA_SOURCE_FILE, function (error, data) {

            const dataSources = data;
            const boundaryDataSources = {};
            const layerDataSources = {};

            for (const dataSourceKey in dataSources) {
                const dataSource = dataSources[dataSourceKey];
                if (dataSource.dataType === Constants.BOUNDARY_DATA_TYPE) {
                    boundaryDataSources[dataSourceKey] = dataSource;
                } else {
                    dataSource.active = false;
                    layerDataSources[dataSourceKey] = dataSource;
                }
            }

            this.setState({
                boundaryDataSources: boundaryDataSources,
                layerDataSources: layerDataSources
            });

        }.bind(this));
    }

    processBoundaryData(data) {

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

        const quantileRange = Array.from(new Array(quantileCount), (value, index) => index);

        // Get the top and bottom quantile values
        const quantiles = d3.scaleQuantile().domain(domain).range(quantileRange).quantiles();
        const lowQuantile = quantiles[0];
        const highQuantile = quantiles[quantiles.length-1];
        const ticks = d3.ticks(lowQuantile, highQuantile, quantileCount);

        const numTicks = ticks.length + 1;

        const scaleValues = Array.from(new Array(numTicks), (value, index) => index/numTicks);
        const scaleColors = scaleValues.map((value) => d3.interpolatePlasma(value));

        let colorScale = d3.scaleThreshold()
                .domain(ticks)
                .range(scaleColors);

        // Add min and max to the quantiles list
        // const scaleQuantiles = [min, ...colorScale.quantiles(), max];
        const scaleQuantiles = [min, ...ticks, max];
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
            dataSource: data.dataSource,
            dataDictionary: dataDictionary
        };
    }

    handleBoundaryDataUpdate(data) {
        const boundaryData = this.processBoundaryData(data);
        this.props.changeBoundaryData(boundaryData);
    }

    addDataLayer(dataSource, data) {
        dataSource.active = true;
        this.updateDataLayer(dataSource);
        this.props.addLayerData(dataSource, data);
    }

    removeDataLayer(dataSource) {
        dataSource.active = false;
        this.updateDataLayer(dataSource, false);
        this.props.removeLayerData(dataSource);
    }

    updateDataLayer(dataSource) {
        this.setState((prevState) => {
            var updatedLayerDataSources = Object.assign({}, prevState.layerDataSources);
            updatedLayerDataSources[dataSource.file] = dataSource;
            return updatedLayerDataSources;
        });
    }

    render() {

        return (
            <div className="row" id="data-selector">
                <div className="col-md-12">
                    <h2><i className="fa fa-map-o"></i> Variables to map</h2>
                </div>
                <div className="col-md-8">
                    <DataBoundaries
                        dataSources={this.state.boundaryDataSources}
                        dataUpdateCallback={this.handleBoundaryDataUpdate} />
                </div>
                <div className="col-md-4">
                    <DataLayers
                        dataSources={this.state.layerDataSources}
                        addDataLayer={this.addDataLayer}
                        removeDataLayer={this.removeDataLayer} />
                </div>
            </div>
        );
    }
}

DataSelector.propTypes = {
    changeBoundaryData: React.PropTypes.func.isRequired,
    addLayerData: React.PropTypes.func.isRequired,
    removeLayerData: React.PropTypes.func.isRequired
};

module.exports = DataSelector;