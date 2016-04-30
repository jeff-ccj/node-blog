var Blog = require('../models/blog.js')
var paginate = require('../models/paginate.js')

var blog = {

    get: function (res, uName, url, page, size) {

        var size = size || 10
            , page = page || 1

        var blogData = Blog.getPage(
            uName
            , {
                page: page
                , size: size
            }
            , function (err, data, count) {

                return res.render('user', {
                    title: uName + '的微博'
                    , uName: uName
                    , blogs: data
                    , pages: paginate({
                        nowPage: page
                        , size: size
                        , count: count
                        , url: url
                    })
                });

            }
        )


    }

    , send: function (req, res, next) {

        var currentUser = req.session.user;
        var blog = new Blog(currentUser.name, req.body.title);

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

    , edit: function (req, res, next) {

        var iId = req.body.id
            , json = {
            title: req.body.title
        }

        Blog.edit(iId, json, function (err) {

            if (err) {
                return res.json({
                    success: 0
                    , data: err
                });
            }

            return res.json({
                success: 1
                , msg: '修改成功'
                , json: json
            });

        });
    }

}


module.exports = blog;


