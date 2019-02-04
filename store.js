const knex = require('knex')(require('./knexfile'));

module.exports = {
  blogList: function () {
    return knex.raw('select blogName as blog, count(blogName) as count from blogs group by blogName order by count desc limit 5');
  },
  insertBlog: function (blogName) {
    knex('blogs').insert({ blogName: blogName }).then(function (result) {
      console.log(result);
    });
  }
};