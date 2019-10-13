import React, { Component } from 'react';
import State from '../interfaces/State';
import { connect } from 'react-redux';

import { setNight } from '../redux/actions';

interface StateProps {
  night: number
}

interface DispatchProps {
  setNight: typeof setNight
}

type MyProps = DispatchProps & StateProps;

class Filters extends Component<MyProps> {

  render(): React.ReactNode {
    return (
      <filter id="nightFilter" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="linearRGB">
        <feColorMatrix type="matrix"
                       values="
                        0.5 0 0   0 0
                        0   1 0   0 0
                        0   0 1.7 0 0
                        0   0 0   1 0 "
                       in="SourceGraphic"
                       result="colormatrix"/>
        <feColorMatrix type="saturate"
                       values="0.5"
                       in="colormatrix"
                       result="colormatrix1"/>

        <feComponentTransfer in="colormatrix1" result="componentTransfer">
          <feFuncR type="linear" slope="1.5" intercept="-0.1"/>
          <feFuncG type="linear" slope="1.5" intercept="-0.1"/>
          <feFuncB type="linear" slope="1.5" intercept="-0.1"/>
        </feComponentTransfer>
        <feComponentTransfer in="componentTransfer" result="componentTransfer2">
          <feFuncR type="linear" slope="0.2"/>
          <feFuncG type="linear" slope="0.2"/>
          <feFuncB type="linear" slope="0.2"/>
        </feComponentTransfer>
        <feComposite in="SourceGraphic" in2="componentTransfer2" operator="arithmetic"
                     k1="0"
                     k2={1 - this.props.night}
                     k3={this.props.night}
                     k4="0"
                     result="composite4"/>
      </filter>
    )
  }

}

function mapStateToProps(state: State): StateProps {
  return {
    night: state.night
  }
}

export default connect(
  mapStateToProps,
  { setNight }
)(Filters)