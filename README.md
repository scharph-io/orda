# Orda

## Setup

### Development

#### Backend

- install Go compiler https://go.dev/dl/
- ensure go is in PATH with `go version`
- start backend with `make run-local` or `go run cmd/server/main.go`

#### Frontend

- install NodeJS@20
- switch to `web/app/` and run npm install
- run `npm start`

### Use a release

- Download asset [Releases](https://github.com/scharph/orda/releases)
- ensure executable `chmod +x BINARY`
- run with `./BINARY`

## Docker

`docker login -u scharphio`
`docker build -t scharphio/orda:latest .`
`docker push scharphio/orda:latest`

```sql

SELECT
	articles.id as id,
	SUM(qty) as totalQty,
	description
FROM transaction_items
LEFT JOIN articles ON articles.id = transaction_items.article_id
GROUP BY id, description
ORDER BY totalQty DESC


```

TotalSum/Day

```sql
SELECT SUM(total) FROM transactions WHERE DATE(created_at) = CURDATE()
``

Cash/Day
SELECT COUNT(*) FROM transactions WHERE payment_option = 1 AND DATE(created_at) = CURDATE()
Sponsor/Day
SELECT COUNT(*) FROM transactions WHERE payment_option = 2 AND DATE(created_at) = CURDATE()
Free/Day
SELECT COUNT(*) FROM transactions WHERE payment_option = 3 AND DATE(created_at) = CURDATE()
```

deposit/Day

```sql
SELECT article_id as desposit_id, SUM(qty) as qty FROM transaction_items WHERE DATE(created_at) = CURDATE() AND article_id LIKE 'deposit%'
GROUP BY article_id
```
