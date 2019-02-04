exports.up = function (knex, Promise) {
  return knex.schema.createTable('blogs', function (t) {
    t.increments('id').primary();
    t.string('blogName').notNullable();
    t.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('blogs');
};
