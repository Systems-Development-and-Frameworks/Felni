# Apollo Backend


## Why we decided to use the Neo4J architecture

We are both interested in learning new things in this course. That`s why it was nice to learn a new way to transfer data via GraphQL instead of
the commmonly used REST-APIs.
To learn even more new frameworks, tools, etc. we decided to choose the Neo4J architecture, because we were already interested in learning graph databases.
Furthermore the presentation from William in the lecture was very informative and increased our interes in graph databases further.
These are the reasons why we use the Neo4J architecture for this exercise.

## Installation guide for Apollo Backend + Neo4J
Run ``` npm install ```

Rename the existing .env.template to .env (e.g. via cp .env.template .env) and modify the values of lines 1 and 2. 
Do NOT modify lines 5 and 6 if you run our default setup.

If you have Docker installed on your system, which is highly recommended from our side, you can run the following command to start your Neo4j database locally:
```docker run  --publish=7474:7474 --publish=7687:7687 --env=NEO4J_AUTH=none neo4j:latest```

After that you will be able to use our application by running ```npm run start```


### Mandatory for running tests ´
Create a .env file in the root backend folder and add a secret JWTSECRET for signing the JWT token (e.g. JWTSECRET=yoursecret)
For easy use, you can use the already existing .env.template, renaming the file to .env (e.g. cp .env.template .env) and modifying the secret.

## Project setup
```
npm install
```

### Start server
```
npm run start
```

### Lint
```
npm run lint
```

### Lint and fix files
```
npm run lint:fix
```

### Run tests
```
npm run test
```

