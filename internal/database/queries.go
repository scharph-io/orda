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

	Q_get_deposit_history = `
		SELECT
			SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) deposit_in,
			SUM(CASE WHEN qty < 0 THEN qty ELSE 0 END) deposit_out
		FROM transaction_items
		WHERE DATE(created_at) = CURDATE() AND article_id LIKE 'deposit%'
		`
)
