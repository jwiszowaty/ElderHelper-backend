const app = require('../app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

// beforeEach(() => {
//     return seed(data);
// })

// afterAll(() => {
//     return db.end();
// })



describe('POST /api/users', () => {
    test('returns 201 status code and sends back the user details and has the next sequential user_id', () => {
        const newUser = {
            phone_number: "8901234",
            first_name: "Michael",
            surname: "Lewis",
            is_elder: false,
            postcode: "M8 8HH",
            avatar_url: "https://example.com/avatars/michaellewis.jpg",
          }
        return request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
            expect(body.newUser).toMatchObject(newUser)
        })
    })
})