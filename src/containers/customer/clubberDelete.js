import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, Upload } from 'antd'
import './index.scss';
import ClubberDetail from "./clubberDetail"
const FormItem = Form.Item;
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

class ClubberDelete extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
    }
    this.columns = ClubberDetail.getReserveItem(this)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="clubber-delete">
        <Table columns={this.columns}  size="middle"  />
      </div>
    );
  }
}

export default ClubberDelete = Form.create({
})(ClubberDelete);


