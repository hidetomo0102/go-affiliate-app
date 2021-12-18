package postgres

import (
	"ambassador/models"
	"ambassador/settings"
	"fmt"
	"github.com/kelseyhightower/envconfig"
	"golang.org/x/xerrors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func Connect(env *settings.Env) {
	var err error
	var dsn string
	// Read Env
	envconfig.Process("", env)
	// Connecting
	dsn = fmt.Sprintf(
		"host=%s dbname=%s user=%s password=%s sslmode=disable",
		env.DbHost,
		env.DbName,
		env.DbUser,
		env.DbPassword,
	)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println(err, "cannot connect to DB!")
	}
}

func AutoMigrate() error {
	err := DB.AutoMigrate(models.User{}, models.Product{}, models.Link{}, models.Order{}, models.OrderItem{})
	if err != nil {
		return xerrors.Errorf(": %w", err)
	}
	return nil
}
