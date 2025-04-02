
# EcoTourism & Youth Empowerment Platform API

## Description

Backend API for the EcoTourism & Youth Empowerment Platform.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database

This project uses Prisma ORM with a PostgreSQL database.

### Migrations

```bash
# generate migration
$ npx prisma migrate dev --name init

# apply migrations
$ npx prisma migrate deploy
```

### Seed Database

To seed the database with initial data including the admin user:

```bash
$ npm run seed
```

This will create an admin user with:
- Email: admin@gmail.com
- Password: admin@555

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-secret-key"
```
