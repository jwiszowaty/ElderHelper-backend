const { app } = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  it("returns status code 200 with contents of endpoints.json as object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.endpoints).toBe("object");
        expect(response.body.endpoints.hasOwnProperty("GET /api")).toBe(true);
        expect(response.body.endpoints.hasOwnProperty("GET /api/jobs")).toBe(
          true
        );
        expect(
          response.body.endpoints.hasOwnProperty("GET /api/jobs/:job_id")
        ).toBe(true);
      });
  });
});

describe("GET /api/jobs", () => {
  it("returns status code 200 and array of job objects", () => {
    return request(app)
      .get("/api/jobs")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(6);
        response.body.forEach((job) => {
          const requiredKeys = [
            "job_id",
            "job_title",
            "job_desc",
            "posted_date",
            "expiry_date",
            "elder_id",
            "helper_id",
            "status_id",
            "postcode",
          ];
          expect(Object.getOwnPropertyNames(job)).toEqual(requiredKeys);
        });
      });
  });
});

describe("POST /api/jobs", () => {
  it("returns status code 201 and new job when passed valid job", () => {
    const newJob = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      posted_date: "2023-11-06",
      expiry_date: "2023-11-10",
      elder_id: 1,
      postcode: "M1 6JB",
    };
    return request(app).post("/api/jobs").send(newJob).expect(201);
  });
  it("should return job object with relevant properties", () => {
    const newJob = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      posted_date: "2023-11-06",
      expiry_date: "2023-11-10",
      elder_id: 2,
      postcode: "M1 6JB",
    };
    return request(app)
      .post("/api/jobs")
      .send(newJob)
      .then(({ body }) => {
        expect(body.job.job_title).toBe("Amazing new job");
        expect(body.job.job_desc).toBe("Do it for me");
        const requiredKeys = [
          "job_id",
          "job_title",
          "job_desc",
          "posted_date",
          "expiry_date",
          "elder_id",
          "helper_id",
          "status_id",
          "postcode",
        ];
        expect(Object.getOwnPropertyNames(body.job)).toEqual(requiredKeys);
      });
  });
  it("should auto assign helper_id = 1 (dummy user) and status_id 1 (requested) when posting new request", () => {
    const newJob = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      posted_date: "2023-11-06",
      expiry_date: "2023-11-10",
      elder_id: 2,
      postcode: "M1 6JB",
    };
    return request(app)
      .post("/api/jobs")
      .send(newJob)
      .then(({ body }) => {
        expect(body.job.helper_id).toBe(1);
        expect(body.job.status_id).toBe(1);
      });
  });
  it("should return 400 error when passed object with invalid elder_id", () => {
    const newJob = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      posted_date: "2023-11-06",
      expiry_date: "2023-11-10",
      elder_id: "jeff",
    };
    return request(app).post("/api/jobs").send(newJob).expect(400);
  });
});

describe("GET /api/jobs/:job_id", () => {
  it("returns status code 200 and array containing single job object", () => {
    return request(app)
      .get("/api/jobs/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.job.length).toBe(1);
        const requiredKeys = [
          "job_id",
          "job_title",
          "job_desc",
          "posted_date",
          "expiry_date",
          "elder_id",
          "helper_id",
          "status_id",
          "postcode",
        ];
        expect(Object.getOwnPropertyNames(body.job[0])).toEqual(requiredKeys);
      });
  });
  it("returns status code 404 when passed nonexistent job id", () => {
    return request(app)
      .get("/api/jobs/99")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("job not found");
      });
  });
  it("returns status code 400 when passed invalid job id", () => {
    return request(app)
      .get("/api/jobs/abc")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("bad request");
      });
  });
});

describe("PATCH /api/jobs/:job_id", () => {
  it("returns status code 200 and array containing single updated job object", () => {
    const toUpdate = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      expiry_date: "2023-11-12",
    };
    return request(app)
      .patch("/api/jobs/1")
      .send(toUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.job.job_title).toBe("Amazing new job");
        expect(body.job.job_desc).toBe("Do it for me");
        const requiredKeys = [
          "job_id",
          "job_title",
          "job_desc",
          "posted_date",
          "expiry_date",
          "elder_id",
          "helper_id",
          "status_id",
          "postcode",
        ];
        expect(Object.getOwnPropertyNames(body.job)).toEqual(requiredKeys);
      });
  });
  it("returns status code 404 when passed nonexistent job id", () => {
    const toUpdate = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      expiry_date: "2023-11-12",
    };
    return request(app)
      .patch("/api/jobs/999")
      .send(toUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("job not found");
      });
  });
  it("returns status code 400 when passed invalid job id", () => {
    const toUpdate = {
      job_title: "Amazing new job",
      job_desc: "Do it for me",
      expiry_date: "2023-11-12",
    };
    return request(app)
      .patch("/api/jobs/abc")
      .send(toUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("bad request");
      });
  });
});

describe("Deleting jobs from the board", () => {
  test("DELETE responds with 204 status code", () => {
    return request(app).delete("/api/jobs/1").expect(204);
  });
  test("400: returns error when string type id is passed", () => {
    return request(app)
      .delete(`/api/jobs/NOTANUMBER`)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });

  test("404: returns error when comment_id does not exist", () => {
    return request(app)
      .delete(`/api/jobs/99999`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("job not found");
      });
  });
});

describe("Deleting jobs from the board", () => {
  test("DELETE responds with 204 status code", () => {
    return request(app).delete("/api/jobs/1").expect(204);
  });
  test("400: returns error when string type id is passed", () => {
    return request(app)
      .delete(`/api/jobs/NOTANUMBER`)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404: returns error when comment_id does not exist", () => {
    return request(app)
      .delete(`/api/jobs/99999`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("job not found");
      });
  });
});

describe("GET jobs by elder id", () => {
  test("GET 200 responds jobs the elder has posted", () => {
    return request(app)
      .get("/api/jobs/elder/5")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(2);
      });
  });

  test("GET 200 responds with empty array if elder has no jobs posted", () => {
    return request(app)
      .get("/api/jobs/elder/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });

  test("404: returns error when job_id does not exist", () => {
    return request(app)
      .delete(`/api/jobs/99999`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("job not found");
      });
  });

  test("GET 404 responds with error message when valid but non existent id is passed", () => {
    return request(app)
      .get("/api/jobs/elder/59127")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User does not exist");
      });
  });
  test("GET 404 responds with error message when invalid id is passed", () => {
    return request(app)
      .get("/api/jobs/elder/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
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
      profile_msg: "Hello, my name is Jane",
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
          profile_msg: "Hello, my name is Jane",
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
  test("PATCH: returns 404 status code if tries to edit a user with a user_id that does not exist", () => {
    const patchUser = {
      phone_number: "07950487263",
      first_name: "Jane",
      surname: "Smithers",
      is_elder: false,
      postcode: "M2 2CT",
      avatar_url: "https://example.com/avatars/janesmith.jpg",
      profile_msg: "Hello, my name is Jane",
    };
    return request(app)
      .patch("/api/users/220")
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
});

describe("GET /api/users/:user_id/:status should get all of a helper users accepted jobs, it will get all the jobs for a particular user filtered by the status", () => {
  test("GET 200 will return an array of job objects if the user is a helper and the job status is accepted", () => {
    return request(app)
      .get("/api/users/6/accepted")
      .expect(200)
      .then(({ body }) => {
        expect(body.acceptedJobs).hasOwnProperty("posted_date");
        expect(body.acceptedJobs).hasOwnProperty("expiry_date");
        expect(body.acceptedJobs).toMatchObject([
          {
            job_title: "Companionship",
            job_desc:
              "Looking for someone to keep me company and chat with me in the evenings.",
            elder_id: 3,
            helper_id: 6,
            status_id: 2,
          },
        ]);
      });
  });
  test("GET returns a 404 if trying to retrieve jobs from an id that does not exist", () => {
    return request(app)
      .get("/api/users/77/accepted")
      .send()
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe(
          "there is no user_id with jobs of this status"
        );
      });
  });
  test("GET returns a 400 if trying to retrieve jobs from an id that is not valid", () => {
    return request(app)
      .get("/api/users/not-an-id/accepted")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("GET returns a 404 if trying to retrieve jobs with an invalid status", () => {
    return request(app)
      .get("/api/users/7/confirmed")
      .send()
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found!");
      });
  });
  test("GET returns a 404 if trying to retrieve jobs when there are no jobs with that status", () => {
    return request(app)
      .get("/api/users/2/requested")
      .send()
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe(
          "there is no user_id with jobs of this status"
        );
      });
  });
});

describe("PATCH /api/:job_id updates status when elder or helper changes it to completed", () => {
  test("PATCH returns 200 and updated job object when helper or elder changes status to completed", () => {
    const patchStatus = { status_id: 3 };
    return request(app)
      .patch("/api/1")
      .send(patchStatus)
      .expect(200)
      .then(({ body }) => {
        expect(body.completedJob).toMatchObject({
          job_title: "Companionship",
          job_desc:
            "Looking for someone to keep me company and chat with me in the evenings.",
          elder_id: 3,
          helper_id: 6,
          status_id: 3,
        });
      });
  });
  test("PATCH returns 404 and an error message for an invalid job ID", () => {
    const patchStatus = { status_id: 3 };
    return request(app)
      .patch("/api/invalid-job-id")
      .send(patchStatus)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("job not found!");
      });
  });
  test("PATCH returns 404 and an error message for a valid but non-existent job Id", () => {
    const patchStatus = { status_id: 3 };
    return request(app)
      .patch("/api/9999")
      .send(patchStatus)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("job does not exist!");
      });
  });

  test("PATCH returns 400 and an error message for a body missing the required fields", () => {
    const patchStatus = {};
    return request(app)
      .patch("/api/1")
      .send(patchStatus)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("PATCH returns 400 and an error message for a non-existent status_id", () => {
    const patchStatus = { status_id: 9999 };
    return request(app)
      .patch("/api/1")
      .send(patchStatus)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("GET /api/users/:phone_number to check if a user exists for logging in", () => {
  test("GET: will return a 200 and a user object if the phone number exists in the db", () => {
    return request(app)
      .get("/api/users/1234567")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          phone_number: "1234567",
          first_name: "John",
          surname: "Doe",
          is_elder: true,
          postcode: "M1 1AA",
          avatar_url: "https://example.com/avatars/johndoe.jpg",
          profile_msg: "Looking for help with gardening.",
        });
      });
  });
  test("GET: will return a 404 and a not found message if valid phone number submitted but does not exist ", () => {
    return request(app)
      .get("/api/users/1245677")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("user does not exist");
      });
  });
  test("GET: will return a 400 and a bad request if invalid phone number submitted", () => {
    return request(app)
      .get("/api/users/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("not a valid phone number");
      });
  });
});

describe("GET /api/jobs?postcode=", () => {
  it("returns jobs with queried postcode", () => {
    return request(app)
      .get("/api/jobs?postcode=M4")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
  it("returns empty array when queried postcode with no jobs", () => {
    return request(app)
      .get("/api/jobs?postcode=M99")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
});

describe("GET /api/users", () => {
  it("returns all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
});

describe("GET /api/messages/:elder_id?chatroom=", () => {
  it("returns a filtered list of chats sorted by chat_id from lowest to highest", () => {
    return request(app)
      .get("/api/messages/4?chatroom=1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toHaveLength(5);
        expect(body).toBeSorted({ key: body.message_id });
      });
  });
});
