$(function () {

    $('#reg').on('click', function () {

        var sUserName = $('#username').val()
            , sPsw = $('#password').val()
            , sRePsw = $('#passwordRepeat').val()

        if (!sPsw || !sUserName) {
            popup.alert({
                title: '提示'
                , body: '账号或密码不能为空'
            })
            return
        }

        if (sPsw != sRePsw) {

            popup.alert({
                title: '提示'
                , body: '两次输入密码不相同'
            })
            return

        }

        $.ajax({

            type: 'POST',

            url: '/reg',

            data: {
                username: sUserName
                , password: sPsw
            },

            success: function (data) {

                var cbFn = function(){}

                if (data.success) {

                    cbFn = function(){
                        location.href = '/'
                    }

                }

                popup.alert({
                    title: '提示'
                    , body: data.msg
                    , cancelCallBack: cbFn
                })

            },

            dataType: 'json'

        });


    })



})

