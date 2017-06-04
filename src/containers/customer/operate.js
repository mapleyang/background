const Operate = {
  getClubberReserveInfo: (_this, record) => {
    
  },
  /*会员信息新增*/
  clubberInfoAdd: (_this, data) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/cusServiceOperation/memberInfo/saveCreate",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            addEditVisible: false
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*团体工作职位下拉框下拉项取得*/
  getWorkPosition: (_this, data) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustWorkPositionsList",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            workPosition: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*获取工作城市*/
  getWorkCitys: (_this, data) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustWorkCitiesList",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            workCitys: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*团体机构获取*/
  getInstitutions: (_this, data) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustInstitutionsList",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            institutions: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*团体部门获取*/
  getDepartments: (_this, data) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustDepartmentsList",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          this.setState({
            departments: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  }
}

export default Operate;