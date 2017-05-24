import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Modal, DatePicker, TimePicker  } from 'antd'
import './index.scss'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};
const Option = Select.Option;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

const columns = [{
  title: '项目名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '项目介绍',
  dataIndex: 'introduction',
  key: 'introduction',
}, {
  title: '项目有效期',
  dataIndex: 'validityPeriod',
  key: 'validityPeriod',
}, {
  title: '项目网站地址',
  key: 'site',
  dataIndex: "site"
},{
  title: '操作',
  key: 'operate',
  dataIndex: 'operate',
  render: (text, record) => {
    return <span className="table-operate">
      {record.operate.map(el => {
        return <span className="table-operate-item"><a>{el}</a></span>
      })}
    </span>
  },
}];

const data = [{
  name: 'xxx',
  introduction: 'xxx',
  validityPeriod: "2017-01-31 ~ 2017-10-30",
  site: 'http://58.215.213.186:9080/chealth/foreground/login/HITECH01',
  operate: ["查看", "操作", "删除"] 
}];

class Project extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
      visible: false,
    }
  }

  componentWillMount () {
    //获取到header项目
    //获取用户信息

  }

  handleChange (value) {
    console.log(value)
  }

  addClick () {
    this.setState({
      visible: true
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      ModalText: 'The modal dialog will be closed after two seconds',
      confirmLoading: true,
    });
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const rangeValue = fieldsValue['range-picker'];
      const values = {
        ...fieldsValue,
        'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
      };
      console.log('Received values of form: ', values);
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  getFormArea () {
    let item;
    const { getFieldDecorator } = this.props.form;
    item = <Form>
        <FormItem
          {...formItemLayout}
          label="项目名称">
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入项目名称' }],
          })(
            <Input placeholder="请输入项目名称" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="有效日期"
        >
          {getFieldDecorator('range-picker', rangeConfig)(
            <RangePicker />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="项目网址">
          {getFieldDecorator('projectSite', {
            rules: [{ required: true, message: '请输入项目名称' }],
          })(
            <Input addonBefore="http://healthcheck.gravityhealth.com.cn/chealth/" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="项目网址">
          {getFieldDecorator('projectDetail')(
            <Input type="textarea" rows={4} />
          )}
        </FormItem>
      </Form>
    return item;
  }

  tableDataSearch () {
    //查询接口
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div className="group-search-select">
              <span>项目名称：</span>
              <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange.bind(this)}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
              <span className="group-search-button">
                <Button type="primary" onClick={this.tableDataSearch.bind(this)}>搜索</Button>
              </span>
            </div>
          </div>
          <div className="line-area"></div>
          <div className="group-table">
            <div className="group-table-operate">
              <Button type="primary" onClick={this.addClick.bind(this)}>新增</Button>
            </div>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
        <Modal title="新增项目"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}>
          {this.getFormArea()}
        </Modal>
      </div>
    );
  }
}

export default Project = Form.create({
})(Project);