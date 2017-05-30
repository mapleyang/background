import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, Upload } from 'antd'
import './index.scss';

const FormItem = Form.Item;
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

class ClubberImport extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      projectValue: "all"
    }
  }

  /*项目更改*/
  projectChange (value) {
    let data = {
      cusId: value === "all" ? "" : value
    }
    this.setState({
      projectValue: value,
    })
    this.getClubberInfo(data);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const props = {
      name: 'file',
      action: "/action.do",
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
      <div className="clubber-import">
        <Form>
        <div className="table-dialog-area">
          <div className="table-area-line">
            <Row>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="项目名称">                  
                    <Select defaultValue="all" value={this.state.projectValue} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                      <Option value="all">全部</Option>
                    </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="团体名称">                  
                    <span></span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="产品服务">                  
                    <Input />
                </FormItem>
              </Col>
            </Row>
          </div>
          <div style={{marginTop: "10px"}}>
            <Row>
              <Col span={12}>
                <FormItem
                  {...modalItemLayout}
                  label="文件上传">
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload" /> Upload
                      </Button>
                    </Upload>
                  </FormItem>
              </Col>
              </Row>
          </div>
        </div>
      </Form>
      </div>
    );
  }
}

export default ClubberImport = Form.create({
})(ClubberImport);


