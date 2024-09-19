# Orda

## Usage

Use the docker-compose file to start the application.
Configure the environment variables compose file.

```bash
docker-compose up
```

## Development

To start the application locally in development mode, use the following command:

```bash
## Start the application
docker-compose -f local.docker-compose.yml up

## Stop the application
docker-compose -f local.docker-compose.yml down [-v]

```

## Notes

https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04

## TODO

Preisfaktor Pro gruppe

Einkaufspreis und Verkaufspreis

wenn einkaufpreis nicht angegeben dann einkaufspreis = verkaufspreis / preisfaktor
