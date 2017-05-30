import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, Upload } from 'antd'
import './index.scss';

const FormItem = Form.Item;
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

class ClubberAddEdit extends Component {
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
      </div>
    );
  }
}

export default ClubberAddEdit = Form.create({
})(ClubberAddEdit);


