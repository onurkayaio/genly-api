const knex = require('knex')(require('./knexfile'));

module.exports = {
  blogList: function () {
    return knex.raw('select blogName as blog, count(blogName) as count from blogs group by blogName order by count desc limit 4');
  },
  insertBlog: function (blogName) {
    knex('blogs').insert({ blogName: blogName }).then(function (result) {
      console.log(result);
    });
  },
  insertPlaylist: function (playlistId, blogName, cover) {
    knex('playlists').insert({ playlistId: playlistId, blogName: blogName, cover: cover }).then(function (result) {
      console.log(result);
    });
  },
  getRecentPlaylists: function () {
    return knex.raw('select playlistId, blogName, cover from playlists order by created_at desc limit 4');
  },
  insertUser: function (username, email, profileUrl, profileImage) {
    knex('users').insert({
      username: username,
      email: email,
      profileUrl: profileUrl,
      profileImage: profileImage
    }).then(function (result) {
      console.log(result);
    });
  }
};