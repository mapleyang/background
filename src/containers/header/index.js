import React, { Component } from 'react'
import { Row, Col, Menu, Icon  } from 'antd'
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';
import './index.scss';
import HeaderMenu from "../../contents/header";
import PathName from '../../utils/location'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const languageValue = location.hash.slice(2, 4) === "en" ? "中文" : "EN";

class Header extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      current: 'customerService',
      language: languageValue,
      param: "",
    }
  }

  componentWillMount () {
    //获取到header项目
    //获取用户信息
    if(!sessionStorage.getItem("userInfo")) {
      location.hash = "/login"
    }
  }

  componentDidMount () {
    this.setState({
      param: location.hash.slice(2, 4) !== "en" ? "zh" : "en",
      // param: location.hash.slice(2, 4)
    })
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    this.props.setModle(e.key)
    // location.hash = "/" + e.key;
  }

  loginClick () {
    location.hash = "/login";
  }

  getUserItem () {
    let item;
    // if(sessionStorage.getItem("userInfo") === undefined){
    //   item = <div className="user-login" onClick={this.loginClick.bind(this)}><Icon type="user" />登陆/注册</div>
    // }
    // else {
    //   item = <div className="user-image" onClick={this.userInfoClick.bind(this)}><img src="/chealth/img/background/user.jpg" /></div>
    // }
    if(sessionStorage.getItem("userInfo") === undefined || sessionStorage.getItem("userInfo") === null){
      item = <div className="user-login">帮助文档</div>
    }
    else {
      item = "";
    }
    return item;
  }

  userInfoClick () {
    location.hash = "/user";
  }

  getMenuList () {
    let item = "";
    if(PathName.getPathName("#/login") || PathName.getPathName("#/home")) {
      item = ""
    }
    else {
      item = HeaderMenu["adminMenu"].map(el => {
        return <Menu.Item key={el.value}>
          <span>
            {el.label}
          </span>
        </Menu.Item>
      })
    }
    return item;
  }
  /*
    获取菜单
  */
  getMenu () {

  }
  /*登出操作*/
  loginOutClick () {
    window.$.ajax({
      type: 'GET',
      url: "/chealth/background/login/logout",
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          sessionStorage.removeItem("userInfo")
          location.hash = "/login"               
        }
        else {
           
        }
      },
      error:function(){
      }
    });
  }

  render() {
    // let param = location.hash.slice(2, 4) === "en" ? "en" : "zh";
    // if(this.state.param !== "" && this.state.param !== param ) {
    //   location.reload();
    // }
    let userInfo = sessionStorage.getItem("userInfo");
    return (
      <div className="header-area">
        <Row className="header-row-menu">
          <Col span={4} className="header-logo">
            <img src="/chealth/img/background/viewfile.png" />
            <div className="header-name"><span>健康平台后台系统</span></div>
          </Col>
          <Col span={17} className="menu-col">
              <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              defaultOpenKeys={['customerService']}
              mode="horizontal">
                {this.getMenuList()}
              </Menu>
          </Col>
          <Col span={2}>
            {this.getUserItem()}
          </Col>
          <Col span={2}>
            {userInfo === undefined || userInfo === null ? "" :
              <div className="language-setting" onClick={this.loginOutClick.bind(this)}>登出</div>
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;

