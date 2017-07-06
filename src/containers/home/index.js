import React, { Component } from 'react'
import {Form, Row, Col, Card   } from 'antd'
import './index.scss'
import Footer from '../footer/index';
import classnames from "classnames";
import language from "../../utils/param";
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

class Home extends Component {
	constructor(props, context) {
    super(props)
    this.state = {
      loading: false,
      url: "",
      current: 'mail',
      hoverFlag: "",
    }
  }

  getModle () {
    let item;
    let array = ["医疗协同","体检预约","权限管理"];
    item = array.map((el,index) => {
      return <Col key={"modle" + index} span={4} className="home-modles-block">
        <Card onClick={this.cardModleClick.bind(el)}>
          {el}
        </Card>
      </Col>
    })
    return item;
  }

  cardModleClick (value) {
    location.hash = "/login"
  }

  getLogoList () {
    let item = "";
    return item;
  }

  render() {
    const defaultZH_EN = window.ZH_EN[language.getLanguage()];
    return (
      <div className="home">
        <div className="header-logo">
          {this.getLogoList()}
        </div>
        <div className="home-modles">
          <Row>{this.getModle()}</Row>
        </div>
      </div>
    );
  }
}

export default Home;
