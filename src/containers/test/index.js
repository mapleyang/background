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

class Test extends Component {
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
        console.log(values.data)
        window.$.ajax({
          type: values.type,
          url: values.url,
          data: values.data === undefined ? "" : JSON.parse(values.data),
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
    const props = {
      name: 'inputExcelFile',
      action: this.props.form.getFieldValue("url"),
      onChange: this.handleChange,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    }
    return (
      <div className="login">
        <div className="login-content">
          <div className="code-area">
            <div>输入说明</div>
            <div><code>{"url:" + url}</code></div>
            <div><code>{"type: POST"}</code></div>
            <div><code>{"data:" + str + "//JSON key和value都必须双引号"}</code></div>
            <div><code>文件上传：先填写上传接口url，无需点击测试按钮</code></div>
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
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> Upload
                  </Button>
                </Upload>
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
                {getFieldDecorator('data')(
                  <Input className="data-area" type="textarea" placeholder="please input data" />
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