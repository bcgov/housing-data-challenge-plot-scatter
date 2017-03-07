import React from 'react';
import TabInterface from './tab-interface';
import Tab from './tab';
import MapGraphDisplay from './map-graph-display';

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
            <TabInterface>
                <Tab name="Housing index" icon="fa-home">
                    <MapGraphDisplay type="housing-index" />
                </Tab>
                <Tab name="Map other data" icon="fa-map">
                    <MapGraphDisplay type="variables" />
                </Tab>
            </TabInterface>
        );
    }
}

module.exports = MainDisplay;