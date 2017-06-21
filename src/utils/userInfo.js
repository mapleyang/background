const UserInfo = {
  getUserInfo: () => {
    window.$.ajax({
      type: 'GET',
      url: "/chealth/background/login/getLoginUserInfo",
      dataType:'json',
      success:function(res){
        if(res.success === "true") {

        }
        else {
          location.hash = "/login";
          sessionStorage.removeItem("userInfo")
        }
      },
      error:function(){
      }
    });
  }
}

export default UserInfo;