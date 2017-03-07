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

        const variable1Name = (this.state.variable1 === null)
            ? '' : `${this.state.variable1.dataSource.name}': ${this.state.variable1.variableName}`;

        const variable2Name = (this.state.variable2 === null)
            ? '' : `${this.state.variable2.dataSource.name}': ${this.state.variable2.variableName}`;

        return (
            <div>
                <h3>Map colouring</h3>
                <p>You can choose a variable to use to colour the map. The variable can be a single variable, or a constructed variable built out of two variables, one divided by the other.</p>

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

                <div className="row margin-top">
                    {/*<div className="col-md-5">
                        <p>{ variable1Name }</p>
                    </div>
                    <div className="col-md-2">
                        <p>{ this.state.operator }</p>
                    </div>
                    <div className="col-md-5">
                        <p>{ variable2Name }</p>
                    </div>*/}
                    <div className="col-md-12">
                        <p>{ variable1Name } { this.state.operator } { variable2Name }</p>
                    </div>
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