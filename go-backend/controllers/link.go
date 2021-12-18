package controllers

import (
	"ambassador/middlewares"
	"ambassador/models"
	"ambassador/postgres"
	"github.com/bxcodec/faker/v3"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/xerrors"
	"strconv"
)

type CreateLinkRequest struct {
	Products []int
}

func Link(c *fiber.Ctx) error {
	var links []models.Link

	id, _ := strconv.Atoi(c.Params("id"))

	postgres.DB.Where("user_id = ?", id).Find(&links)

	for i, link := range links {
		var orders []models.Order
		postgres.DB.Where("code = ? and complete = true", link.Code).Find(&orders)

		links[i].Orders = orders
	}

	return c.JSON(links)
}

func CreateLink(c *fiber.Ctx) error {
	var request CreateLinkRequest

	if err := c.BodyParser(&request); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	id, err := middlewares.GetUserId(c)
	if err != nil {
		return xerrors.Errorf(": %w", err)
	}

	link := models.Link{
		UserID: id,
		Code:   faker.Name(),
	}

	for _, productID := range request.Products {
		product := models.Product{
			ID: uint(productID),
		}
		link.Products = append(link.Products, product)
	}
	postgres.DB.Create(&link)

	return c.JSON(link)
}

func Stats(c *fiber.Ctx) error {
	var links []models.Link
	var orders []models.Order
	var results []fiber.Map

	id, err := middlewares.GetUserId(c)
	if err != nil {
		return xerrors.Errorf(": %w", err)
	}

	postgres.DB.Find(&links, models.Link{
		UserID: id,
	})

	for _, link := range links {
		postgres.DB.Preload("OrderItems").Find(&orders, &models.Order{
			Code:     link.Code,
			Complete: true,
		})

		var revenue float64 = 0
		for _, order := range orders {
			revenue += order.GetTotal()
		}

		results = append(results, fiber.Map{
			"code":    link.Code,
			"count":   len(orders),
			"revenue": revenue,
		})
	}

	return c.JSON(results)
}

func GetLink(c *fiber.Ctx) error {
	code := c.Params("code")

	link := models.Link{
		Code: code,
	}

	postgres.DB.Preload("User").Preload("Products").First(&link)

	return c.JSON(link)
}
