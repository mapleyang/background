import React, { Component } from 'react'
import { Spin, message, Form, Icon, Input, Button, Row, Col, Radio, Carousel  } from 'antd'
import './index.scss'
import Footer from '../footer/index';
import classnames from "classnames";
import language from "../../utils/param";
const FormItem = Form.Item
const RadioGroup = Radio.Group;
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

  componentDidMount () {
  }

  handleSubmit(e) {
    let _this = this;
    const hide = message.loading('请耐心等待', 0);
    setTimeout(hide, 2000);
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let url = "/movie/cinema_detail?url=" + values.url + "&fileName=" + values.fileName + "&contentType=" + values.contentType + "&fileType=";
        location.href = url;
        // fetch("/movie/cinema_detail?url=" + values.url + "&fileName=" + values.fileName + "&contentType=" + values.contentType + "&fileType=")
        // .then(response => response.json())
        // .then(json => { 
        //   console.log(json)
        // })
      }
    })
  }


  mousehover (value) {
    let _this = this;
    $("#desc").css("z-index", 0)
    setTimeout(function () {
      _this.setState({
        hoverFlag: value
      })
    }, 500)
  }

  getContent (value) {
    let item = "";
    const mainContent = [{
      name: "q",
      value: <Col className="home-fuc-entry-content" span={20}>
        <Row>
          <Col span={6}>
            <div className="entry-content-title">i want quit</div>
          </Col>
          <Col span={14}>
            <Row>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "analysis")}>健康分析</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "myplan")}>戒烟计划</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "mark")}>戒烟打卡</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "diary")}>戒烟日记</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    },{
      name: "u",
      value: <Col className="home-fuc-entry-content" span={20}>
        <Row>
          <Col span={6}>
            <div className="entry-content-title">Recently quit</div>
          </Col>
          <Col span={14}>
            <Row>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "selfcure")}>自助戒烟</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "msgcure")}>短信戒烟</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "mindcure")}>心理戒烟</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "medicinecure")}>药物戒烟</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    },{
      name: "i",
      value: <Col className="home-fuc-entry-content" span={20}>
        <Row>
          <Col span={6}>
            <div className="entry-content-title">Stay quit</div>
          </Col>
          <Col span={14}>
            <Row>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "truth")}>戒烟游戏</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "compete")}>戒烟知识竞赛</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    },{
      name: "t",
      value: <Col className="home-fuc-entry-content" span={20}>
        <Row>
          <Col span={6}>
            <div className="entry-content-title">Smoke-free World</div>
          </Col>
          <Col span={14}>
            <Row>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "disease")}>戒烟知识</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "commonweal")}>戒烟公益</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "coach")}>戒烟教练</div>
              </Col>
              <Col span={6}>
                <div className="entry-content-title" onClick={this.linkClick.bind(this, "child")}>孩子-无烟</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    }]
    mainContent.forEach(el => {
      if(el.name === this.state.hoverFlag && el.name === value) {
        item = el.value;
      }
    })
    return item;
  }

  mouseLeave () {
    $("#desc").css("z-index", 1000)
    this.setState({
      hoverFlag: ""
    })
  }

  linkClick (value) {
    location.hash = "/" + value;
  }

  render() {
    const defaultZH_EN = window.ZH_EN[language.getLanguage()];
    return (
      <div className="home">
        test
      </div>
    );
  }
}

export default Home;
