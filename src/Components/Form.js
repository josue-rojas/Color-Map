import React, { Component } from 'react';
import '../Styles/Form.css';
import Button from './Button';
import ColorDot from './Color-Dot';
import { Panel } from 'rc-color-picker';
// trigger is a package used in rc-color-picker
import Trigger from 'rc-trigger';
import 'rc-color-picker/assets/index.css';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default class Form extends Component {
  constructor(props){
    super(props);
    this.state = {
      location: false,
      panel: false,
      color: {
        color: `rgb(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)})` ,
        alpha: 100
      },
      hasError: null
    }
    this.panelFocus = React.createRef();
    this.toggleLocation = this.toggleLocation.bind(this);
    this.colorChooser = this.colorChooser.bind(this);
    this.randomColor = this.randomColor.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.formInput = this.formInput.bind(this);
  }

  toggleLocation(){
    this.setState({ location: !this.state.location });
  }

  colorChooser(color){
    this.setState({color: color});
  }

  randomColor(){
    this.setState({
      color: {
        color: `rgb(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)})` ,
        alpha: 100
      }
    });
  }

  submitForm(){
    const success = (position)=>{
      // keys might be the same on purpose this is to replace a point that is otherwise going to be directly on top of the other
      const latitude = Math.round(position.coords.latitude * 10000) / 10000;
      const longitude = Math.round(position.coords.longitude * 10000) / 10000;
      const key = `${latitude},${longitude}`.replace(/\./g, ',');
      this.props.geoFireRef.set(key, [latitude, longitude], {color: this.state.color.color});
      this.props.closeForm(false);
    }
    const error = (err)=>{
      if([1,2].includes(err.code)){
        console.log('cannot get location')
        this.setState({hasError: err});
        return
      }
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  formInput(hasError){
    const panel = (<Panel
      ref={this.panelFocus}
      className={this.state.panel ? 'open' : 'close'}
      enableAlpha={false}
      color={this.state.color.color}
      onBlur={()=>{this.setState({panel: false})}}
      onChange={this.colorChooser}/>);
    if (hasError) {
      return (
        <div className='error'>
          <a href='http://waziggle.com/BrowserAllow.aspx'>
            <span className='error-code'>ERROR {this.state.hasError.code}</span>: {this.state.hasError.message}
          </a>
          <Button
            onClick={this.props.closeForm}
            text='Cancel'
            color='rgb(198,0,0)'
            hoverColor='rgb(98,0,0)'/>
        </div>
      )
    }
    return (
      <div>
        <Trigger
          className="trigger"
          action={['click']}
          popup={panel}
          destroyPopupOnHide
          popupAlign={{
            points: ['tl', 'tl'],
            offset: [50, -100],
            overflow: { adjustX: false, adjustY: true },
          }}>
          <div className='input' style={{borderColor: this.state.color.color, color: this.state.color.color}}>
            <ColorDot color={this.state.color.color}/> Color Chooser
          </div>
        </Trigger>
        <Button
          onClick={this.randomColor}
          className='random'
          text='Random Color'
          color='#7b7b7b'
          hoverColor='rgb(93, 93, 93)'/>
        <div className='button-wrapper'>
          <Button
            onClick={this.submitForm}
            text='Submit'
            color='rgb(0,127,0)'
            hoverColor='rgb(0,80,0)'/>
          <Button
            onClick={this.props.closeForm}
            text='Cancel'
            color='rgb(198,0,0)'
            hoverColor='rgb(98,0,0)'/>
        </div>
      </div>
    );
  }

  render(){
    return (
      <div className={`Form-wrapper ${this.props.isActive ? 'active': ''}`}>
        {this.props.isActive ? (<div className='Form-Shade' onClick={()=>{this.props.closeForm(false)}}></div>) : ''}
        <div className='Form'>
          <div className='title'>New Point</div>
          <div className='input-wrapper'>
            {this.formInput(this.state.hasError)}
          </div>
        </div>
      </div>
    )
  }
}
