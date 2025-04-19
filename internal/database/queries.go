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
		  SUM(t.total) AS sum_total,
		  SUM(t.total_credit) AS sum_total_credit
		FROM
		  transactions t
		LEFT JOIN views AS v ON t.view_id = v.id
		WHERE
			(t.created_at BETWEEN ? AND ?)
		GROUP BY
		  v.name
		ORDER BY
		  v.name ASC
		`

	Q_transaction_unique_dates = `
		SELECT
			DATE(created_at) AS unique_date,
			COUNT(*) AS entry_count
		FROM transactions
		GROUP BY unique_date
		ORDER BY unique_date;
	`

	Q_transaction_nearest_timestamp = `
		SELECT *
		FROM transactions
		WHERE DATE(created_at) = (
			SELECT DATE(created_at)
			FROM transactions
			WHERE created_at > CURDATE()
			ORDER BY created_at DESC
			LIMIT 1
		)
	`

	Q_transaction_deposits = `
	SELECT
		SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) deposit_in,
		SUM(CASE WHEN qty < 0 THEN qty ELSE 0 END) deposit_out,
		SUM(qty) deposit_sum
	FROM transaction_items ti
	JOIN products p ON ti.product_id = p.id
	JOIN transactions t ON ti.transaction_id = t.id
	WHERE
		p.deposit = 1 AND
		(t.created_at BETWEEN ? AND ?)
	`
)
