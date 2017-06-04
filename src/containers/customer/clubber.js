import React, { Component } from 'react'
import { Table, Icon, Select, Form, Input, Button, Row, Col, Radio, Cascader, Modal, DatePicker  } from 'antd'
import './index.scss'
import UserInfo from "../../utils/userInfo"
import ClubberDetail from "./clubberDetail"
import ClubberImport from "./clubberImport"
import Condition from "./condition"
import Operate from "./operate"
import ClubberDelete from "./clubberDelete"
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

class Clubber extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      data: [],
      detaiVisible: false,
      addEditVisible: false,
      importVisible: false,
      clubberDeleteVisible: false,
      detailData: {},
      editData: {},
      addEditTitle: "",
      loginAccount: "",
      accountStatus: "00",
      projectData: [],
      projectValue: "all",
      idCardType: [],
      idCardTypeValue: "all",
      region: [],
      workCitys: [],
      institutions: [],
      departments: [],
      workPosition: [],
    }
    this.columns = ClubberDetail.getUserColumns(this)
  }

  componentWillMount () {
    const _this = this;
    //后台用户信息接口
    UserInfo.getUserInfo();
    //会员信息接口
    this.getClubberInfo();
    //项目接口
    let project = new Promise(function(resolve, reject) {
      Condition.getProjects(_this, resolve, reject)
    })
    project.then(function(value) {
      //产品服务
      Condition.getServices()
      //组织机构
    }, function(value) {
      // failure

    });
    /*获取身份证号*/
    Condition.getIdCardType(_this)
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
        addEditVisible: true,
        editData: record,
        addEditTitle: record.name + "信息编辑"
      })
      let data = {
        memberName: record.name,
        sex: record.sex,
        marital: record.marital,
        mobile: record.mobile,
        email: record.email,
        cardType: record.certiType,
        certiId: record.certiId,
        workCity: record.workCity,
        workPosition: record.workPosition,
        cusDepartmentId: record.department,
      }
      this.props.form.setFieldsValue(data)
    }
    else if(flag === "delete"){
      this.setState({
        clubberDeleteVisible: true,
        detailData: record
      })
      Operate.getClubberReserveInfo(this, record);
    }
  }

  handleChange (value) {
    console.log(value)
  }

  /*账号状态修改*/
  countStatusChange (value) {
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

  /*新增编辑确认*/
  addEdithandleOk () {
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {};
        for(let key in values) {
          if(key === "birth") {
            let date = new Date(values[key]._d)
            data.birthYear = date.getFullYear();
            data.birthMonth = date.getMonth() + 1;
            data.birthDay = date.getDate();
          }
          else {
            data[key] = values[key];
          }
        }
        Operate.clubberInfoAdd(_this, data)
      }
    });
  }

  /*模态框*/
  handleOk = (e) => {
    this.setState({
      detaiVisible: false,
      addEditVisible: false,
      importVisible: false,
      clubberDeleteVisible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      detaiVisible: false,
      addEditVisible: false,
      importVisible: false,
      clubberDeleteVisible: false
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    });
  }

        // <div className="table-area-line">
        //   <Row>
        //     <Col span={12}>
        //       <FormItem
        //         {...modalItemLayout}
        //         label="项目名称">     
        //           {getFieldDecorator('userName')(
        //             <Select defaultValue="all" style={{ width: "100%" }} onChange={this.projectChange.bind(this)}>
        //               <Option value="all">全部</Option>
        //               {this.state.projectData.length === 0 ? [] : this.state.projectData.map(el => {
        //                 return <Option value={el.cusId}>{el.projectName}</Option>
        //               })}
        //             </Select>
        //           )}             
        //       </FormItem>
        //     </Col>
        //     <Col span={12}>
        //       <FormItem
        //         {...modalItemLayout}
        //         label="团体名称">                  
        //           <span>{this.state.detailData.birth}</span>
        //       </FormItem>
        //     </Col>
        //   </Row>
        //   <Row>
        //     <Col span={12}>
        //       <FormItem
        //         {...modalItemLayout}
        //         label="产品服务">                  
        //           <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
        //             <Option value="00">全部</Option>
        //             <Option value="01">未激活</Option>
        //             <Option value="02">激活</Option>
        //             <Option value="03">失效</Option>
        //             <Option value="04">禁用</Option>
        //             <Option value="05">作废</Option>
        //           </Select>
        //       </FormItem>
        //     </Col>
        //     <Col span={12}>
        //       <FormItem
        //         {...modalItemLayout}
        //         label="账号状态">                  
        //           <Select defaultValue="00" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
        //             <Option value="00">全部</Option>
        //             <Option value="01">未激活</Option>
        //             <Option value="02">激活</Option>
        //             <Option value="03">失效</Option>
        //             <Option value="04">禁用</Option>
        //             <Option value="05">作废</Option>
        //           </Select>
        //       </FormItem>
        //     </Col>
        //   </Row>
        // </div>
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
                label="用户姓名"
                hasFeedback>                  
                  {getFieldDecorator('memberName', {
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(
                    <Input placeholder="用户姓名" />
                  )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="性别"
                hasFeedback>    
                {getFieldDecorator('sex', {
                    rules: [{ required: true}],
                  })(
                  <Select>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                  </Select>          
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="出生年月"
                hasFeedback> 
                  {getFieldDecorator('birth', {
                    rules: [{ required: true }],
                  })(
                    <DatePicker />
                  )}                  
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="婚姻状况"
                hasFeedback>    
                  {getFieldDecorator('marital', {
                    rules: [{ required: true }],
                  })(
                    <Select>
                      <Option value="0">已婚</Option>
                      <Option value="1">未婚</Option>
                    </Select>          
                  )} 
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户手机"
                hasFeedback>  
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请输入手机号' }],
                  })(
                    <Input placeholder="用户手机" />
                  )}                
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="用户邮箱"
                hasFeedback>    
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: '请输入手机号' }],
                  })(
                  <Input placeholder="用户手机" />
                )}                 
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="身份证件类型"
                hasFeedback>                  
                {getFieldDecorator('cardType', {
                    rules: [{ required: true, message: '请输入对应的身份证件号' }],
                  })(
                 <Select className="icp-selector" notFoundContent="not found">
                  {this.getIdCardTypeOption("form")}
                </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="身份证件号"
                hasFeedback>                  
                {getFieldDecorator('certiId', {
                    rules: [{ required: true, message: '请输入对应的身份证件号' }],
                  })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="员工/会员号"
                hasFeedback>    
                {getFieldDecorator('belongMemberId', {
                    rules: [{ required: true, message: '请输入员工号或会员号' }],
                  })(
                  <Input placeholder="员工号或会员号" />
                )}             
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="账号状态">    
                  {getFieldDecorator('accountStatus', {
                    rules: [{ required: true, message: '请输入员工号或会员号' }],
                    })(
                    <Select>
                      <Option value="01">未激活</Option> 
                      <Option value="02">激活</Option>
                      <Option value="03">失效</Option>
                      <Option value="04">禁用</Option>
                      <Option value="05">作废</Option>
                    </Select>
                  )}                      
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
                  {getFieldDecorator('workCity')(
                    <Select>
                      {this.state.workCitys.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}                 
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="角色/职位">  
                {getFieldDecorator('workPosition')(
                    <Select>
                      {this.state.workPosition.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}     
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="机构组织">                  
                  {getFieldDecorator('cusInstitutionId')(
                    <Select>
                      {this.state.institutions.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}     
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...modalItemLayout}
                label="部门组织">    
                {getFieldDecorator('cusDepartmentId')(
                    <Select>
                      {this.state.departments.map(el => {
                        return <Option value={el.value}>{el.label}</Option>
                      })}
                    </Select>
                  )}                  
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
                  <Cascader
                    options={this.state.region}
                    loadData={this.loadData}
                    onChange={this.onAreaChange}
                    changeOnSelect
                  />
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

  onAreaChange = (value, selectedOptions) => {
    console.log(selectedOptions);
    console.log(value);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  }

  /*异步加载*/
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if(selectedOptions.length === 1) {   //获取市数据
      let data = {
        cusId: "1",                 //客户Id
        custPscId: "1",               //客户所购服务周期ID
        parplmId: selectedOptions[0].value  
      }
      Condition.getCitys(data, targetOption, this)
    }
    else {
      let data = {
        cusId: "1",                 //客户Id
        custPscId: "1",               //客户所购服务周期ID
        parplmId: selectedOptions[selectedOptions.length - 1].value  
      }
      Condition.getCountys(data, targetOption, this)
    }
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
      addEditVisible: true,
      addEditTitle: "新增用户信息"
    })
    /*获取省（直辖市数据）*/
    let data = {
      "cusId": "1",                  
      "custPscId": "0"                
    }
    Condition.getProvince(data, this);
    /*获取工作职位*/
    Operate.getWorkPosition(this, data);
    /*获取工作城市*/
    Operate.getWorkCitys(this, data);
    /*获取团体机构*/
    Operate.getInstitutions(this, data);
    /*获取团体组织*/
    Operate.getDepartments(this, data);
    let initData = {
      sex: "1",
      marital: "0",
      cardType: "1",
      accountStatus: "01"
    }
    this.props.form.setFieldsValue(initData);
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

  /*获取身份证类型*/

  getIdCardTypeOption (flag) {
    let item = [];
    if(flag === "form") {
      if(this.state.idCardType.length !== 0) {
        this.state.idCardType.forEach(el => {
          if(el.value !== "") {
            item.push(<Option value={el.value}>{el.label}</Option>)
          }
        })
      }
    }
    else {
      if(this.state.idCardType.length !== 0) {
        item = this.state.idCardType.map(el => {
          if(el.value === "") {
            return <Option value="all">全部</Option>
          }
          return <Option value={el.value}>{el.label}</Option>
        })
      }
      else {
        item = <Option value="all">全部</Option>
      }
    }
    return item;
  }
  /*身份证类型*/
  idCardTypeChange (value) {
    this.setState({
      idCardTypeValue: value
    })
    let data = {
      cardType: value === "all" ? "" : value
    }
    this.getClubberInfo(data)
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
                    <Select defaultValue="all" value={this.state.idCardTypeValue} onChange={this.idCardTypeChange.bind(this)}>
                      {this.getIdCardTypeOption("condition")}
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
                    <Select defaultValue="all" value={this.state.accountStatus} style={{ width: "100%" }} onChange={this.countStatusChange.bind(this)}>
                      <Option value="all">全部</Option>
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
        </Modal>
        <Modal
          title={this.state.addEditTitle}
          visible={this.state.addEditVisible}
          onOk={this.addEdithandleOk.bind(this)}
          onCancel={this.handleCancel}
          width={800}
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
        <Modal
          title={this.state.detailData.name + "用户信息删除--先取消该用户预约订单"}
          visible={this.state.clubberDeleteVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
        >
          <ClubberDelete />
        </Modal>
      </div>
    );
  }
}

export default Clubber = Form.create({
})(Clubber);