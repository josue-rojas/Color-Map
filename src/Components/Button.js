import React, { Component } from 'react';
import '../Styles/Button.css';

export default class Button extends Component {
  constructor(props){
    super(props);
    this.state = {
      borderColor: this.props.color,
      color: this.props.color
    }
    this.hover = this.hover.bind(this);
  }

  hover(isHover){
    if(isHover){
      this.setState({
        borderColor: this.props.hoverColor,
        color: this.props.hoverColor
      });
      return
    }
    this.setState({
      borderColor: this.props.color,
      color: this.props.color
    });
  }

  render(){

    return(
      <div
      className={`Button ${this.props.className || ''}`}
      onMouseEnter={()=>this.hover(true)}
      onMouseLeave={()=>this.hover(false)}
      style={this.state}
      onClick={this.props.onClick}>
        {this.props.text}
      </div>
    );
  }
}
