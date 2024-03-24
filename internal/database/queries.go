package database

const (
	Q_get_article_transaction_history = `
		SELECT
			articles.id as article_id,
			SUM(qty) as qty,
			description
		FROM transaction_items
		JOIN articles ON articles.id = transaction_items.article_id
		GROUP BY article_id, description
		ORDER BY qty DESC
		`

	Q_get_article_transaction_history_date = `
		SELECT
			articles.id as id,
			SUM(qty) as qty,
			description
		FROM (SELECT qty, description, article_id 
			FROM transaction_items 
			WHERE DATE(created_at) = DATE(?)) as tr
		JOIN articles ON articles.id = tr.article_id
		GROUP BY id, description
		ORDER BY qty DESC, description ASC
		`

	Q_get_deposit_history = `
		SELECT
			SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) deposit_in,
			SUM(CASE WHEN qty < 0 THEN qty ELSE 0 END) deposit_out
		FROM transaction_items
		WHERE article_id LIKE 'deposit%'
		`
	Q_get_deposit_history_date = `
		SELECT
			SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) deposit_in,
			SUM(CASE WHEN qty < 0 THEN qty ELSE 0 END) deposit_out
		FROM transaction_items
		WHERE DATE(created_at) = DATE(?) AND article_id LIKE 'deposit%'
		`
)
