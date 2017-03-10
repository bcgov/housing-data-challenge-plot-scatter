import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3 col-sm-3 hidden-xs brand">
                            <a href="http://plotandscatter.com">Plot + Scatter</a>
                        </div>
                        <div className="col-xs-2 visible-xs-block brand">
                            <a href="http://plotandscatter.com">P+S</a>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-8 title">
                            <i className="fa fa-home"></i> Housing Data Explorer
                        </div>
                        
                    </div>
                </div>
            </header>
        );
    }
}

module.exports = Header;