import React, { Component } from 'react'
import Header from './header/index';
import Footer from './Footer/index';
import LeftMenu from "./menu/index";
import '../styles/theme.scss'
import '../styles/index.scss'
import PathName from '../utils/location'
export default class App extends Component {

  constructor(props, context) {
    super(props)
    this.state = {
      pathname: "",
      modle: "customerService"
    }
  }

  componentWillMount () {
    if(!sessionStorage.getItem("userInfo")) {
      location.hash = "/login"
    }
  }

  getHeader () {
    let header = "";
    header = <Header setModle={this.setModle.bind(this)} />
    // let flag = location.hash.indexOf("#/mobile");
    // let pathname = "";
    // if(flag === 0) {
    //   pathname = "mobile";
    // }
    // else {
    // }
    return header;
  }

  setModle (value) {
    this.setState({
      modle: value
    })
  }

  getLeftArea () {
    let item;
    if(PathName.getPathName("#/login") || PathName.getPathName("#/home")) {
      item = <div className="main-full-content">
        {this.props.children}
      </div>
    }
    else {
      item = <div className="main-content">
        <div className="main-left-content">
          <LeftMenu modle={this.state.modle} />
        </div>
        <div className="main-right-content">
          {this.props.children}
        </div>
      </div>
    }
    return item;
  }

  render() {
    return (
      <div className="main">
        <div className="main-header">{this.getHeader()}</div>
        {this.getLeftArea()}
      </div>
    );
  }
}