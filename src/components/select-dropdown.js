import React from 'react';
import MetadataPopup from './metadata-popup';

class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        $(function () {
            $('[data-toggle="popover"]').popover({ container: 'body' });
        });
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

        let metadata;
        if (this.props.metadataAccessor) {
            let metadataSource = this.props.options.filter(variable => this.props.valueAccessor(variable) === this.select.value);
            if (metadataSource.length) {
                metadata = this.props.metadataAccessor(metadataSource[0]);
            }
        }

        return (
            <div className={'select-wrapper' + (this.props.classNames ? ' ' + this.props.classNames : '')} aria-label={ 'Dropdown' }>
                <select
                    ref={(select) => this.select = select}
                    className="form-control"
                    tabIndex="0"
                    aria-label="Data selector"
                    onChange={this.props.onChangeCallback} >
                    {variableOptions}
                </select>
                <label className="select-arrow">▼</label>
                { metadata &&
                    <MetadataPopup
                        description={metadata.description}
                        sourceUrl={metadata.sourceUrl}
                        sourceText={metadata.sourceText} />
                }
            </div>
        );
    }
}

SelectDropdown.propTypes = {
    onChangeCallback: React.PropTypes.func,
    options: React.PropTypes.array.isRequired,
    nameAccessor: React.PropTypes.func.isRequired,
    valueAccessor: React.PropTypes.func.isRequired,
    metadataAccessor: React.PropTypes.func,
    truncate: React.PropTypes.bool,
    classNames: React.PropTypes.string,
    selectedValue: React.PropTypes.object
};

module.exports = SelectDropdown;