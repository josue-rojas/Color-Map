import React, { Component } from 'react';
import '../Styles/Color-Dot.css'

export default class ColorDot extends Component {
  render(){
    const style = {
      backgroundColor: this.props.color
    }
    return (
      <div className='Color-Dot' style={style}>
      </div>
    )
  }
}
