import React from 'react';
import DataSelector from './data-selector';
import MapViz from './map-viz';
import SupplementalGraph from './supplemental-graph';

class MainDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boundaryData: {
                dataSource: {},
                dataDictionary: {},
                scaleQuantiles: [],
                scaleColors: []
            },
            layerData: {},
            minValue: null,
            maxValue: null,
            medianValue: null
        };

        this.changeBoundaryData = this.changeBoundaryData.bind(this);
        this.addLayerData = this.addLayerData.bind(this);
        this.removeLayerData = this.removeLayerData.bind(this);
    }

    changeBoundaryData(data) {
        this.setState({ boundaryData: data });
    }

    addLayerData(dataSource, data) {
        this.setState((prevState) => {
            const updatedLayerData = Object.assign({}, prevState.layerData);
            updatedLayerData[dataSource.file] = { dataSource, data };
            return {
                layerData: updatedLayerData
            };
        });
    }

    removeLayerData(dataSource) {
        this.setState((prevState) => {
            const updatedLayerData = Object.assign({}, prevState.layerData);
            delete(updatedLayerData[dataSource.file]);
            return {
                layerData: updatedLayerData
            };
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <DataSelector
                        changeBoundaryData={this.changeBoundaryData}
                        addLayerData={this.addLayerData}
                        removeLayerData={this.removeLayerData} />
                </div>
                <div className="col-md-6">
                    <MapViz
                        ref={(mapViz) => this.mapViz = mapViz}
                        boundaryData={this.state.boundaryData}
                        layerData={this.state.layerData} />
                </div>
                <div className="col-md-6">
                    <SupplementalGraph
                        data={this.state.boundaryData} />
                </div>
            </div>
        );
    }
}

module.exports = MainDisplay;