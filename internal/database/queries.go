package database

const (
	Q_get_product_transaction_history = `
		SELECT
			products.id as product_id,
			SUM(qty) as qty,
			description
		FROM transaction_items
		JOIN products ON products.id = transaction_items.product_id
		GROUP BY product_id, description
		ORDER BY qty DESC
		`

	Q_get_product_transaction_history_date = `
		SELECT
			products.id as id,
			SUM(qty) as qty,
			description
		FROM (SELECT qty, description, product_id 
			FROM transaction_items 
			WHERE DATE(created_at) = DATE(?)) as tr
		JOIN products ON products.id = tr.product_id
		GROUP BY id, description
		ORDER BY qty DESC, description ASC
		`

	Q_get_deposit_history = `
		SELECT
			SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) deposit_in,
			SUM(CASE WHEN qty < 0 THEN qty ELSE 0 END) deposit_out
		FROM transaction_items
		WHERE product_id LIKE 'deposit%'
		`
	Q_get_deposit_history_date = `
		SELECT
			SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) deposit_in,
			SUM(CASE WHEN qty < 0 THEN qty ELSE 0 END) deposit_out
		FROM transaction_items
		WHERE DATE(created_at) = DATE(?) AND product_id LIKE 'deposit%'
		`
)
