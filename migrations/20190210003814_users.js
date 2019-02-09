exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.increments('id').primary();
    t.string('username').notNullable();
    t.string('email').notNullable();
    t.string('profileUrl').notNullable();
    t.string('profileImage').notNullable();
    t.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
