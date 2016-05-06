var Blog = require('../models/blog.js')
var paginate = require('../models/paginate.js')

var blog = {

    get: function (res, next, uName, url, page) {

        var size = 10
            , page = page || 1

        Blog.getPage(
            uName
            , {
                page: page
                , size: size
            }
            , function (err, data, count) {

                if(data && data.length > 0){

                    return res.render('user', {
                        title: uName ? uName + '的微博' : '首页'
                        , uName: uName
                        , blogs: data
                        , pages: paginate({
                            nowPage: page
                            , size: size
                            , count: count
                            , url: url
                        })
                    });

                }else {

                    //404
                    next()

                }


            }
        )


    }

    , send: function (res, params) {

        var blog = new Blog(params.name, params.title);

        blog.save(function (err, data) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err
                });
            }

            if (data) {
                return res.json({
                    success: 1
                    , msg: '发布成功'
                    , json: data
                });
            }

        });
    }

    , edit: function (res, id, params) {

        Blog.edit(id, params, function (err) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err
                });
            }

            return res.json({
                success: 1
                , msg: '修改成功'
                , json: params
            });

        });
    }

    , delete: function (res, id) {

        Blog.delete(id, function (err) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err
                });
            }

            return res.json({
                success: 1
                , msg: '删除成功'
            });

        });
    }

}


module.exports = blog;


