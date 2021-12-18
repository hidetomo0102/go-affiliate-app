package controllers

import (
	"ambassador/middlewares"
	"ambassador/models"
	"ambassador/postgres"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/xerrors"
	"strings"
	"time"
)

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	if data["password"] != data["password_config"] {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "password does not match",
		})
	}

	user := models.User{
		FirstName:    data["first_name"],
		LastName:     data["last_name"],
		Email:        data["email"],
		IsAmbassador: strings.Contains(c.Path(), "/api/ambassador"),
	}
	hashedPassword := user.HashPassword(data["password"])
	user.Password = hashedPassword

	postgres.DB.Create(&user)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string
	var user models.User
	var scope string
	// Find User from DB
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	postgres.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}
	// Password Compare
	if err := user.ComparePassword(data["password"]); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Wrong password",
		})
	}
	expiresAt := time.Now().Add(time.Hour * 24)
	// Ambassador Authentication
	isAmbassador := strings.Contains(c.Path(), "/api/ambassador")
	if isAmbassador {
		scope = "ambassador"
	} else {
		scope = "admin"
	}
	// Ambassador can't login as Admin at the same time
	if !isAmbassador && user.IsAmbassador {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	token, err := middlewares.GenerateJWT(user.ID, scope, expiresAt)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Invalid Credentials",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  expiresAt,
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	var user models.User

	id, err := middlewares.GetUserId(c)
	if err != nil {
		return xerrors.Errorf(": %w", err)
	}

	postgres.DB.Where("id = ?", id).First(&user)
	// return ambassador info
	if strings.Contains(c.Path(), "/api/ambassador") {
		ambassador := models.Ambassador(user)
		ambassador.CalculateRevenue(postgres.DB)

		return c.JSON(ambassador)
	}

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UpdateInfo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	id, _ := middlewares.GetUserId(c)
	user := models.User{
		ID:        id,
		FirstName: data["first_name"],
		LastName:  data["last_name"],
		Email:     data["email"],
	}

	postgres.DB.Model(&user).Updates(&user)

	return c.JSON(user)
}

func UpdatePassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	if data["password"] != data["password_config"] {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "password does not match",
		})
	}

	id, _ := middlewares.GetUserId(c)
	user := models.User{
		ID: id,
	}
	hashedPassword := user.HashPassword(data["password"])
	user.Password = hashedPassword

	postgres.DB.Model(&user).Updates(&user)

	return c.JSON(user)
}
