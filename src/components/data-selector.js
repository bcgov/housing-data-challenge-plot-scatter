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

    handleBoundaryDataUpdate(data) {
        const boundaryData = Constants.processBoundaryData(data);
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
                    <h2><i className="fa fa-map-o"></i>Select variables</h2>
                </div>
                <div className="col-md-10 col-lg-8">
                    <DataBoundaries
                        dataSources={this.state.boundaryDataSources}
                        dataUpdateCallback={this.handleBoundaryDataUpdate} />
                </div>
                <div className="col-md-6 col-lg-4">
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