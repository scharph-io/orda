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

	Q_bought_products = `
		SELECT
		    ti.product_id,
		    p.name,
		    p.deposit,
		    SUM(ti.qty) AS total_quantity
		FROM
		    transaction_items ti
		JOIN
		    transactions t ON ti.transaction_id = t.id
		JOIN
		    products p ON ti.product_id = p.id
		WHERE
		    t.deleted_at IS NULL
		GROUP BY
		    ti.product_id
		ORDER BY
		    total_quantity DESC
		`
)
