import React, { Component } from 'react';
import '../Styles/Button.css';

export default class Button extends Component {
  constructor(props){
    super(props);
    this.state = {
      border: `2px solid ${this.props.color}`,
      color: this.props.color
    }
    this.hover = this.hover.bind(this);
  }

  hover(isHover){
    if(isHover){
      this.setState({
        border: `2px solid ${this.props.hoverColor}`,
        color: this.props.hoverColor
      });
      return
    }
    this.setState({
      border: `2px solid ${this.props.color}`,
      color: this.props.color
    });
  }

  render(){

    return(
      <div
      className={`Button ${this.props.className}`}
      onMouseEnter={()=>this.hover(true)}
      onMouseLeave={()=>this.hover(false)}
      style={this.state}
      onClick={this.props.onClick}>
        {this.props.text}
      </div>
    );
  }
}
