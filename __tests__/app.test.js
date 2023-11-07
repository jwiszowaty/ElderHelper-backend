const app = require ('../app.js');
const request = require ('supertest');
const db = require ('../db/connection.js');
const seed = require ('../db/seeds/seed.js');
const data = require ('../db/data/test-data/index.js');

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('GET /api/jobs', () => {
    it('returns status code 200 and array of job objects', () => {
        return request(app)
        .get('/api/jobs')
        .expect(200)
        .then((response) => {
            expect(response.body.length).toBe(6);
            response.body.forEach((job) => {
                const requiredKeys = ['job_id', 'job_title', 'job_desc', 'posted_date', 'expiry_date', 'elder_id', 'helper_id', 'status_id']
                expect(Object.getOwnPropertyNames(job)).toEqual(requiredKeys);
            })
        })
    })
})

describe('POST /api/jobs', () => {
    it('returns status code 201 and new job when passed valid job', () => {
        const newJob = {
        job_title:'Amazing new job',
        job_desc: 'Do it for me',
        posted_date: '2023-11-06',
        expiry_date: '2023-11-10',
        elder_id: 1};
        return request(app)
        .post('/api/jobs')
        .send(newJob)
        .expect(201)
    })
    it('should return job object with relevant properties', () => {
        const newJob = {
            job_title:'Amazing new job',
            job_desc: 'Do it for me',
            posted_date: '2023-11-06',
            expiry_date: '2023-11-10',
            elder_id: 1};
        return request(app)
        .post('/api/jobs')
        .send(newJob)
        .then(({body})=> {
            expect(body.job.job_title).toBe('Amazing new job')
            expect(body.job.job_desc).toBe('Do it for me')
            const requiredKeys = ['job_id', 'job_title', 'job_desc', 'posted_date', 'expiry_date', 'elder_id', 'helper_id', 'status_id']
            expect(Object.getOwnPropertyNames(body.job)).toEqual(requiredKeys);
        })
    })
    it('should return 400 error when passed object with invalid elder_id', () => {
        const newJob = {
            job_title:'Amazing new job',
            job_desc: 'Do it for me',
            posted_date: '2023-11-06',
            expiry_date: '2023-11-10',
            elder_id: 'jeff'}
        return request(app)
        .post('/api/jobs')
        .send(newJob)
        .expect(400)
    })
})

describe('GET /api/jobs/:job_id', () => {
    it('returns status code 200 and array containing single job object', () => {
        return request(app)
        .get('/api/jobs/1')
        .expect(200)
        .then(({body}) => {
            expect(body.job.length).toBe(1)
            const requiredKeys = ['job_id', 'job_title', 'job_desc', 'posted_date', 'expiry_date', 'elder_id', 'helper_id', 'status_id']
            expect(Object.getOwnPropertyNames(body.job[0])).toEqual(requiredKeys);
      })
    })
    it('returns status code 404 when passed nonexistent job id', () => {
    return request(app)
    .get('/api/jobs/99')
    .expect(404)
    .then((response) => {
        expect(response.body.message).toBe('job not found')
      })
    })
    it('returns status code 400 when passed invalid job id', () => {
    return request(app)
    .get('/api/jobs/abc')
    .expect(400)
    .then((response) => {
        expect(response.body.message).toBe('bad request')
      })
    })
})


describe('PATCH /api/jobs/:job_id', () => {
    it('returns status code 200 and array containing single updated job object', () => {
        const toUpdate = {
            job_title:'Amazing new job',
            job_desc: 'Do it for me',
            expiry_date: '2023-11-12'}
        return request(app)
        .patch('/api/jobs/1')
        .send(toUpdate)
        .expect(200)
        .then(({body})=> {
            expect(body.job.job_title).toBe('Amazing new job')
            expect(body.job.job_desc).toBe('Do it for me')
            const requiredKeys = ['job_id', 'job_title', 'job_desc', 'posted_date', 'expiry_date', 'elder_id', 'helper_id', 'status_id']
            expect(Object.getOwnPropertyNames(body.job)).toEqual(requiredKeys);
        })
})
    it ('returns status code 404 when passed nonexistent job id', () => {
        const toUpdate = {
            job_title:'Amazing new job',
            job_desc: 'Do it for me',
            expiry_date: '2023-11-12'}
            return request(app)
            .patch('/api/jobs/999')
            .send(toUpdate)
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe('job not found')})
    })
    it ('returns status code 400 when passed invalid job id', () => {
        const toUpdate = {
            job_title:'Amazing new job',
            job_desc: 'Do it for me',
            expiry_date: '2023-11-12'}
            return request(app)
            .patch('/api/jobs/abc')
            .send(toUpdate)
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe('bad request')})
    })
    it.only ('returns status code 400 when passed expiry date in the past', () => {
        const toUpdate = {
            job_title:'Amazing new job',
            job_desc: 'Do it for me',
            expiry_date: '2024-11-12'}
            return request(app)
            .patch('/api/jobs/1')
            .send(toUpdate)
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe('bad request')})
    })
})

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
        expect(body.message).toBe("bad request");
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
        expect(body.message).toBe("bad request");
      });
  });
});

describe("PATCH /api/users/:user_id", () => {
  test("returns 200 status code and sends back the user object with updated details", () => {
    const patchUser = {
      phone_number: "07950487263",
      first_name: "Jane",
      surname: "Smithers",
      is_elder: false,
      postcode: "M2 2CT",
      avatar_url: "https://example.com/avatars/janesmith.jpg",
    };
    return request(app)
      .patch("/api/users/2")
      .send(patchUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedUser).toMatchObject({
          phone_number: "07950487263",
          first_name: "Jane",
          surname: "Smithers",
          is_elder: false,
          postcode: "M2 2CT",
          avatar_url: "https://example.com/avatars/janesmith.jpg",
        });
      });
  });
  test("PATCH: will return a 400 status code if missing required fields in the body", () => {
    const patchUser = {};
    return request(app)
      .patch("/api/users/2")
      .send(patchUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

test("PATCH: returns 404 status code if tries to edit a user with a user_id that does not exist", () => {
  const patchUser = {
    phone_number: "07950487263",
    first_name: "Jane",
    surname: "Smithers",
    is_elder: false,
    postcode: "M2 2CT",
    avatar_url: "https://example.com/avatars/janesmith.jpg",
  };
  return request(app)
    .patch("/api/users/22")
    .send(patchUser)
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("user_id does not exist");
    });
});

test("PATCH: returns 400 status code if tries to edit a user with an invalid id", () => {
  const patchUser = {
    phone_number: "07950487263",
    first_name: "Jane",
    surname: "Smithers",
    is_elder: false,
    postcode: "M2 2CT",
    avatar_url: "https://example.com/avatars/janesmith.jpg",
  };
  return request(app)
    .patch("/api/users/not-an-id")
    .send(patchUser)
    .expect(400)
    .then(({ body }) => {
      expect(body.message).toBe("bad request");
    });
});
