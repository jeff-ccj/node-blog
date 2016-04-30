//弹窗
var popup = {

    modal: function (option) {

        option = option || {}

        options = {
            title: option.title || '弹出层'
            , body: option.body || '提示信息'
            , submitTxt: option.submitTxt || '确定'
            , cancelTxt: option.cancelTxt || '取消'
            , submitFn: option.submitCallBack || function () {}
            , cancelFn: option.cancelCallBack || function () {}
        }

        var modalId = 'modal' + +new Date()
            , tpl = '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog">'
            + '<div class="modal-content"><div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
            + '<h4 class="modal-title" id="myModalLabel">' + options.title + '</h4>'
            + '</div>'
            + '<div class="modal-body">' + options.body + '</div>'
            + '<div class="modal-footer">'
            + '<button type="button" id="cancelBtn" class="btn btn-default" data-dismiss="modal">' + options.cancelTxt + '</button>'
            + '<button type="button" id="submitBtn" class="btn btn-primary">' + options.submitTxt + '</button>'
            + '</div></div></div></div>'
            , $modal

        $('body').append(tpl)

        $modal = $('#' + modalId)

        $modal.on('click', '#cancelBtn', function () {
            options.cancelFn()
        })

        $modal.on('click', '#submitBtn', function () {
            options.submitFn($modal)
        })

        $modal.on(
            'hidden.bs.modal'
            , function(){
                $modal.remove()
            }
        )

        $modal.modal('show');

        return $modal
    }

}


//用户相关函数
var user = {
    login: function (uName, psw) {
        $.ajax({

            type: 'POST',

            url: '/login',

            data: {
                username: uName
                , password: psw
            },

            success: function (data) {

                if(!data.success){

                    popup.modal({
                        title : '提示'
                        , body : data.msg
                        , submitCallBack: function (body) {
                            body.modal('hide');
                        }
                    })
                    return
                }

                //回到首页
                location.href = '/'

            },

            dataType: 'json'

        });
    }

    , logout: function () {


        $.ajax({

            type: 'POST'

            , url: '/logout'

            , data: {}

            , success: function (data) {

                location.reload()

            },

            dataType: 'json'

        });

    }

    , sendBlog: function (_id) {

        var tpl = '<div><div class="form-group">'
            + '<label for="blogTxt">请输入需要发布内容</label>'
            + '<input type="text" class="form-control" id="blogTitle" placeholder="请输入内容">'
            + '</div>'
            + '</div>'
            , $thisTitle


        popup.modal({
            title: _id ? '修改微博' : '发微博'
            , submitTxt: '提交'
            , body: tpl
            , submitCallBack: function (body) {

                var sBlogTitle = $('#blogTitle').val()

                if (!sBlogTitle) {
                    alert('标题不能为空')
                    return
                }

                if(_id){


                    //修改
                    $.ajax({

                        type: 'POST'

                        , url: '/editBlog'

                        , data: {
                            id: _id
                            , title: sBlogTitle
                        }

                        , success: function (data) {

                            body.modal('hide');

                            if(data.success){
                                popup.modal({
                                    title: '提示'
                                    , body: '修改成功'
                                    , submitCallBack: function (body) {
                                        body.modal('hide');
                                    }
                                })

                                var oData = data.json
                                $thisTitle.text(oData.title)

                            }else {
                                popup.modal({
                                    title: '警告'
                                    , body: data.data.errmsg
                                    , submitCallBack: function (body) {
                                        body.modal('hide');
                                    }
                                })
                            }


                        },

                        dataType: 'json'

                    });



                }else {


                    $.ajax({

                        type: 'POST'

                        , url: '/sendBlog'

                        , data: {
                            title: sBlogTitle
                        }

                        , success: function (data) {

                            body.modal('hide');

                            if(data.success){
                                popup.modal({
                                    title: '提示'
                                    , body: '发布成功'
                                    , submitCallBack: function (body) {
                                        body.modal('hide');
                                    }
                                })

                                if(data.json){

                                    var oData = data.json

                                    $('#blog').prepend(
                                        '<div class="blogList col-xs-12 col-sm-6"><div class="media"><div class="media-left">' +
                                        '<a href="#"><img class="media-object" alt="图片" src="..."></a></div>' +
                                        '<div class="media-body"><h4 class="media-heading"><a href="/user/ggjhhgj">' + oData.name + '</a><span>说</span></h4>' +
                                        '<div>' + oData.time.minute + '</div>' +
                                        '<div class="blogTitle"> ' + oData.title + '</div>' +
                                        '</div></div></div>'
                                    )


                                }

                            }else {
                                popup.modal({
                                    title: '警告'
                                    , body: data.data.errmsg
                                    , submitCallBack: function (body) {
                                        body.modal('hide');
                                    }
                                })
                            }


                        },

                        dataType: 'json'

                    });

                }
            }

        })


        if(_id){
            $thisTitle = $('#'+_id).find('.blogTitle')
            $('#blogTitle').val($thisTitle.text())
        }

    }
}


$('#logout').on('click', function (event) {

    event.preventDefault()

    popup.modal({
        title: '提示'
        , body: '确定登出吗?'
        , submitCallBack: function (body) {
            user.logout()
            body.modal('hide');
        }
    })

})


$('#sendBlog').on('click', function (event) {

    event.preventDefault()

    user.sendBlog()

})


$('.editBlog').on('click', function (event) {

    event.preventDefault()

    var $this = $(this)
        , iThisId = $this.parents('.blogList')[0].id

    user.sendBlog(iThisId)

})


$('.deleteBlog').on('click', function (event) {

    event.preventDefault()

    var $this = $(this)
        , iThisId = $this.parents('.blogList')[0].id

    popup.modal({
        title: '删除微博'
        , submitTxt: '确定'
        , body: '是否确定删除?'
        , submitCallBack: function (body) {

            $.ajax({

                type: 'POST'

                , url: '/deleteBlog'

                , data: {
                    id: iThisId
                }

                , success: function (data) {

                    body.modal('hide');

                    if(data.success){

                        popup.modal({
                            title: '提示'
                            , body: '删除成功'
                            , submitCallBack: function (body) {
                                body.modal('hide');
                            }
                        })

                        $('#' + iThisId).remove()

                    }else {
                        popup.modal({
                            title: '警告'
                            , body: data.data.errmsg
                            , submitCallBack: function (body) {
                                body.modal('hide');
                            }
                        })
                    }


                },

                dataType: 'json'

            });

        }
    })


})
