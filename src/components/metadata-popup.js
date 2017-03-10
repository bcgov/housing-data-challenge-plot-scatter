import React from 'react';

function MetadataPopup(props) {
    return(
        <a tabIndex="0"
            aria-label="Info"
            aria-expanded="true"
            role="button"
            data-toggle="popover"
            title="Dataset info"
            data-trigger="focus"
            data-html="true"
            data-placement={props.direction}
            data-content={`
                <strong tabIndex="0">Data description</strong>
                <p>${props.description}</p>
                <strong>Data source</strong>
                <p><a href="${props.sourceUrl}" target="_blank">
                    ${props.sourceText}
                    <i className="fa fa-external-link"></i>
                </a></p>`} >
            <i className="fa fa-lg fa-info-circle"></i>
        </a>
    );
}

MetadataPopup.propTypes = {
    description: React.PropTypes.string.isRequired,
    sourceUrl: React.PropTypes.string.isRequired,
    sourceText: React.PropTypes.string.isRequired,
    direction: React.PropTypes.string
};

MetadataPopup.defaultProps= {
    direction: 'right'
};

module.exports = MetadataPopup;