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
			article_id as desposit_id, 
			SUM(qty) as qty 
		FROM transaction_items 
		WHERE DATE(created_at) = CURDATE() AND article_id LIKE 'deposit%'
		GROUP BY article_id
		`
)
