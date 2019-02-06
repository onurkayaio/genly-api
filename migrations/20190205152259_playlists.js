exports.up = function (knex, Promise) {
  return knex.schema.createTable('playlists', function (t) {
    t.increments('id').primary();
    t.string('playlistId').notNullable();
    t.string('blogName').notNullable();
    t.string('cover').notNullable();
    t.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('playlists');
};
