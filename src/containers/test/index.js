import React, { Component } from 'react'
import { Spin, message, Form, Icon, Input, Button, Row, Col, Radio, Carousel, Checkbox, Select  } from 'antd'
import './index.scss'
import Footer from '../footer/index';
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

class Test extends Component {
  constructor(props, context) {
    super(props)
    this.state = {}
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        window.$.ajax({
          type: values.type,
          url: values.url,
          data: JSON.parse(values.data),
          dataType: values.type === "POST" ? "html" : "json",
          success:function(res){
            console.log(res)
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
            <div><code>{"data:" + str + "//JSON key和value都必须双引号"}</code></div>
          </div>
          <div className="login-area">
             <Form onSubmit={this.handleSubmit} className="login-form">
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
                {getFieldDecorator('data', {
                  rules: [{ required: true, message: 'Please input your data!' }],
                })(
                  <Input type="textarea" placeholder="please input data" />
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

export default Test = Form.create({
})(Test);