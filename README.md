# Orda

## Usage

Use the docker-compose file to start the application.
Configure the environment variables compose file.

```bash
docker-compose up -d
```

## Development

### Prereq

```bash
## database and adminer for local development
make dev-up / dev-down / dev-logs
```

To start the application locally in development mode, use the following command:

```bash
## Start backend
make run

## Start frontend
make run-ui

```

## Todos

## Notes

Uses scopes: https://gorm.io/docs/advanced_query.html#Applying-Scopes-in-Queries
Hooks: https://gorm.io/docs/hooks.html
