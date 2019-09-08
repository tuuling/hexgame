import React, { Component } from 'react';
import { connect } from 'react-redux';

import State from '../interfaces/State';

import RhombusCord from '../models/RhombusCord';
import Character from './Character';
import MapObject from './MapObject';


interface StateProps {
  lookup: State['render']['lookup'],
  objectOrder: State['render']['objectOrder'],
  charLoc: string
}

class Objects extends Component<StateProps> {
  orderLookup: number[] = [];
  renderCharAfter: number | null = null;


  componentDidMount(): void {
    this.orderLookup = this.props.objectOrder.map((item) => {
      return this.props.lookup[item];
    });
  }

  shouldComponentUpdate(nextProps: StateProps) {
    if (nextProps.objectOrder !== this.props.objectOrder) {
      this.orderLookup = nextProps.objectOrder.map((item) => {
        return nextProps.lookup[item];
      });
    }

    if(this.props.lookup !== nextProps.lookup || this.props.objectOrder !== nextProps.objectOrder)
      return true;

    if(this.props.charLoc === nextProps.charLoc)
      return false;

    const charLookupIndex = nextProps.lookup[nextProps.charLoc];
    let renderCharAfter: number | null;


    if (charLookupIndex === undefined || charLookupIndex < this.orderLookup[0]) {
      renderCharAfter = null;
    } else if (charLookupIndex >= this.orderLookup[this.orderLookup.length-1]) {
      renderCharAfter = this.orderLookup.length-1;
    } else {
      renderCharAfter = this.orderLookup.findIndex((item, index, obj) => {
        return (item <= charLookupIndex) && obj[index+1] > charLookupIndex;
      })
    }

    if(renderCharAfter !== this.renderCharAfter) {
      this.renderCharAfter = renderCharAfter;
      return true
    } else {
      return false;
    }

  }

  render(): React.ReactNode {
    return (
      <>
        {this.props.objectOrder.reduce((result: JSX.Element[], key, index) => {
          if(this.renderCharAfter === null && index === 0)
            result.push(<Character key={'character'}/>);

          result.push(<MapObject key={key} tileId={key}/>);

          if(this.renderCharAfter !== null && index === this.renderCharAfter)
            result.push(<Character key={'character'}/>);

          return result;
        }, [])}
      </>
    );
  }
}

function mapStateToProps(state: State): StateProps {
  const charLoc = state.character.location;
  const charIso = RhombusCord.pixelToIso(charLoc.x, charLoc.y);

  return {
    lookup: state.render.lookup,
    objectOrder: state.render.objectOrder,
    charLoc: `${charIso.isoX}x${charIso.isoY}`
  };
}

export default connect(
  mapStateToProps
)(Objects)
