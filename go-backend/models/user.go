package models

import (
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/xerrors"
	"gorm.io/gorm"
)

type User struct {
	ID           uint     `json:"id"`
	FirstName    string   `json:"first_name"`
	LastName     string   `json:"last_name"`
	Email        string   `json:"email" gorm:"unique"`
	Password     []byte   `json:"-"`
	IsAmbassador bool     `json:"-"`
	Revenue      *float64 `json:"revenue,omitempty" gorm:"-"`
}

func (user *User) HashPassword(password string) []byte {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 12)
	return hashedPassword
}

func (user *User) ComparePassword(password string) error {
	err := bcrypt.CompareHashAndPassword(user.Password, []byte(password))
	if err != nil {
		return xerrors.Errorf(": %w", err)
	}
	return nil
}

func (user *User) Name() string {
	return user.FirstName + " " + user.LastName
}

type Admin User

func (admin *Admin) CalculateRevenue(db *gorm.DB) {
	var orders []Order
	var revenue float64 = 0

	db.Preload("OrderItems").Find(&orders, &Order{
		UserID:   admin.ID,
		Complete: true,
	})

	for _, order := range orders {
		for _, orderItem := range order.OrderItems {
			revenue += orderItem.AmbassadorRevenue
		}
	}

	admin.Revenue = &revenue
}

type Ambassador User

func (ambassador *Ambassador) CalculateRevenue(db *gorm.DB) {
	var orders []Order
	var revenue float64 = 0

	db.Preload("OrderItems").Find(&orders, &Order{
		UserID:   ambassador.ID,
		Complete: true,
	})

	for _, order := range orders {
		for _, orderItem := range order.OrderItems {
			revenue += orderItem.AmbassadorRevenue
		}
	}

	ambassador.Revenue = &revenue
}
