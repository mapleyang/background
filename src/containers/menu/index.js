import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import './index.scss'
import MenuList from '../../contents/menu'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class LeftMenu extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      currentKey: ""
    }
  }

  componentWillMount () {
    let pathname = location.hash;
    this.setState({
      currentKey: pathname.substr(2, location.hash.indexOf("?") - 2)
    })
    // location.hash = "/" + MenuList[this.props.modle][0].key
  }

  handleClick = (e) => {
    location.hash = "/" + e.key;
  }


  getSubMenuList (menuList) {
    let item = "";
    if(menuList) {
      item = menuList.map(el => {
        return <Menu.Item key={el.key}>{el.title}</Menu.Item>
      })
    }
    return item;
  }

  getMenuList () {
    let item;
    let array = [];
    console.log(MenuList[this.props.modle])
    console.log(this.state.currentKey)
    item = MenuList[this.props.modle].map(el => {
      let ele;
      if(el.children && el.children.length !== 0) {
        ele = <SubMenu key={el.key} title={<span><Icon type={el.icon} /><span>{el.title}</span></span>}>
          {this.getSubMenuList(el.children)}
        </SubMenu>
      }
      else {
        ele = <Menu.Item key={el.key}>{el.title}</Menu.Item>
      }
      return ele;
    })
    return item;
  }

  render() {
    return (
      <div className="left-menu">
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={this.state.currentKey}
          mode="inline"
        >
          {this.getMenuList()}
        </Menu>
      </div>
    );
  }
}

export default LeftMenu;