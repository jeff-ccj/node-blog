//弹窗
var popup = {

    modal: function (option) {

        option = option || {}

        var options = {
            id: option.id || !1
            , width: option.width || 800
            , title: option.title || '弹出层'
            , body: option.body || '提示信息'
            , submitTxt: option.submitTxt || '确定'
            , cancelTxt: option.cancelTxt || '取消'
            , onloadFn: option.loadBodyFn || function () {
            }
            , submitFn: option.submitCallBack || function () {
            }
            , cancelFn: option.cancelCallBack || function () {
            }
        }

        var modalId = !options.id && 'modal' + +new Date() || options.id
            , $modal = $('#' + modalId)


        //假如有ID,无数量
        if ($modal.length < 1) {

            var tpl = '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog">'
                + '<div class="modal-content"><div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
                + '<h4 class="modal-title" id="myModalLabel">' + options.title + '</h4>'
                + '</div>'
                + '<div class="modal-body">' + options.body + '</div>'
                + '<div class="modal-footer">'
                + '<button type="button" id="cancelBtn" class="btn btn-default" data-dismiss="modal">' + options.cancelTxt + '</button>'
                + '<button type="button" id="submitBtn" class="btn btn-primary">' + options.submitTxt + '</button>'
                + '</div></div></div></div>'


            $('body').append(tpl)

            $modal = $('#' + modalId)

            $modal.on('click', '#cancelBtn', function () {
                options.cancelFn()
            })

            $modal.on('click', '#submitBtn', function () {
                options.submitFn($modal)
            })

        } else {

            //否则
            $modal = $('#' + options.id)

        }

        options.onloadFn($modal)

        $modal.find('.modal-dialog').css({
            width: options.width
        })


        //$modal.on(
        //    'hidden.bs.modal'
        //    , function () {
        //        $modal.remove()
        //    }
        //)

        $modal.modal('show')

        return $modal
    }

    ,alert: function(option) {

        option = option || {}

        var options = {
            width: option.width || 600
            , title: option.title || '弹出层'
            , body: option.body || '提示信息'
            , cancelTxt: option.cancelTxt || '确定'
            , cancelFn: option.cancelCallBack || function () {
            }
        }
            , modalId = 'alert' + +new Date()
            , tpl = '<div id="' + modalId +'" class="alert fade">' +
            '<div class="alertTitle">' + options.title + '</div>' +
            '<div class="alertContent">' + options.body + '</div>' +
            '<a href="#" class="btn btn-primary alertBtn" data-dismiss="alert">' + options.cancelTxt + '</a>' +
            '</div>'
            , $modal

        $('body').append(
            tpl
        )

        $modal = $('#' + modalId)

        setTimeout(function(){
            $modal.addClass('in')
        }, 100)

        $modal.on(
            'closed.bs.alert'
            , function () {
                options.cancelFn()
            }
        )

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

                    popup.alert({
                        title : '提示'
                        , body : data.msg
                    })
                    return
                }

                //回到首页
                location.href = '/'

            },

            dataType: 'json'

        })
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

        })

    }

    , sendBlog: function (_id) {

        var tpl = '<div class="form-group">'
            + '<label for="blogTxt">请输入需要发布内容</label>'
            + '<div class="row">'
            + '<div class="col-md-2">'
            + '<div class="uploadImg" id="uploadImg">'
            + '<span id="uploadImgTips">上传封面图</span>'
            + '<input type="file" class="inputFile" id="inputFile"></div>'
            + '</div><div class="col-md-9">'
            + '<input type="text" class="form-control" id="blogTitle" placeholder="请输入内容">'
            + '<input type="text" class="form-control" id="blogTags" placeholder="请输入标签(多个可用逗号,隔开">'
            + '</div></div>'
            + '<div id="blogContent"></div>'
            + '</div>'
            , $thisTitle
            , $thisContent
            , $thisTags
            , $thisThumbPic

        popup.modal({
            id: 'blogToolBox'
            , title: _id ? '修改微博' : '发微博'
            , submitTxt: '提交'
            , body: tpl
            , loadBodyFn: function ($body) {

                $('#blogContent').summernote({

                    height: 200
                    , onImageUpload: function (files, editor, $editable) {
                        console.log('image upload:', files, editor, $editable)
                        //sendFile(files[0], editor, $editable)
                        //$('#summernote').summernote('editor.insertImage', "图片的url");
                    }

                })

                //如果是修改,初始化数据
                if (_id) {

                    //设置内容
                    $thisTitle = $('.title')
                    $thisContent = $('.contentBox')
                    $thisTags = $('.tags')
                    $thisThumbPic = $('.info')
                    $('#blogTitle').val($thisTitle.text())
                    $('#blogTags').val($thisTags.text())
                    $('#blogContent').summernote(
                        'code', $thisContent.html() || '<br>'
                    )
                    var sThumbPic = $thisThumbPic.data('thumb')
                    if(sThumbPic){

                        $('#uploadImgTips').after(
                            '<img id="uploadForImg" src="' + sThumbPic + '">'
                        ).remove()

                    }

                }else {

                    //否则清空数据
                    $body.find('input').val('')
                    $('#blogContent').summernote(
                        'code', '<br>'
                    )

                }


            }
            , submitCallBack: function (body) {

                var sBlogTitle = $('#blogTitle').val()
                    , sBlogTags = $('#blogTags').val()
                    , sBlogContent = $('#blogContent').summernote('code')
                    , sImgSrc = $('#uploadForImg').attr('src')
                    , isBaseData = new RegExp(/^data:image/)

                if (!sBlogTitle) {

                    popup.alert({
                        title: '提示'
                        , body: '标题不能为空'
                    })
                    return
                }


                //判断图片是否base64格式,如果是,则先上传
                if(isBaseData.test(sImgSrc)){

                    $.ajax({

                        type: 'POST'

                        , url: '/upload/image'

                        , data: {

                            pic: sImgSrc

                        }

                        , success: function (data) {

                            sImgSrc = data.data.url
                            blogEdit()

                        },

                        dataType: 'json'

                    })


                }else {

                    blogEdit()

                }

                function blogEdit(){
                    if(_id){

                        //修改
                        $.ajax({

                            type: 'PUT'

                            , url: '/blog'

                            , data: {
                                id: _id
                                , title: sBlogTitle
                                , tags: sBlogTags
                                , content: sBlogContent
                                , thumbPic: sImgSrc
                            }

                            , success: function (data) {

                                body.modal('hide')

                                if(data.success){
                                    popup.alert({
                                        title: '提示'
                                        , body: '修改成功'
                                    })

                                    var oData = data.json

                                    //修改后数据重设
                                    $thisTitle.text(oData.title)
                                    $thisTags.text(oData.tags)
                                    $thisContent.html(oData.content)
                                    $thisThumbPic.attr('thumb', oData.thumbPic)

                                }else {
                                    popup.alert({
                                        title: '警告'
                                        , body: data.data.errmsg
                                    })
                                }


                            },

                            dataType: 'json'

                        })



                    }else {

                        $.ajax({

                            type: 'POST'

                            , url: '/blog'

                            , data: {
                                title: sBlogTitle
                                , tags: sBlogTags
                                , content: sBlogContent
                                , thumbPic: sImgSrc
                            }

                            , success: function (data) {

                                body.modal('hide')

                                if(data.success){
                                    popup.alert({
                                        title: '提示'
                                        , body: '发布成功'
                                    })

                                    if(data.json){

                                        var oData = data.json
                                            , blogImg = ''

                                        if(oData.thumbPic) {
                                            blogImg = '<div class="media-left"><a href="/blog/' + oData._id + '"><img class="media-object" alt="图片" src="' + oData.thumbPic +'"></a></div>'
                                        }

                                        $('#blog').prepend(

                                            '<div class="blogList col-xs-12 col-sm-6" id="' + oData._id + '"><div class="media">' +
                                            blogImg +
                                            '<div class="media-body"><h4 class="media-heading"><a class="blogTitle" href="/blog/' + oData._id + '">' + oData.title + '</a></h4>' +
                                            '<div>' + oData.time.minute + '</div>' +
                                            '<div><span>作者:</span><a href="/user/' + oData.name + '">' + oData.name + '</a></div>' +
                                            '</div></div></div>'
                                        )

                                    }

                                }else {
                                    popup.alert({
                                        title: '警告'
                                        , body: data.data.errmsg
                                    })
                                }


                            },

                            dataType: 'json'

                        })

                    }
                }
            }

        })






    }
}


$('#logout').on('click', function (event) {

    event.preventDefault()

    popup.modal({
        title: '提示'
        , body: '确定登出吗?'
        , submitCallBack: function (body) {
            user.logout()
            body.modal('hide')
        }
    })

})


$('#sendBlog').on('click', function (event) {

    event.preventDefault()

    user.sendBlog()

})


$('.editBlog').on('click', function (event) {

    event.preventDefault()


    var iThisId = location.pathname.replace('/blog/', '')

    user.sendBlog(iThisId)

})


$('.deleteBlog').on('click', function (event) {

    event.preventDefault()

    var iThisId = location.pathname.replace('/blog/', '')

    popup.modal({
        title: '删除微博'
        , submitTxt: '确定'
        , body: '是否确定删除?'
        , submitCallBack: function (body) {

            $.ajax({

                type: 'DELETE'

                , url: '/blog'

                , data: {
                    id: iThisId
                }

                , success: function (data) {

                    body.modal('hide')

                    if(data.success){

                        popup.alert({
                            title: '提示'
                            , body: '删除成功'
                        })

                        //删除成功返回首页
                        location.href = '/'

                    }else {
                        popup.alert({
                            title: '警告'
                            , body: data.data.errmsg
                        })
                    }


                },

                dataType: 'json'

            })
        }
    })

})


//图片上传监测
$(document).on('change', '#inputFile', function(){

    // 如果浏览器不支持FileReader，则不处理
    if (!window.FileReader) return

    var file = this.files[0]

    if (!file.type.match('image.*')) {

        popup.alert({
            body: '请上传图片文件'
        })
        return

    }


    var reader = new FileReader();

    reader.readAsDataURL(file)

    $(reader).load(function(){

        var $img = $('<img>', {'id': 'uploadForImg', 'src': this.result})

        $('#uploadImgTips, #uploadForImg').after($img)
            .remove()

    })

})



//单张图片上传test
//$('#inputFile').on('change', function(){
//
//    // 如果浏览器不支持FileReader，则不处理
//    if (!window.FileReader) return
//
//
//    var file = this.files[0]
//
//    if (!file.type.match('image.*')) {
//
//        popup.alert({
//            body: '请上传图片文件'
//        })
//        return
//
//    }
//
//    var reader = new FileReader();
//
//    reader.readAsDataURL(file)
//
//    $(reader).load(function(){
//
//        $.ajax({
//
//            type: 'POST'
//
//            , url: '/upload/image'
//
//            , data: {
//
//                pic: this.result
//
//            }
//
//            , success: function (data) {
//
//                console.log(data)
//
//            },
//
//            dataType: 'json'
//
//        })
//
//    })
//
//})