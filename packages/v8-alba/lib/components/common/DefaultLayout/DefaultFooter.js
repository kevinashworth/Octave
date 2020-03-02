import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span><a href='//v8.the-4th-wall.com/'>V8</a> &copy; 2018-2020 SuperSecretSite, LLC</span>
        <span className='ml-auto'>Powered by <a href='//the-4th-wall.com/'>The 4th Wall</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
