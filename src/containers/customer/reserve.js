import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const modalItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}
const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;
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


class Reserve extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
      detaiVisible: false,
      editVisible: false,
      importVisible: false,
      detailData: {},
      editData: {},
      addEditTitle: "",
      loginAccount: "",
      accountStatus: "00",
      mobile: "",
      projectData: [],
      projectValue: "all",
    }
    this.columns = ClubberDetail.getReserveItem(this)
  }

  componentWillMount () {
    //后台用户信息接口
    UserInfo.getUserInfo();
    //会员信息接口
    this.getClubberInfo();
    //项目接口
    this.getProjectInfo();
  }

  /*项目信息获取*/
  getProjectInfo () {
    const _this = this;
    window.$.ajax({
      type: 'GET',
      url: "/chealth/background/ajaxBusiness/loadCustProjectList",
      dataType:'json',
      success:function(res){
        if(res.success === "true") {
          _this.setState({
            projectData: res.data,
          })
        }
        else {
          // Modal.error({
          //   title: data.errors[0].errorMessage,
          //   content: '',
          // });
        }
      },
      error:function(){
      }
    });
  }

  getClubberInfo (body) {
    const _this = this;
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/cusServiceOperation/memberInfo/searchData",
      data: body,
      dataType:'html',
      success:function(res){
        if(res.success === undefined) {
          res = JSON.parse(res)
        }
        if(res.success === "true") {
          _this.setState({
            data: res.data.rows
          })
        }
        else {
          Modal.error({
            title: res.errors[0].errorMessage,
            content: '',
          });
        }
      },
      error:function(){
      }
    });
  }

  /*表格操作*/
  operateClick (flag, record, index) {
    if(flag === "detail") {
      this.setState({
        detaiVisible: true,
        detailData: record
      })
    }
    else if(flag === "edit"){
      this.setState({
        editVisible: true,
        editData: record,
        addEditTitle: record.name + "信息编辑"
      })
    }
    else if(flag === "delete"){
      Modal.confirm({
        title: "确定删除" + record.name + "信息",
        content: '',
        onOk() {
          console.log('OK');
        },
        onCancel() {
        },
      });
    }
  }

  handleChange (value) {
    console.log(value)
  }

  /*账号状态修改*/
  countStatusChange (value) {
    console.log(value)
    let data = {
      accountStatus: value
    }
    this.setState({
      accountStatus: value
    })
    this.getClubberInfo(data)
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

  /*产品服务机构信息*/


  /*组织机构更改*/

  agencyChange () {

  }

  /*模态框*/
  handleOk = (e) => {
    console.log(e);
    this.setState({
      detaiVisible: false,
      editVisible: false,
      importVisible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      detaiVisible: false,
      editVisible: false,
      importVisible: false,
    });
  }
  /*用户信息详情*/
  getUserDetail () {
    let item = "";
    let list = [];
    let colList = [];
    ClubberDetail.getUserItemDetail(this.state.detailData).forEach((el, index) => {
      let ColEl = <Col span={12}>
        <FormItem
          {...modalItemLayout}
          label={el.label}>                  
            <span>{el.value}</span>
        </FormItem>
      </Col>
      colList.push(ColEl)
      if(index % 2) {
        let RowEl = <Row>
          {colList}
        </Row>
        list.push(RowEl);
        colList = [];
      }
      if((ClubberDetail.getUserItemDetail(this.state.detailData).length % 2) && (ClubberDetail.getUserItemDetail(this.state.detailData).length - 1 === index)) {
        let RowEl = <Row>
          {colList}
        </Row>
        list.push(RowEl);
        colList = [];
      }
    });

    item = <div className="table-dialog-area">

      {list}
    </div>
    return item;
  }

  /*用户新增与编辑*/
  getUserAddEdit () {
    let item = "";
    const { getFieldDecorator } = this.props.form;
    item = <Form>
      <div className="table-dialog-area">
        <div className="table-area-line">
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="项目名称">                  
                  <Select defaultValue="all" value={this.state.projectValue} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                    <Option value="all">全部</Option>
                    {this.state.projectData.length === 0 ? [] : this.state.projectData.map(el => {
                      return <Option value={el.cusId}>{el.projectName}</Option>
                    })}
                  </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="团体名称">                  
                  <span>{this.state.detailData.birth}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="产品服务">                  
                  <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                    <Option value="00">全部</Option>
                    <Option value="01">未激活</Option>
                    <Option value="02">激活</Option>
                    <Option value="03">失效</Option>
                    <Option value="04">禁用</Option>
                    <Option value="05">作废</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="账号状态">                  
                  <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                    <Option value="00">全部</Option>
                    <Option value="01">未激活</Option>
                    <Option value="02">激活</Option>
                    <Option value="03">失效</Option>
                    <Option value="04">禁用</Option>
                    <Option value="05">作废</Option>
                  </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="table-area-line">
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户姓名"
                hasFeedback>                  
                  <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="性别"
                hasFeedback>    
                <Select defaultValue="0">
                  <Option value="0">男</Option>
                  <Option value="1">女</Option>
                </Select>          
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="出生年月"
                hasFeedback>                  
                  <DatePicker />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="婚姻状况"
                hasFeedback>    
                  <Select defaultValue="0">
                    <Option value="0">已婚</Option>
                    <Option value="1">未婚</Option>
                  </Select>          
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户手机"
                hasFeedback>                  
                  <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户邮箱"
                hasFeedback>    
                <Input />              
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="身份证件号"
                hasFeedback>                  
                  <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="员工/会员号">    
                <Input />              
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="table-area-line">
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="工作城市">                  
                  <Select defaultValue="0">
                    <Option value="0">北京</Option>
                    <Option value="1">上海</Option>
                  </Select> 
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="角色/职位">    
                <Select defaultValue="0">
                    <Option value="0">经理</Option>
                    <Option value="1">员工</Option>
                  </Select>             
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="机构组织">                  
                  <Select defaultValue="0">
                    <Option value="0">机构1</Option>
                    <Option value="1">机构2</Option>
                  </Select> 
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="部门组织">    
                <Select defaultValue="0">
                    <Option value="0">部门1</Option>
                    <Option value="1">部门2</Option>
                  </Select>               
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="table-area-line">
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="联系手机">                  
                  <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="联系邮箱">    
                <Input />              
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="所在地区">                  
                  <Cascader options={options} placeholder="Please select" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="详细地址">    
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
                label="备注">                  
                  <Input />
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
    return item;
  }

  /*查询*/
  searchClick () {
    let data = {}
    if(this.state.mobile !== "") {
      data.mobile = this.state.mobile;
    }
    if(this.state.loginAccount !== "") {
      data.loginAccount = this.state.loginAccount;
    }
    this.getClubberInfo(data);
  }
  /*清空*/
  clearClick () {
    this.setState({
      accountStatus: "00",
      loginAccount: "",
      mobile: "",
      projectValue: "all"
    })
    this.getClubberInfo()
  }
  /*新增*/
  addUserClick () {
    this.setState({
      editVisible: true,
      addEditTitle: "新增用户信息"
    })
  }
  /*导出*/
  exportClick () {

  }
  /*导入*/
  importClick () {
    this.setState({
      importVisible: true
    })
  }
  /*登陆账号更改*/
  countLoginChange = (e) => {
    this.setState({
      loginAccount: e.target.value
    })
  }

  /*搜索条件-手机事件*/
  mobileChange = (e) => {
    this.setState({
      mobile: e.target.value
    })
  }


  render() {
    return (
      <div className="right-content">
        <div className="group-user">
          <div className="group-search">
            <div>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label="项目名称："
                  >
                    <Select defaultValue="all" value={this.state.projectValue} style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
                      <Option value="all">全部</Option>
                      {this.state.projectData.length === 0 ? [] : this.state.projectData.map(el => {
                        return <Option value={el.cusId}>{el.projectName}</Option>
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                  {...formItemLayout}
                    label="机构组织：">                  
                    <Select defaultValue="lucy" style={{ width: "100%" }} onChange={this.agencyChange.bind(this)}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol = {{ span: 6 }}
                    wrapperCol = {{ span: 14 }}
                    label="员工/会员号：">
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="登陆账号：">                  
                    <Input onChange={this.countLoginChange} value={this.state.loginAccount}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="手机号：">   
                  <Input onChange={this.mobileChange} value={this.state.mobile}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  labelCol = {{ span: 6 }}
                  wrapperCol = {{ span: 14 }}
                  label="身份证件号："
                  className="item-idCard">   
                  <InputGroup compact>
                    <Select defaultValue="idCard">
                      <Option value="idCard">身份证</Option>
                      <Option value="passport">护照</Option>
                    </Select>
                    <Input style={{ width: '68%' }} />
                  </InputGroup> 
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="帐号状态：">                  
                    <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                      <Option value="00">全部</Option>
                      <Option value="01">未激活</Option>
                      <Option value="02">激活</Option>
                      <Option value="03">失效</Option>
                      <Option value="04">禁用</Option>
                      <Option value="05">作废</Option>
                    </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="产品服务：">                  
                    <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                      <Option value="00">全部</Option>
                      <Option value="01">未激活</Option>
                      <Option value="02">激活</Option>
                      <Option value="03">失效</Option>
                      <Option value="04">禁用</Option>
                      <Option value="05">作废</Option>
                    </Select>
                </FormItem>
              </Col>
              <Col span={8}>
              </Col>
            </Row>
          </div>
          <div className="group-search-operate">
            <span className="group-search-button">
              <Button type="primary" onClick={this.searchClick.bind(this)}>搜索</Button>
              <Button type="primary" onClick={this.clearClick.bind(this)}>条件清空</Button>
              <Button type="primary" onClick={this.addUserClick.bind(this)}>用户新增</Button>
              <Button type="primary" onClick={this.importClick.bind(this)}>用户导入</Button>
              <Button type="primary" onClick={this.exportClick.bind(this)}>模板导出</Button>
            </span>
          </div>
          <div className="line-area"></div>
          <div className="group-table">
            <div className="group-table-operate">
            </div>
            <Table columns={this.columns} dataSource={this.state.data} size="middle"  />
          </div>
        </div>
        <Modal
          title={this.state.detailData.name + "信息详情"}
          visible={this.state.detaiVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          {this.getUserDetail()}
        </Modal>
        <Modal
          title={this.state.addEditTitle}
          visible={this.state.editVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          {this.getUserAddEdit()}
        </Modal>
        <Modal
          title="用户信息导入"
          visible={this.state.importVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          <ClubberImport />
        </Modal>
      </div>
    );
  }
}

export default Reserve = Form.create({
})(Reserve);