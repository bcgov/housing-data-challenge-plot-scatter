// React files
import React from 'react';
import ReactDOM from 'react-dom';

// App components
import Header from './components/header';
import MainDisplay from './components/main-display';

// fetch polyfill for e.g. Safari, see http://stackoverflow.com/a/35830329/715870
import 'whatwg-fetch';

require('./scss/app.scss');

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showDataSelector: true
        };

        this.toggleDataSelectorCallback = this.toggleDataSelectorCallback.bind(this);
    }

    toggleDataSelectorCallback() {
        this.setState((prevState) => ({
            showDataSelector: !prevState.showDataSelector
        }));
    }

    render() {

        return (
            <div>
                <Header toggleDataSelectorCallback={ this.toggleDataSelectorCallback } />
                <div className="container-fluid">
                    {/* <SideNav /> */}
                    <MainDisplay showDataSelector={ this.state.showDataSelector } />
                </div>
            </div>
        );
    }
}





ReactDOM.render(<App />, document.getElementById('root'));