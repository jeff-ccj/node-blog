/*
 * 微博相关
 */
var mongodb = require('./db')
    , ObjectID = require('mongodb').ObjectID;

function Blog(name, title, tags, content) {
    this.name = name;
    this.title = title;
    this.tags = tags;
    this.content = content;
}

module.exports = Blog;

//存储一篇文章及其相关信息
Blog.prototype.save = function(callback) {

    var date = new Date();

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
    };

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err); //错误，返回 err 信息
        }

        //读取 blogs 表
        db.collection('blogs', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }

            //将文档插入 blogs 集合
            collection.insert(blogData, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, blogData);//返回 err 为 null
            });

        });
    });
};


Blog.getPage = function(name, pageParam, callback){

    //if( typeof page == 'function'){
    //    callback = page
    //    pageParam.page = 1
    //    pageParam.size = 10
    //}

    var page = pageParam.page
        , pageSize = pageParam.size

    mongodb.open(function (err, db){
        if (err) {
            mongodb.close();
            return callback(err); //错误，返回 err 信息
        }

        db.collection('blogs', function (err, collection) {

            if (err) {
                mongodb.close();
                return callback(err);
            }

            var query = {};
            if (name) {
                query.name = name;
            }

            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {

                if(total == 0){
                    return callback(err);
                }

                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (page - 1) * pageSize,
                    limit: pageSize
                }).sort({
                    time: -1
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    //console.log(docs)
                    callback(null, docs, total);
                });
            });

        })

    })

}


Blog.edit = function(id, param, callback) {
    mongodb.open(function (err, db){
        if (err) {
            mongodb.close();
            return callback(err); //错误，返回 err 信息
        }

        db.collection('blogs', function (err, collection) {

            if (err) {
                mongodb.close();
                return callback(err);
            }

            //更新文章内容
            collection.update({
                '_id' : ObjectID(id),
            }, {
                $set: param
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });

            //collection.findOne({
            //    '_id' : ObjectID(id)
            //}, {}, function (err, doc) {
            //    if (err) {
            //        mongodb.close();
            //        return callback(err);
            //    }
            //    if(doc){
            //
            //    }
            //})


        })

    })


}


Blog.delete = function(id, callback) {
    mongodb.open(function (err, db){
        if (err) {
            mongodb.close();
            return callback(err); //错误，返回 err 信息
        }

        db.collection('blogs', function (err, collection) {

            if (err) {
                mongodb.close();
                return callback(err);
            }

            //更新文章内容
            collection.remove({
                '_id' : ObjectID(id),
            }, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });

        })

    })


}