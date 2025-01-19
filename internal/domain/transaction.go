package domain

type Transaction struct {
	Base
	// Items         []TransactionItem `json:"items" gorm:"constraint:OnDelete:CASCADE"`
	PaymentOption int8  `json:"payment_option"`
	AccountType   int8  `json:"account_type"`
	Total         int32 `json:"total"`
	// UserID        string            `json:"user_id"`
	// User          User              `json:"user"`
}

// func (t *Transaction) AfterCreate(tx *gorm.DB) (err error) {

// 	t.TransactionNr = fmt.Sprintf("%s.%d", t.CreatedAt.Format("20060102"), t.ID)
// 	if err := tx.Save(t).Error; err != nil {
// 		return err
// 	}

// 	return nil
// }

// type TransactionItem struct {
// 	gorm.Model
// 	ID            uint   `gorm:"primarykey;autoIncrement:false"`
// 	TransactionID string `gorm:"primaryKey"`
// 	Description   string
// 	Qty           int32
// 	Price         int32
// 	ProductID     string `gorm:"index" json:"product_id"`
// }
