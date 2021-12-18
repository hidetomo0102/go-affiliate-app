package main

import (
	"ambassador/models"
	"ambassador/postgres"
	"ambassador/settings"
	"github.com/bxcodec/faker/v3"
)

// Populate dummy ambassadors
func main() {
	env := settings.Env{}
	postgres.Connect(&env)

	for i := 0; i < 30; i++ {
		ambassador := models.User{
			FirstName:    faker.FirstName(),
			LastName:     faker.LastName(),
			IsAmbassador: true,
		}

		hashedPassword := ambassador.HashPassword("1234")
		ambassador.Password = hashedPassword

		postgres.DB.Create(&ambassador)
	}
}
