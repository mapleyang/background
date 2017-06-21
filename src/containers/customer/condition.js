const Condition = {
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
  }
}

export default Condition;