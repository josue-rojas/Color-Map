import React, { Component } from 'react';
import '../Styles/Form.css';
import Button from './Button';
import ColorDot from './Color-Dot';
import { Panel } from 'rc-color-picker';
// trigger is a package used in rc-color-picker
import Trigger from 'rc-trigger';
import 'rc-color-picker/assets/index.css';


export default class Form extends Component {
  constructor(props){
    super(props);
    this.state = {
      location: false,
      panel: false,
      color: {color: "#cf0bff", alpha: 100},
    }
    this.panelFocus = React.createRef();
    this.toggleLocation = this.toggleLocation.bind(this);
    this.colorChooser = this.colorChooser.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  toggleLocation(){
    this.setState({ location: !this.state.location });
  }

  colorChooser(color){
    this.setState({color: color});
  }

  submitForm(){
    navigator.geolocation.getCurrentPosition((position)=>{
      // keys might be the same on purpose this is to replace a point that is otherwise going to be directly on top of the other
      const latitude = Math.round(position.coords.latitude * 10000) / 10000;
      const longitude = Math.round(position.coords.longitude * 10000) / 10000;
      const key = `${latitude},${longitude}`.replace(/\./g, ',');
      this.props.geoFireRef.set(key, [latitude, longitude], {color: this.state.color.color});

      // after you set the point we have to add color so we use firebaseRef
      // this.props.firebaseRef.child(key).update({color: this.state.color.color});
    });
    this.props.closeForm(false);
  }

  render(){
    const panel = (<Panel
      ref={this.panelFocus}
      className={this.state.panel ? 'open' : 'close'}
      enableAlpha={false}
      color={this.state.color.color}
      onBlur={()=>{this.setState({panel: false})}}
      onChange={this.colorChooser}/>);
    return (
      <div className={`Form-wrapper ${this.props.isActive ? 'active': ''}`}>
        <div className='Form'>
          <div className='title'>New Point</div>
          <div className='input-wrapper'>
            <div
              className='input'
              onClick={this.toggleLocation}>
              <ColorDot color={this.state.location ? 'rgb(0, 181, 0)' : 'rgb(198,0,0)'}/> Allow Location
            </div>
            <Trigger
              className="trigger"
              action={['click']}
              popup={panel}
              popupPlacement="topLeft"
              destroyPopupOnHide
              popupAlign={{
                points: ['tl', 'bl'],
                offset: [0, 3]
              }}>
              <div className='input'>
                  <ColorDot color={this.state.color.color}/> Color Chooser
                </div>
              </Trigger>
          </div>
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
      </div>
    )
  }
}
