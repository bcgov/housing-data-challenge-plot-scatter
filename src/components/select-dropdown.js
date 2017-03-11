import React from 'react';
import MetadataPopup from './metadata-popup';

/*

SelectDropdown component
========================

A component wrapping a <select>, styling it in a browser-agnostic way. Requires
an array of `options`, each of which must have a `name` and `value` retrievable
via the functions passed in as `nameAccessor` and `valueAccessor`, respectively.
(In other words, each object in the array need not have a literal `name` and
`value` key; instead, the `nameAccessor` and `valueAccessor` functions will
be called on each object to retrieve the appropriate value.)

Optionally, also display a `MetadataPopup` component alongside the select box,
offering information on the dataset used to populate the box.

*/
class SelectDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        // Activate any popovers in the app. TODO: this shouldn't really be
        // in this component... maybe in its parent?
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
                // If truncate is set, truncate the contents after 40 chars
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