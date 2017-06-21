import React, { Component } from 'react'
import { Spin, message, Form, Icon, Input, Button, Row, Col, Radio, Carousel, Checkbox, Select, Modal, Upload   } from 'antd'
import './index.scss'
import Footer from '../footer/index';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

class Test01 extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      visible: false,
      data: ""
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {};
        data[values.key] = values.value;
        window.$.ajax({
          type: values.type,
          url: values.url,
          data: data,
          dataType: values.type === "POST" ? "html" : "json",
          success:function(res){
          },
          error:function(error){
            console.log(error)
          }
        });
      }
    });
  }


  handleSelectChange = (value) => {
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  getData () {
    
  }

  render() {
    let str = '{"test": "test"}'
    let url = "/chealth/background/login/login"
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login-content">
          <div className="code-area">
            <div>输入说明</div>
            <div><code>{"url:" + url}</code></div>
            <div><code>{"type: POST"}</code></div>
          </div>
          <div className="test-area">
             <Form className="test-form" onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator('url', {
                  rules: [{ required: true, message: 'Please input your url!' }],
                })(
                  <Input placeholder="url" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: 'Please select type!' }],
                  onChange: this.handleSelectChange,
                })(
                  <Select placeholder="method type">
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('key', {
                  rules: [{ required: true, message: 'Please input your key!' }],
                })(
                  <Input placeholder="请输入属性名" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('value', {
                  rules: [{ required: true, message: 'Please input your url!' }],
                })(
                  <Input placeholder="请输入属性值" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  测试
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Test01 = Form.create({
})(Test01);