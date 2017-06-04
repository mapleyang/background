import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, Upload, DatePicker   } from 'antd'
import './index.scss';
import moment from 'moment';
const FormItem = Form.Item;
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}



const columns = [{
  title: '套餐名称',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: '套餐名称',
  dataIndex: 'age',
}, {
  title: '详情',
  dataIndex: 'address',
}];
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: '查看',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: '查看',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: '查看',
}];

const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',    // Column configuration not to be checked
  }),
};

class ReserveForm extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      projectValue: "all",
      combo: "1",
      tyep: ""
    }
  }

  componentWillMount () {
    console.log(this.props.type)
    this.setState({
      type: this.props.type
    })
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.type !== this.state.type) {
      this.setState({
        type: nextProps.type
      })
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

  comboChange (value) {
    if(value === "2") {

    }
    this.setState({
      combo: value
    })
  }

  getComboItem () {
    let item = "";
    item = <div>
      <div><span>可选自费套餐</span></div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} size="middle" />
      <div><span>可选自费体检项目</span></div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} size="middle" />
    </div>
    return item;
  }

  getDialogItem () {
    let item = "";
    if(this.state.type === "reserve") {
      item = <div className="table-area-line">
        <div><span>选择服务套餐</span></div>
        <Row>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="服务套餐">                  
                <Select defaultValue="1" value={this.state.combo} style={{ width: "100%" }} onChange={this.comboChange.bind(this)}>
                  <Option value="1">套餐1</Option>
                  <Option value="2">套餐2</Option>
                  <Option value="3">套餐3</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...modalItemLayout}
              label="套餐说明">                  
                <span><a>查看详情</a></span>
            </FormItem>
          </Col>
        </Row>
        {this.getComboItem()}
      </div>
    }
    return item
  }

  onPanelChange(value, mode) {
    console.log(value, mode);
  }

  disabledDate(current) {
  // Can not select days before today and today
    return current && current.valueOf() < Date.now();
  }

  disabledDateTime() {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }

  onChange(value) {
    console.log(value);
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
    console.log(this.props.type)
    console.log("=====")
    return (
      <div className="reserve-form">
        <Form>
          <div className="table-dialog-area">
            {this.getDialogItem()}
            <div className="table-area-line">
              <div><span>选择服务机构和日期</span></div>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...modalItemLayout}
                    label="服务地区">                  
                       <Cascader defaultValue={['zhejaing', 'hangzhou', 'xihu']} options={options} onChange={this.onChange} />
                  </FormItem>
                </Col>
                <Col span={12}>
                 <FormItem
                    {...modalItemLayout}
                    label="体检机构">                  
                      <Select defaultValue="1" value={this.state.combo} style={{ width: "100%" }} onChange={this.comboChange.bind(this)}>
                        <Option value="1">机构1</Option>
                        <Option value="2">机构2</Option>
                        <Option value="3">机构3</Option>
                      </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...modalItemLayout}
                    label="服务日期选择">  
                      <DatePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={this.disabledDate}
                        disabledTime={this.disabledDateTime}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      />                
                  </FormItem>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default ReserveForm = Form.create({
})(ReserveForm);


