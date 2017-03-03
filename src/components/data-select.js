import React from 'react';

class DataSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    getValue() {
        return this.select.value;
    }

    render() {
        let variableOptions;
        if (this.props.options) {
            variableOptions = this.props.options.map(variable => {
                const value = this.props.valueAccessor(variable);
                let name = this.props.nameAccessor(variable);
                name = (this.props.truncate && name.length > 40) ? (name.substring(0, 40) + '...') : name;
                return (<option key={value} value={value}>{name}</option>);
            });
        } else {
            variableOptions = <option value="">Loading variables...</option>;
        }

        return (
            <p className={'select-wrapper' + (this.props.classNames ? ' ' + this.props.classNames : '')}>
                <select
                    ref={(select) => this.select = select}
                    className="form-control"
                    onChange={this.props.onChangeCallback} >
                    {variableOptions}
                </select>
                <label className="select-arrow">▼</label>
                <i className="fa  fa-2x fa-info-circle button-green"></i>
            </p>
        );
    }
}

DataSelect.propTypes = {
    onChangeCallback: React.PropTypes.func,
    options: React.PropTypes.array.isRequired,
    nameAccessor: React.PropTypes.func.isRequired,
    valueAccessor: React.PropTypes.func.isRequired,
    truncate: React.PropTypes.bool,
    classNames: React.PropTypes.string,
    selectedValue: React.PropTypes.object
};

module.exports = DataSelect;