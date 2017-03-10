import React from 'react';
import DataBoundarySelect from './data-boundary-select';
import Constants from '../constants';

class DataBoundaries extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDataSource: null,
            variables: [],
            variable1: null,
            variable2: null,
            operator: Constants.DIVISION
        };

        this.handleDataAdded = this.handleDataAdded.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.variable1 !== this.state.variable1 || prevState.variable2 !== this.state.variable2) {
            this.buildConstructedVariable();
        }
    }

    buildConstructedVariable() {

        const variable1 = this.state.variable1;
        const variable1Name = variable1.dataSource['column-name-map'][variable1.variableName];
        const variable2 = this.state.variable2;
        const variable2Name = variable2.dataSource['column-name-map'][variable2.variableName];

        if (variable1 === null) { return; }

        // Deep copy the data array
        const constructedData = Array.from(variable1.data, (item) =>
            ({ [variable1Name]: item.value, value: item.value, geography: item.geography })
        );

        // Only apply transformation if variable2 exists
        if (variable2 !== null) {
            constructedData.forEach((item, index) => {
                item[variable2Name] = variable2.data[index].value;
                item.value = item.value / variable2.data[index].value;
            });
        }

        const constructedVariable = {
            dataSource: variable1.dataSource,
            data: constructedData,
            dataKeyMapping: {
                [variable1Name]: variable1Name,
                [variable2Name]: variable2Name,
                value: variable1Name + (variable2Name ? ' ÷ ' + variable2Name : '')
            }
        };

        this.props.dataUpdateCallback(constructedVariable);
    }

    handleDataAdded(data) {
        this.setState(() => ({
            ['variable' + data.variableOrder]: data
        }));
    }

    render() {
        return (
            <div className="margin-bottom">
                <h5>Choose a single variable to map. Or select two variables to construct a new one (mapped variable = variable 1 / variable 2).</h5><p> Then hover over the map or search for a specific location on the map to see results at the municipal level. You can also select and add additional layers to the map to visualize more data.</p>

                <div className="row">

                    <DataBoundarySelect
                        variableOrder={1}
                        dataSources={this.props.dataSources}
                        dataAddedCallback={this.handleDataAdded} />

                    <DataBoundarySelect
                        variableOrder={2}
                        includeIdentity={true}
                        dataSources={this.props.dataSources}
                        dataAddedCallback={this.handleDataAdded} />

                </div>
            </div>
        );
    }
}

DataBoundaries.propTypes = {
    dataSources: React.PropTypes.object.isRequired,
    dataUpdateCallback: React.PropTypes.func.isRequired
};

module.exports = DataBoundaries;