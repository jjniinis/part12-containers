db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('blogs');
db.createCollection('users');

db.users.insert({ username: 'tester', name: 'Testy Tester', passwordHash: "$2b$10$mbAvFTbU8ew39g3J7T3u1OswebkyZO.myQTSrE6cBudFzCrJgLPVy" });
db.users.insert({ username: 'juha', name: 'Juha N', passwordHash: "$2b$10$OJFgrtnMcxsyLX855M786ujSEALzt7YClOelsWOkwj1iecwocsDsa" });