import React from 'react';

class DataGrouping extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2><i className="fa fa-object-group"></i> Data grouping level</h2>
                <p className="select-wrapper">
                    <select className="form-control">
                        <option value="">Census Area</option>
                    </select>
                    <label className="select-arrow">▼</label>
                </p>
            </div>
        );
    }
}

module.exports = DataGrouping;