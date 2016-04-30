var crypto = require('crypto')
var User = require('../models/user.js')
var Blog = require('../models/blog.js')
var paginate = require('../models/paginate.js')

/*
 @class  路由
 @param  {Object}  [express对象]
 @author 崔承杰
 @date 16.04.16
 */
var routes = function (app) {

    //app.get('*', function (req, res, next) {
    //
    //
    //});


    app.get(/\/(\d+)|(\/$)/, function (req, res, next) {

        var size = 10
            , iPage = req.params[0] || 1

        Blog.getPage(
            ''
            , {
                page: iPage
                , size: size
            }
            , function(err, data, count){

                if(data.length > 0){
                    return res.render('user', {
                        title: '首页'
                        , blogs: data
                        , pages: paginate({
                            nowPage: iPage
                            , size: size
                            , count: count
                            , url: ''
                        })
                    });
                }else {
                    //404
                    next()
                }

            }
        )


    });

    //app.use('/reg', require('./routes/people').people);


    var blog = require('./blog.js')

    app.post('/sendBlog', blog.send);
    app.post('/editBlog', blog.edit);



    app.get('/user/:name/:page?', function(req, res, next){

        var uName = req.params.name
            , iPage = req.params.page || 1

        blog.get(res, uName, '/user/' + uName, iPage)

    });

    //app.get(['/user', '/user/:page'], function(req, res, next){
    //
    //    if( !req.session.user){
    //        res.redirect('/');
    //        return
    //    }
    //
    //    var uName = req.session.user.name
    //        , iPage = req.params.page || 1
    //
    //    console.log(req.session.user.name)
    //
    //    return blog.get(res, uName, '/user/', iPage)
    //
    //});











    app.get('/reg', function (req, res) {
            res.render('reg', {
                title: '用户注册'
            });
        })
        .post('/reg', function (req, res, next) {

            var md5 = crypto.createHash('md5')
                , password = md5.update(req.body.password).digest('base64');

            var newUser = new User({
                name: req.body.username
                , password: password
            });

            User.get( newUser.name, function(err, user){

                if (user){
                    return res.json({
                        success: 0
                        , msg: '用户名已注册'
                    });
                }

                newUser.save(function(err) {

                    if (err) {
                        return res.json({
                            success: 0
                            , msg: err
                        });
                    }

                    req.session.user = newUser;

                    return res.json({
                        success: 1
                        , msg: newUser.name + '注册成功'
                        , name: newUser.name
                    });


                });

            })

        });

    //登陆
    app.get('/login', function (req, res) {
            res.render('login', {
                title: '用户登陆'
            });
        })
        .post('/login', function (req, res, next) {

            var md5 = crypto.createHash('md5')
                , password = md5.update(req.body.password).digest('base64');

            User.get( req.body.username, function(err, user){

                if (!user){

                    return res.json({
                        success: 0
                        , msg: '用户不存在'
                    });

                }

                if(user.password != password){

                    return res.json({
                        success: 0
                        , msg: '用户密码错误'
                    });

                }

                req.session.user = user;

                return res.json({
                    success: 1
                    , msg: '登陆成功'
                    , id: user.id
                });



            })

        });


    app.post('/logout', function (req, res) {

        req.session.user = null;

        return res.json({
            success: 1
            , msg: '登出成功'
        });

    });



    app.use(function (req, res) {
        //res.render("404");
        res.send("404");
    });


}


module.exports = routes