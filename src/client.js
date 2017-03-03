// React files
import React from 'react';
import ReactDOM from 'react-dom';

// App components
import Header from './components/header';
import MainDisplay from './components/main-display';

// fetch polyfill for e.g. Safari, see http://stackoverflow.com/a/35830329/715870
import 'whatwg-fetch';

// Application CSS
require('bootstrap/dist/css/bootstrap.css');
require('./scss/app.scss');

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Header />
                <div className="container-fluid">
                    {/* <SideNav /> */}
                    <MainDisplay />
                </div>
            </div>
        );
    }
}





ReactDOM.render(<App />, document.getElementById('root'));