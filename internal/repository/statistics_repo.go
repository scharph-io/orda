package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/ports"
)

type StatisticsRepo struct {
	db    *sql.DB
	stmts map[string]*sql.Stmt
}

var _ ports.IStatisticsRepository = (*StatisticsRepo)(nil)

func NewStatisticsRepo(db *sql.DB) (*StatisticsRepo, error) {
	repo := &StatisticsRepo{
		db:    db,
		stmts: make(map[string]*sql.Stmt),
	}

	if err := repo.prepareStatements(); err != nil {
		return nil, fmt.Errorf("failed to prepare statements: %w", err)
	}

	return repo, nil
}

func (r *StatisticsRepo) prepareStatements() error {
	statements := map[string]string{
		"getTransactionDays":             database.Q_get_transactions_days,
		"getProductsForDateRange":        database.Q_products_for_date_range,
		"getProductQuantityForDateRange": database.Q_get_product_quantity_for_date_range,
		"getPaymentOptionsForDateRange":  database.Q_get_payment_options_for_date_range,
	}
	for name, query := range statements {
		stmt, err := r.db.Prepare(query)
		if err != nil {
			return fmt.Errorf("failed to prepare statement %s: %w", name, err)
		}
		r.stmts[name] = stmt
	}
	return nil
}

func (r *StatisticsRepo) GetTransactionDays(ctx context.Context, year int) (ports.TransactionDays, error) {
	rows, err := r.stmts["getTransactionDays"].QueryContext(ctx, year)
	if err != nil {
		return nil, fmt.Errorf("failed to query transaction days: %w", err)
	}
	defer rows.Close()

	var results ports.TransactionDays

	for rows.Next() {
		var row ports.TransactionDay
		if err := rows.Scan(&row.Day, &row.Qty); err != nil {
			log.Fatal(err)
		}
		results = append(results, &row)
	}

	return results, nil
}
