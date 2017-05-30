import React, { Component } from 'react'
import { Spin, message, Form, Icon, Input, Button, Row, Col, Radio, Carousel, Card   } from 'antd'
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

  componentWillMount () {
    
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


  mouseLeave () {
    $("#desc").css("z-index", 1000)
    this.setState({
      hoverFlag: ""
    })
  }

  linkClick (value) {
    location.hash = "/" + value;
  }

  getModle () {
    let item;
    let array = ["医疗协同","体检预约","权限管理",4,5,6];
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

  render() {
    const defaultZH_EN = window.ZH_EN[language.getLanguage()];
    return (
      <div className="home">
        <div className="home-modles">
          <Row>{this.getModle()}</Row>
        </div>
      </div>
    );
  }
}

export default Home;
