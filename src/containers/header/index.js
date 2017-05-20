import React, { Component } from 'react'
import { Row, Col, Menu, Icon  } from 'antd'
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';
import './index.scss';
import HeaderMenu from "../../contents/header";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const languageValue = location.hash.slice(2, 4) === "en" ? "中文" : "EN";

class Header extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      current: 'group',
      language: languageValue,
      param: "",
    }
  }

  componentWillMount () {
    //获取到header项目
    //获取用户信息
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

  languageCovert (value) {
    let language;
    let route;
    if(location.hash.slice(2,4) === "en") {
      route = location.hash.slice(4, location.hash.indexOf("?"));
    }
    else {
      route = location.hash.slice(1, location.hash.indexOf("?"))
    }
    console.log(route)
    if(value === "EN") {
      language = "中文";
      location.hash = "/en" + route;
    }
    if(value === "中文") {
      language = "EN";
      location.hash = route;
    }
    this.setState({
      language: language
    })
  }

  getUserItem () {
    let item;
    if(sessionStorage.getItem("userInfo") === undefined){
      item = <div className="user-login" onClick={this.loginClick.bind(this)}><Icon type="user" />登陆/注册</div>
    }
    else {
      item = <div className="user-image" onClick={this.userInfoClick.bind(this)}><img src="./user.jpg" /></div>
    }
    return item;
  }

  userInfoClick () {
    location.hash = "/user";
  }

  getMenuList () {
    let item = "";
    item = HeaderMenu["adminMenu"].map(el => {
      return <Menu.Item key={el.value}>
        <span>
          {el.label}
        </span>
      </Menu.Item>
    })
    return item;
  }

  getMenu () {

  }

  render() {
    const defaultZH_EN = window.ZH_EN['zh'];
    let param = location.hash.slice(2, 4) === "en" ? "en" : "zh";
    if(this.state.param !== "" && this.state.param !== param ) {
      location.reload();
    }
    return (
      <div className="header-area">
        <Row className="header-row-menu">
          <Col span={3} className="header-logo">
            <img src="/chealth/img/background/viewfile.png" />
            <div className="header-name"><span>电商配置</span></div>
          </Col>
          <Col span={17} className="menu-col">
              <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal">
                {this.getMenuList()}
              </Menu>
          </Col>
          <Col span={2}>
            {this.getUserItem()}
          </Col>
          <Col span={2}>
            <div className="language-setting" onClick={this.languageCovert.bind(this, this.state.language)}>{this.state.language}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;



// <Menu.Item key="group">
//                 <span>
//                   <FormattedMessage id="header.menu.group" defaultMessage={defaultZH_EN['header.menu.group']}/>
//                 </span>
//               </Menu.Item>
//               <Menu.Item key="base">
//                 <span>
//                   <FormattedMessage id="header.menu.base" defaultMessage={defaultZH_EN['header.menu.base']}/>
//                 </span>
//               </Menu.Item>
//               <Menu.Item key="analysis">
//                 <span>
//                   <FormattedMessage id="header.menu.analysis" defaultMessage={defaultZH_EN['header.menu.analysis']}/>
//                 </span>
//               </Menu.Item>