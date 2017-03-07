import React from 'react';

class Tab extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="col-xs-12">
                {this.props.children}
            </div>
        );
    }
}

Tab.propTypes = {
    name: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired
};

module.exports = Tab;