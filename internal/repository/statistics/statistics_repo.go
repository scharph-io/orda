package statistics

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

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
		"getTransactionDates":            database.Q_get_transaction_dates2,
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

func (r *StatisticsRepo) GetTransactionCntDates(ctx context.Context, year int) (ports.TransactionCntDates, error) {
	rows, err := r.stmts["getTransactionDays"].QueryContext(ctx, year)
	if err != nil {
		return nil, fmt.Errorf("failed to query transaction days: %w", err)
	}
	defer rows.Close()
	var results ports.TransactionCntDates
	for rows.Next() {
		var row ports.TransactionCntDate
		if err := rows.Scan(&row.Date, &row.Qty); err != nil {
			log.Fatal(err)
		}
		results = append(results, &row)
	}

	return results, nil
}

func (r *StatisticsRepo) GetTransactionDates(ctx context.Context, startDate, endDate *time.Time) ([]*time.Time, error) {
	datesRows, err := r.stmts["getTransactionDates"].QueryContext(ctx, startDate, startDate, endDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query transaction dates for date range: %w", err)
	}
	defer datesRows.Close()

	var dates []*time.Time
	for datesRows.Next() {
		var date time.Time
		if err := datesRows.Scan(&date); err != nil {
			return nil, fmt.Errorf("failed to scan transaction date: %w", err)
		}
		dates = append(dates, &date)
	}

	return dates, nil
}

func (r *StatisticsRepo) GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ports.ProductsForDateRange, error) {
	rows, err := r.stmts["getProductsForDateRange"].QueryContext(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query transaction days: %w", err)
	}
	defer rows.Close()

	var results ports.ProductsForDateRange

	for rows.Next() {
		var row ports.ProductForDateRange
		if err := rows.Scan(&row.Product, &row.Desc, &row.TotalQty, &row.TotalAmount); err != nil {
			log.Fatal(err)
		}
		results = append(results, &row)
	}

	return results, nil

}

func (r *StatisticsRepo) GetProductQtyForDateRange(ctx context.Context, startDate, endDate time.Time, productId string) ([]*int32, error) {

	rows, err := r.stmts["getProductQuantityForDateRange"].QueryContext(ctx, startDate, endDate, productId)
	if err != nil {
		return nil, fmt.Errorf("failed to query product quantity for date range: %w", err)
	}
	defer rows.Close()

	var result = make([]*int32, 0)
	for rows.Next() {
		var row int32
		if err := rows.Scan(&row); err != nil {
			log.Fatal(err)
		}
		result = append(result, &row)
	}

	return result, nil
}

func (r *StatisticsRepo) ProductsExists(ctx context.Context, ids []string) (bool, error) {
	if len(ids) == 0 {
		return false, nil
	}

	inClause := strings.Repeat("?,", len(ids))
	inClause = inClause[:len(inClause)-1] // remove trailing comma
	query := fmt.Sprintf(database.Q_products_exists, inClause)

	// Build args slice: all ids + len(ids)
	args := make([]any, 0, len(ids)+1)
	args = append(args, len(ids)) // first param -> COUNT(*) = ?
	for _, id := range ids {
		args = append(args, id)
	}

	var allExist bool
	err := r.db.QueryRowContext(ctx, query, args...).Scan(&allExist)
	if err != nil {
		return false, err
	}

	return allExist, nil
}

func (r *StatisticsRepo) GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (ports.PaymentOptionsForDateRange, error) {
	rows, err := r.stmts["getPaymentOptionsForDateRange"].QueryContext(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to query payment options for date range: %w", err)
	}
	defer rows.Close()

	var results ports.PaymentOptionsForDateRange

	for rows.Next() {
		var row ports.PaymentOptionForDateRange
		if err := rows.Scan(&row.PaymentOption, &row.Transactions, &row.TotalAmount, &row.TotalCreditAmount); err != nil {
			log.Fatal(err)
		}
		results = append(results, &row)
	}

	return results, nil
}
