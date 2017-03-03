import React from 'react';
import DataSelect from './data-select';
import Constants from '../constants';

class DataBoundarySelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDataSource: null,
            variables: []
        };

        this.handleDataSourceChange = this.handleDataSourceChange.bind(this);
        this.handleVariableChange = this.handleVariableChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // When data source changes, we need to update
        if (this.props.dataSources !== nextProps.dataSources) {
            const sources = nextProps.dataSources;
            if (Object.keys(sources).length) {
                const firstSource = sources[Object.keys(sources)[0]];
                this.loadData(firstSource);
            }
        }
    }

    loadData(dataSource) {
        const filePath = Constants.DATA_DIRECTORY + dataSource.dataType + '/' + dataSource.file;

        d3.csv(filePath, function (error, data) {

            this.data = data;

            // Get list of variable names from first item
            var variables = Object.keys(data[0]);

            this.setState({
                currentDataSource: dataSource,
                variables: variables,
            }, () => this.handleVariableChange());
        }.bind(this));
    }

    handleDataSourceChange(event) {
        const dataSourceKey = event.target.value;
        const currentDataSource = this.props.dataSources[dataSourceKey];
        this.loadData(currentDataSource);
    }

    handleVariableChange(event) {
        let dataSource = this.state.currentDataSource;
        let columnName = this.variableSelect.getValue();

        var values = this.data.map((item) => {
            return {
                geography: item[dataSource.geographyKey],
                value: item[columnName] || 1
            };
        });

        let variable = {
            dataSource: dataSource,
            variableName: columnName,
            variableOrder: this.props.variableOrder,
            data: values
        };

        this.props.dataAddedCallback(variable);
    }

    render() {

        const dataSources = this.props.dataSources;
        const dataSourceArray = Object.keys(dataSources).map((key) => dataSources[key]);

        const variableArray = [...this.state.variables, '1 [Identity]'];

        const ordinalNumber = this.props.variableOrder === 1 ? 'First' : 'Second';

        return (
            <div className="col-md-6">
                <h3>{ordinalNumber} variable</h3>
                <h4>Data source</h4>
                <DataSelect
                    options={dataSourceArray}
                    nameAccessor={(dataSource) => dataSource.name}
                    valueAccessor={(dataSource) => dataSource.file}
                    onChangeCallback={this.handleDataSourceChange}
                    truncate={true} />

                <h4>Select a variable</h4>
                <DataSelect
                    ref={(variableSelect) => { this.variableSelect = variableSelect; }}
                    options={variableArray.sort()}
                    nameAccessor={(variable) => variable}
                    valueAccessor={(variable) => variable}
                    onChangeCallback={this.handleVariableChange}
                    truncate={true} />

                {/*<button
                    className="btn btn-default"
                    onClick={this.handleVariableChange} >
                    <i className="fa fa-plus"></i>Add variable
                </button>*/}
            </div>
        );
    }
}

DataBoundarySelect.propTypes = {
    variableOrder: React.PropTypes.number.isRequired,
    dataSources: React.PropTypes.object.isRequired,
    dataAddedCallback: React.PropTypes.func.isRequired
};

module.exports = DataBoundarySelect;