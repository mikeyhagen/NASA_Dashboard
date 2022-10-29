const request = require('supertest');
const app = require('../../app');
describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launch', () => {
  const completeLaunchData = {
    mission: 'test mission',
    rocket: 'test rocket',
    target: 'test target',
    launchDate: 'March 5, 1994',
  };
  const launchDataWithoutDate = {
    mission: 'test mission',
    rocket: 'test rocket',
    target: 'test target',
  };
  const launchDataWithBadDate = {
    mission: 'test mission',
    rocket: 'test rocket',
    target: 'test target',
    launchDate: 'March 100, 1994',
  };
  test('It should respond with 201 success', async () => {
    const response = await request(app)
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });
  test('It should catch missing required properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });
  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithBadDate)
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).toStrictEqual({ error: 'date is invalid' });
  });
});
