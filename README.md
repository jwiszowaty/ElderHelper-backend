# ElderHelper-backend
# Introduction
"Elder Helper" is a mobile application for two types of users: those who need assistance and those who are willing to offer a helping hand. 
The "Elders" or their caregivers can create an account on the platform and post jobs or tasks that require assistance. The "helpers" are kind-hearted volunteers in the community who can create accounts as well. They can browse through the posted jobs on a list or map and accept the ones according to their skills and availability. 

This is a RESTful API built to enable the app to carry out CRUD operations, including signing up new users, posting new jobs, updating job status, searching for jobs, editing and deleting jobs and profiles. 

# Prerequsites
Built in Node v.20.5.1, recommended version is v.20+.
- Node v.20+
- Express v.4.18.2+
- Jest v.29.7+
- Supertest v. 6.3.3
- Socket.io v. 4.7.+
- PostgreSQL v. 14.9+
  
# Hosted version
A hosted version of the API can be found at: https://elderhelper.onrender.com/api/
(The link provided is to a list of all endpoints.)

# Installation guide
- ```npm i```
For testing (optional)
- ```npm i jest -D```
- ```npm i supertest ``` 
## General
- Add .env files:
- Create two files in ElderHelper-backend directory: .env.development and .env.test. env.development uses development data, env.test uses basic test data
- In .env.development, type ```PGDATABASE=elder_helper```
- In .env.development, type ```PGDATABASE=elder_helper_test```
- Ensure that the provided .gitignore file contans the line .env.*
- Save any new/edited files.
- Seed database:
- In terminal: ```npm run setup-dbs```
- ```npm run seed```
# Credits
- Created by [Jakub Wiszowaty](https://github.com/jwiszowaty), [Layla Kawafi](https://github.com/layla93k), [Yulia Volkovaya](https://github.com/yvevolk), [Stanley Leung](https://github.com/27stanley), [Leigh Keating](https://github.com/lkeating26) and [Emma Johnston](https://github.com/emmajohnston93)
