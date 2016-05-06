/*
 * 用户
 */
var mongodb = require('./db')
var crypto = require('crypto')

function User(user) {
    this.name = user.name
    this.password = user.password
}

module.exports = User

//存储用户信息
User.prototype.save = function(callback) {

    //要存入数据库的用户信息文档
    var user = {
        name: this.name,
        password: this.password,
    }

    mongodb.save('users', user, function(err, userInfo) {

        if (err) {
            return callback(err)
        }

        callback(null, userInfo)
    })

}

//读取用户信息
User.get = function(name, callback) {

    mongodb.findOne('users'
        , {
            name: name
        }
        , function(err, userInfo) {

            if (err) {
                return callback(err)
            }

            callback(null, userInfo)

        })

}