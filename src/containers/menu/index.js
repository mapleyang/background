import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import './index.scss'
import MenuList from '../../contents/menu'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class LeftMenu extends Component {
  constructor(props, context) {
    super(props)
    this.state = {}
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
    item = MenuList[this.props.modle].map(el => {
      let ele;
      if(el.children) {
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
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          {this.getMenuList()}
        </Menu>
      </div>
    );
  }
}

export default LeftMenu;