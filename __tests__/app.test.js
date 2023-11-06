const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Route does not exist", () => {
  test('GET 404 responds with error message "Path not found!"', () => {
    return request(app)
      .get("/api/notAValidPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
});

describe("POST /api/users", () => {
  test("returns 201 status code and sends back the user details and has the next sequential user_id", () => {
    const newUser = {
      phone_number: "8901234",
      first_name: "Michael",
      surname: "Lewis",
      is_elder: false,
      postcode: "M8 8HH",
      avatar_url: "https://example.com/avatars/michaellewis.jpg",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.newUser).toMatchObject(newUser);
      });
  });
  test("returns 400 if request body is missing required fields", () => {
    const newUser = {
      phone_number: "8901234",
      surname: "Lewis",
      postcode: "M8 8HH",
      avatar_url: "https://example.com/avatars/michaellewis.jpg",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("returns 400 if request body does not include the relevant fields", () => {
    const newUser = {
      email: "test.user@outlook.com",
      pet_name: "Lewis",
      city: "Manchester",
      image_url: "https://example.com/avatars/michaellewis.jpg",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe.only("PATCH /api/users/:user_id", () => {
  test("returns 200 status code and sends back the user object with updated details", () => {
    const patchUser = { phone_number: "07950487263" };
    return request(app)
      .patch("/api/users/2")
      .send(patchUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedUser).toMatchObject({
          phone_number: "07950487263",
          first_name: "Jane",
          surname: "Smith",
          is_elder: false,
          postcode: "M2 2BB",
          avatar_url: "https://example.com/avatars/janesmith.jpg",
        });
      });
  });
  test("returns 200 status code and sends back the user object with updated details when user tries to patch more than 1 detail", () => {});
});
