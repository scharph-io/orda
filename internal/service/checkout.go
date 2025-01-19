package service

// type CheckoutItem struct {
// 	UUID  string `json:"uuid"`
// 	Name  string `json:"name"`  // TODO: Remove this
// 	Price int32  `json:"price"` // TODO: Remove this
// 	Qty   int32  `json:"quantity"`
// 	Desc  string `json:"desc"` // TODO: Remove this
// }

// type CheckoutData struct {
// 	Items         []CheckoutItem `json:"items"`
// 	Total         int32          `json:"total"` // TODO: Remove this
// 	PaymentOption int8           `json:"payment_option"`
// 	AccountType   int8           `json:"account_type"`
// }

// type CheckoutService struct {
// 	repo repository.TransactionRepo
// }

// func NewCheckoutService(repo repository.TransactionRepo) *CheckoutService {
// 	return &CheckoutService{repo}
// }

// func (s *CheckoutService) CreateTransaction(ctx context.Context, data *CheckoutData) (*model.Transaction, error) {
// 	items := []model.TransactionItem{}
// 	for i, item := range data.Items {

// 		desc := item.Name
// 		if item.Desc != "" {
// 			desc = fmt.Sprintf("%s - %s", item.Name, item.Desc)
// 		}
// 		items = append(items, model.TransactionItem{
// 			ID:          uint(i + 1),
// 			Description: desc,
// 			Price:       item.Price,
// 			Qty:         item.Qty,
// 			ProductID:   item.UUID,
// 		})
// 	}

// 	t := &model.Transaction{
// 		Items:         items,
// 		PaymentOption: data.PaymentOption,
// 		AccountType:   data.AccountType,
// 		Total:         data.Total,
// 	}

// 	return s.repo.Create(ctx, t)
// }

// func (s *CheckoutService) GetTransactions(ctx context.Context) ([]model.Transaction, error) {
// 	// TODO: Implement this
// 	return s.repo.Read(ctx)
// }

// func (s *CheckoutService) DeleteTransaction(ctx context.Context, id string) (bool, error) {

// 	return s.repo.Delete(ctx, id)
// }
