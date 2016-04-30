$(function(){

  $('#login').on('click', function(){

    var sUserName = $('#username').val()
        , sPsw = $('#password').val()

    if(!sPsw || !sUserName){
      popup.modal({
        title : '提示'
        , body : '账号或密码不能为空'
      })
      return
    }


    user.login(sUserName, sPsw)



  })

})