import React from 'react';
import Tab from './tab';

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
        const tabButtons = this.props.children.map((child, index) => {
            const isActiveClass = (index === this.state.activeTabIndex) ? ' active': '';
            return (
                <div key={ child.props.name } className={ 'tab-button' + isActiveClass} aria-label={ 'Map Selector Tab' }>
                    <a onClick={ () => this.tabClick(index) } role={ 'button' } tabIndex={ '0' }>
                        { child.props.icon && <i className={  'fa '  + child.props.icon + ' fa-lg'}></i> }
                        <span className={ this.props.hideTextWhenSmall && 'hidden-xs'}>
                            { child.props.name }
                        </span>
                    </a>
                </div>
            );
        });

        const tabs = this.props.children.map((child, index) => {
            const showTab = (index === this.state.activeTabIndex) ? '' : 'none';
            return (
                <div key={ index } className="row" style={{ display: showTab }}>
                    { child }
                </div>
            );
        });

        return (
            <div className="tab-interface">
                <div className="row">
                    <div className="col-xs-12">
                        { tabButtons }
                    </div>
                </div>
                { tabs }
            </div>
        );
    }
}

TabInterface.propTypes = {
    hideTextWhenSmall: React.PropTypes.bool,
    children: function (props, propName, componentName) {
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