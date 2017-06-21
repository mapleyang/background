import React, { Component } from 'react'
import { Spin, message, Form, Icon, Input, Button, Row, Col, Radio, Carousel, Checkbox, Modal  } from 'antd'
import './index.scss'
import Footer from '../footer/index';
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

class Login extends Component {
	constructor(props, context) {
    super(props)
    this.state = {
      error: "",
      loading: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var body = {
          email: values.userName,
          password: values.password,
        }
        window.$.ajax({
          type: 'POST',
          url: "/chealth/background/login/login",
          data: body,
          dataType:'html',
          success:function(res){
            let data = JSON.parse(res)
            if(data.success === "true") {
              sessionStorage.setItem("userInfo", res)
              location.hash = "/clubber"                  
            }
            else {
              Modal.error({
                title: data.errors[0].errorMessage,
                content: '',
              });
            }
            _this.setState({
              loading: false
            })
          },
          error:function(){
          }
        });
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login-content">
          <div className="login-area">
             <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
                  登陆
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div className="footer"><Footer /></div>
      </div>
    );
  }
}

export default Login = Form.create({
})(Login);