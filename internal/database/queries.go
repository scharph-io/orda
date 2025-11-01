package database

const (
	Q_products_exists = `
		SELECT COUNT(*) = ? AS all_exist
		FROM products
		WHERE id IN (%s);
	`

	Q_get_payment_options_for_date_range = `
		SELECT
  			t.payment_option,
     		COUNT(*) AS transactions_count,
       		SUM(t.total) / 100 AS total_amount,
       		SUM(t.total_credit) / 100 AS total_credit_amount
        FROM transactions AS t
        WHERE t.deleted_at IS NULL
		  AND t.created_at >= ?   -- from …
		  AND t.created_at <  ?   -- to … (exclusive upper bound)
		GROUP BY t.payment_option
		ORDER BY t.payment_option;
	`

	Q_get_product_quantity_for_date_range = `
		WITH params AS (
	    SELECT
	        DATE(?) AS start_day,
	        DATE(?) AS end_day,
	        ? AS product_id
	    ),
		transaction_days AS (
		    SELECT DISTINCT DATE(DATE_SUB(t.created_at, INTERVAL 6 HOUR)) AS day
		    FROM transactions AS t
		    CROSS JOIN params p
		    WHERE DATE(DATE_SUB(t.created_at, INTERVAL 6 HOUR))
		          BETWEEN p.start_day AND p.end_day
		),
		product_totals AS (
		    SELECT
		        DATE(DATE_SUB(t.created_at, INTERVAL 6 HOUR)) AS day,
		        SUM(ti.qty) AS qty
		    FROM transactions AS t
		    JOIN transaction_items AS ti ON ti.transaction_id = t.id
		    CROSS JOIN params p
		    WHERE ti.product_id = p.product_id
		      AND DATE(DATE_SUB(t.created_at, INTERVAL 6 HOUR))
		          BETWEEN p.start_day AND p.end_day
		    GROUP BY DATE(DATE_SUB(t.created_at, INTERVAL 6 HOUR))
		)
		SELECT
		    COALESCE(pt.qty, 0) AS total_qty
		FROM transaction_days AS td
		LEFT JOIN product_totals AS pt ON pt.day = td.day
		ORDER BY td.day;
	`

	/*
	* reporting_day|transactions_in_window|
	*	-------------+----------------------+
	*	2025-04-05|                   400|
	 */
	Q_get_transactions_days = `
		SELECT
  			DATE(DATE_SUB(t.created_at, INTERVAL 6 HOUR)) AS reporting_day,
    		COUNT(*) AS transactions_in_window
		FROM transactions AS t
		WHERE t.deleted_at IS NULL
			AND YEAR(t.created_at) = ?
		GROUP BY reporting_day
		ORDER BY reporting_day;
	`

	// 6 hours shifted
	Q_get_transaction_dates = `
		SELECT DISTINCT DATE(DATE_SUB(created_at, INTERVAL 6 HOUR)) AS transaction_day
		FROM transactions
		WHERE created_at IS NOT NULL
			AND DATE(created_at) BETWEEN ? AND ?
		ORDER BY transaction_day;
	`

	/*
	 * product_name | product_desc |total_units_sold|total_gross_sales|
	 * -------------+--------------+----------------+-----------------+
	 *      product |  description |              45|         105.0000|
	 */
	Q_products_for_date_range = `
		SELECT
  			p.name AS product_name,
     		p.desc AS product_desc,
  			COALESCE(SUM(ti.qty), 0) AS total_units_sold,
  			COALESCE(SUM(ti.qty * ti.price)/100, 0) AS total_gross_sales
		FROM transactions AS t
		JOIN transaction_items AS ti ON ti.transaction_id = t.id
		JOIN products AS p ON p.id = ti.product_id
		WHERE t.deleted_at IS NULL
		  AND p.deleted_at IS NULL
		  AND t.created_at >= ?       -- start date
		  AND t.created_at <  ?       -- end date (exclusive keeps year boundaries clean)
		GROUP BY product_name, product_desc
		ORDER BY product_name, product_desc;
	`

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
