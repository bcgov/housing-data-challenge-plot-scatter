import React from 'react';

/*

Tab component
=============

A functional component that simply wraps its child elements. Meant to be used as
a child of a `TabInterface` component.

Note that the `name` and `icon` props are not used by this component itself;
they are rather used by `TabInterface` for displaying this tab's name and, if
supplied, icon.

*/
function Tab(props) {
    return (
        <div className="col-xs-12">
            {props.children}
        </div>
    );
}

Tab.propTypes = {
    name: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    icon: React.PropTypes.string
};

module.exports = Tab;