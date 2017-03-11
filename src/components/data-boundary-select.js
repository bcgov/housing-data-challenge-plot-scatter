import React from 'react';
import SelectDropdown from './select-dropdown';
import Constants from '../constants';

/*

DataBoundarySelect component
============================

A component wrapping two `SelectDropdown`s, one allowing the user to select a
data source, the other allowing the user to select a variable (column) in the
currently-selected data source. Includes code to dynamically load the data
source and its variable values.

*/
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

            // Get list of column names from first item
            var columnNames = Object.keys(data[0]);
            const columnNameMap = dataSource['column-name-map'];

            // Now use the dataSource map to retain variables and rename them as appropriate
            var variables = [];
            columnNames.forEach((item) => {
                if (columnNameMap[item]) {
                    variables.push({ columnName: item, displayName: columnNameMap[item] });
                }
            });

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
            // If the column name isn't found, just return 1 as a value
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

        let variableArray = this.state.variables;
        variableArray.sort((a, b) => {
            // Sort alphabetically; from http://stackoverflow.com/a/8900824
            var textA = a.displayName.toUpperCase();
            var textB = b.displayName.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        if (this.props.includeIdentity) {
            variableArray = [{ columnName: '1', displayName: '1' }, ...variableArray];
        }

        const ordinalNumber = this.props.variableOrder === 1 ? 'First' : 'Second';

        return (
            <div className="col-md-6 col-sm-6">
                <h3>{ordinalNumber} variable</h3>
                <h4>Data source</h4>
                <SelectDropdown
                    options={dataSourceArray}
                    nameAccessor={(dataSource) => dataSource.name}
                    valueAccessor={(dataSource) => dataSource.file}
                    metadataAccessor={(dataSource) => ({
                        description: dataSource.description,
                        sourceUrl: dataSource['source-url'],
                        sourceText: dataSource.source
                    })}
                    onChangeCallback={this.handleDataSourceChange}
                    truncate={true} />

                <h4>Select a variable</h4>
                <SelectDropdown
                    ref={(variableSelect) => { this.variableSelect = variableSelect; }}
                    options={variableArray}
                    nameAccessor={(variable) => variable.displayName}
                    valueAccessor={(variable) => variable.columnName}
                    onChangeCallback={this.handleVariableChange}
                    truncate={true} />
            </div>
        );
    }
}

DataBoundarySelect.propTypes = {
    includeIdentity: React.PropTypes.bool,
    variableOrder: React.PropTypes.number.isRequired,
    dataSources: React.PropTypes.object.isRequired,
    dataAddedCallback: React.PropTypes.func.isRequired
};

module.exports = DataBoundarySelect;