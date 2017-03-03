import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <header className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 col-sm-10">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                </div>
                                <div className="col-md-5">
                                    <a className="navbar-brand" href="http://plotandscatter.com">Plot + Scatter</a>
                                </div>
                                <div>
                                    <span className="navbar-brand title"><i className="fa fa-home"></i> Housing Data Explorer</span>
                                </div>
                            </div>
                        <div className="col-sm-3"></div>
                    </div>
                </div>
            </header>
        );
    }
}

module.exports = Header;