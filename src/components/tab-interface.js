import React from 'react';
import Tab from './tab';

/*

TabInterface component
======================

A component that allows a user to select a tab. Any number of `Tab` components
can be listed as direct children of the `TabInterface` component. A `Tab` can
contain arbitrary child elements.

By default, the first `Tab` child is visible, and others are set to have a style
of `display: 'none'`. In other words, all components that are children of `Tab`s
are loaded on the page; they are just not visible by default. This enables them
to mount and load in the background.

If the `hideTextWhenSmall` prop is supplied and `true`, at extra-small screen
sizes (as defined by Bootstrap breakpoints) the tabs will have no text; they
will only show their icon.

*/
class TabInterface extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0
        };
    }

    tabClick(index) {
        this.setState({ activeTabIndex: index });
    }

    componentDidUpdate() {
        // Fire a global event for any components that need to
        // know when they are visible (e.g. MapViz)
        window.dispatchEvent(new Event('shown'));
    }

    render() {
        // Build the tab buttons at the top of the interface
        const tabButtons = this.props.children.map((child, index) => {
            const isActiveClass = (index === this.state.activeTabIndex) ? ' active': '';
            return (
                <div key={child.props.name} className={'tab-button' + isActiveClass} aria-label={'Map Selector Tab'}>
                    <a onClick={() => this.tabClick(index)} role={'button'} tabIndex={'0'}>
                        {child.props.icon && <i className={'fa fa-lg ' + child.props.icon}></i>}
                        <span className={this.props.hideTextWhenSmall && 'hidden-xs'}>
                            {child.props.name}
                        </span>
                    </a>
                </div>
            );
        });

        // The actual tabs
        const tabs = this.props.children.map((child, index) => {
            const showTab = (index === this.state.activeTabIndex) ? '' : 'none';
            return (
                <div key={index} className="row" style={{display: showTab}}>
                    {child}
                </div>
            );
        });

        return (
            <div className="tab-interface">
                <div className="row">
                    <div className="col-xs-12">
                        {tabButtons}
                    </div>
                </div>
                {tabs}
            </div>
        );
    }
}

TabInterface.propTypes = {
    hideTextWhenSmall: React.PropTypes.bool,
    children: function (props, propName, componentName) {
        // Validate that children are Tab components
        const prop = props[propName];
        let error = null;
        React.Children.forEach(prop, function (child) {
            if (child.type !== Tab) {
                error = new Error(`\`${componentName}\` children should be of type \`Tab\`.`);
            }
        });
        return error;
    }
};

module.exports = TabInterface;