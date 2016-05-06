var User = require('../models/user.js')
var session = require('express-session')

var user = {

    getRegister: function (res) {

        res.render('reg', {
            title: '用户注册'
        });

    }

    , register: function (req, res, jData) {

        var newUser = new User({
            name: jData.username
            , password: jData.password
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

    }

    , getLogin: function (res) {

        res.render('login', {
            title: '用户登陆'
        });

    }

    , login: function (req, res, jData) {

        User.get(jData.username , function(err, user){

            if (!user){

                return res.json({
                    success: 0
                    , msg: '用户不存在'
                });

            }

            if(user.password != jData.password){

                return res.json({
                    success: 0
                    , msg: '用户密码错误'
                });

            }

            //console.log(req)
            req.session.user = user
            console.log(req.session)

            return res.json({
                success: 1
                , msg: '登陆成功'
                , id: user.id
            });

        })

    }

    , logout: function (req, res) {

        req.session.user = null;

        return res.json({
            success: 1
            , msg: '登出成功'
        });

    }

}

module.exports = user;


