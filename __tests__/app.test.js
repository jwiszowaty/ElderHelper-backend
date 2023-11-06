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
})})