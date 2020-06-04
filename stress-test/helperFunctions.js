const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  const id = Faker.random.number(1000000);

  userContext.vars.id = id;

  return done();
}

module.exports = {
  generateRandomData,
};
