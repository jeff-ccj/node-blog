/*
 * @class   博客相关操作
 * @author  Jeff Tsui
 * @date    16.05.05
 * @mail    jeff.ccjie@gmail.com
 */

var mongodb = require('./db')
    , ObjectID = require('mongodb').ObjectID

/**
 * 实例化函数传参
 * @param name 用户名
 * @param title 标题
 * @param tags 标签
 * @param content 内容
 */
function Blog(name, title, tags, content) {
    this.name = name
    this.title = title
    this.tags = tags
    this.content = content
}

//暴露接口
module.exports = Blog


/**
 * 提交一篇博客
 * @param callback(err,data) 回调函数
 */
Blog.prototype.save = function(callback) {

    var date = new Date()

    //存储各种时间格式，方便以后扩展
    var time = {
        date: date
        , year : date.getFullYear()
        , month : date.getFullYear() + "-" + (date.getMonth() + 1)
        , day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        , minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }

    //要存入数据库的文档
    var blogData = {
        name: this.name
        , time: time
        , title: this.title
        , tags: this.tags
        , content: this.content
        , comments: []
        , reprint_info: {}
        , pv: 0
    }

    mongodb.save('blogs', blogData, function(err, blogList) {

        if (err) {
            return callback(err)
        }

        callback(null, blogList)
    })

}


/**
 * 获取博客列表
 * @param name 用户名
 * @param pageParam 分页参数
 * @param pageParam.page 页码
 * @param pageParam.size 一页多少篇
 * @param callback(err,data) 回调函数
 */
Blog.getPage = function(name, pageParam, callback){

    var page = pageParam.page
        , pageSize = pageParam.size
        , params = {}

    if (name) {
        params.name = name
    }
    
    mongodb.count('blogs', params , function(err, total) {

        if(total == 0){
            return callback(err)
        }

        var options = {
            jData: "title time name"
            , sort: {time: -1}
            , limit: 10
            , skip: (page - 1) * pageSize
        }

        mongodb.where('blogs', params , options, function(err, docs) {

            if (err) {
                return callback(err)
            }

            return callback(null, docs, total)

        })

    })

}


/**
 * 修改内容
 * @param id 博客id
 * @param updateField [Object] 修改数据
 * @param callback(err,data) 回调函数
 */
Blog.edit = function(id, updateField, callback) {

    var param = {
        '_id' : ObjectID(id),
    }

    mongodb.update('blogs', param , updateField, function(err, data) {

        if (err) {
            return callback(err)
        }

        return callback(null, data)

    })


}


/**
 * 删除博客
 * @param id 博客id
 * @param callback(err,data) 回调函数
 */
Blog.delete = function(id, callback) {

    var param = {
        '_id' : ObjectID(id),
    }

    mongodb.remove('blogs', param , function(err, data) {

        if (err) {
            return callback(err)
        }

        return callback(null, data)

    })


}