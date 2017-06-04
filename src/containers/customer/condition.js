const Condition = {
  /*项目*/
  getProjects: (_this, resolve, reject) => {
    window.$.ajax({
      type: 'GET',
      url: "/chealth/background/ajaxBusiness/loadCustProjectList",
      dataType:'json',
      success:function(res){
        if(res.success === "true") {
          _this.setState({
            projectData: res.data,
          })
          resolve(res.data);
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
  },
  /*产品服务*/
  getServices: () => {

  },
  /*获取身份证类型*/
  getIdCardType: (_this) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCertiTypeList",
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            idCardType: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*服务地区省*/
  getProvince: (data, _this)  => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustParplmList",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          let list = data.data.list.map(el => {
            el.isLeaf = false;
            return el
          })
          _this.setState({
            region: list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*服务地区市*/
  getCitys: (data, targetOption, _this) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustCityListInParplm",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          let list = data.data.list.map(el => {
            // el.isLeaf = false;
            return el
          })
          targetOption.loading = false;
          targetOption.children = list;
          _this.setState({
            region: [..._this.state.region],
          });
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*服务地区市*/
  getCitys: (data, _this) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustCityListInParplm",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            citys: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*获取区、县*/
  getCountys: (data, targetOption, _this) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustCityListInParplm",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          let list = data.data.list.map(el => {
            el.isLeaf = false;
            return el
          })
          targetOption.loading = false;
          targetOption.children = list;
          _this.setState({
            region: [..._this.state.region],
          });
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*所属医院*/
  getHospital: () => {

  },
  /*所属服务集团*/
  getGroups: (data, _this) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustHcuGrouptList",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            groups: data.data.list
          })
        }
        else {
        }
      },
      error:function(){
      }
    });
  },
  /*获取服务机构*/
  getInstitution: (data, _this) => {
    window.$.ajax({
      type: 'POST',
      url: "/chealth/background/ajaxBusiness/loadCustHcuInstitutionsInGroup",
      data: data,
      dataType:'html',
      success:function(res){
        let data = JSON.parse(res)
        if(data.success === "true") {
          _this.setState({
            institution: data.data.list
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

export default Condition;