# Apollo Backend

## Mandatory for running tests ´
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

