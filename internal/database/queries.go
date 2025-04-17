package database

const (
	Q_transaction_history_date = `
		SELECT
		  transactions.payment_option AS payment_option,
		  SUM(transactions.total) AS sum
		FROM
		  transactions
		WHERE created_at BETWEEN ? AND ?
		GROUP BY
		  transactions.payment_option
		ORDER BY
		  transactions.payment_option ASC
		`

	Q_transaction_products_by_date = `
		SELECT
		    p.name,
			p.desc,
		    SUM(ti.qty) AS total_quantity
		FROM
		    transaction_items ti
		JOIN
		    transactions t ON ti.transaction_id = t.id
		JOIN
		    products p ON ti.product_id = p.id
		WHERE
		    t.deleted_at IS NULL AND
      		(DATE(t.created_at) = DATE(?)) AND
		    (p.deposit = FALSE OR p.deposit IS NULL)
		GROUP BY
		    ti.product_id
		ORDER BY
		    total_quantity DESC
		`

	Q_transaction_products_between_datetime = `
		SELECT
		    p.name,
			p.desc,
		    SUM(ti.qty) AS total_quantity
		FROM
		    transaction_items ti
		JOIN
		    transactions t ON ti.transaction_id = t.id
		JOIN
		    products p ON ti.product_id = p.id
		WHERE
		    t.deleted_at IS NULL AND
			(t.created_at BETWEEN ? AND ?) AND
		    (p.deposit = FALSE OR p.deposit IS NULL)
		GROUP BY
		    ti.product_id
		ORDER BY
		    total_quantity DESC
		`

	Q_transaction_views_between_datetime = `
		SELECT
		  v.name AS name,
		  SUM(transactions.total) AS sum_total,
		  SUM(transactions.total_credit) AS sum_total_credit
		FROM
		  transactions
		LEFT JOIN views AS v ON transactions.view_id = v.id
		WHERE
			(t.created_at BETWEEN ? AND ?)
		GROUP BY
		  v.name
		ORDER BY
		  v.name ASC
		`
)
