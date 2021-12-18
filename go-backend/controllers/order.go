package controllers

import (
	"ambassador/models"
	"ambassador/postgres"
	"ambassador/redis"
	"ambassador/settings"
	"context"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/kelseyhightower/envconfig"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"golang.org/x/xerrors"
	"net/smtp"
)

func Orders(c *fiber.Ctx) error {
	var orders []models.Order

	postgres.DB.Preload("OrderItems").Find(&orders)

	for i, order := range orders {
		orders[i].Name = order.GetFullName()
		orders[i].Total = order.GetTotal()
	}

	return c.JSON(orders)
}

type CreateOrderRequest struct {
	Code      string
	FirstName string
	LastName  string
	Email     string
	Address   string
	Country   string
	City      string
	Zip       string
	Products  []map[string]int
}

func CreateOrder(c *fiber.Ctx) error {
	var request CreateOrderRequest
	var lineItems []*stripe.CheckoutSessionLineItemParams
	// load env

	if err := c.BodyParser(&request); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	link := models.Link{
		Code: request.Code,
	}
	postgres.DB.Preload("User").First(&link)

	if link.ID == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Invalid Link",
		})
	}

	order := models.Order{
		Code:            link.Code,
		UserID:          link.UserID,
		AmbassadorEmail: request.Email,
		FirstName:       request.FirstName,
		LastName:        request.LastName,
		Email:           request.Email,
		Address:         request.Address,
		Country:         request.Country,
		City:            request.City,
		Zip:             request.Zip,
	}

	tx := postgres.DB.Begin()
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	for _, requestProduct := range request.Products {
		product := models.Product{}
		product.ID = uint(requestProduct["product_id"])

		postgres.DB.First(&product)
		total := product.Price * float64(requestProduct["quantity"])
		item := models.OrderItem{
			OrderID:           order.ID,
			ProductTitle:      product.Title,
			Price:             product.Price,
			Quantity:          uint(requestProduct["quantity"]),
			AmbassadorRevenue: 0.1 * total,
			AdminRevenue:      0.9 * total,
		}

		if err := tx.Create(&item).Error; err != nil {
			tx.Rollback()
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}

		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			Name:        stripe.String(product.Title),
			Description: stripe.String(product.Description),
			Images:      []*string{stripe.String(product.Image)},
			Amount:      stripe.Int64(100 * int64(product.Price)), // 100 * ¢cents = $dollars
			Currency:    stripe.String("usd"),
			Quantity:    stripe.Int64(int64(requestProduct["quantity"])),
		})
	}

	var env settings.Env
	err := envconfig.Process("", &env)
	if err != nil {
		return xerrors.Errorf("% :w", err)
	}

	stripe.Key = env.StripeKey
	params := stripe.CheckoutSessionParams{
		SuccessURL:         stripe.String("http://localhost:5000/success?source={CHECKOUT_SESSION_ID}"),
		CancelURL:          stripe.String("http://localhost:5000/error"),
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems:          lineItems,
	}

	source, err := session.New(&params)
	if err != nil {
		tx.Rollback()
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	order.TransactionID = source.ID
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	tx.Commit()

	return c.JSON(source)
}

func ConfirmOrder(c *fiber.Ctx) error {
	var data map[string]string
	ctx := context.Background()

	if err := c.BodyParser(&data); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	order := models.Order{}
	postgres.DB.Preload("OrderItems").First(&order, models.Order{
		TransactionID: data["source"],
	})
	if order.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Order not found",
		})
	}
	order.Complete = true
	postgres.DB.Save(&order)

	go func(order models.Order) {
		ambassadorRevenue := 0.0
		adminRevenue := 0.0
		for _, item := range order.OrderItems {
			ambassadorRevenue += item.AmbassadorRevenue
			adminRevenue += item.AdminRevenue
		}

		user := models.User{}
		user.ID = order.UserID
		postgres.DB.First(&user)

		redis.Cache.ZIncrBy(ctx, "rankings", ambassadorRevenue, user.Name())

		ambassadorMessage := []byte(fmt.Sprintf("You earned $%f from the link #%s", ambassadorRevenue, order.Code))
		adminMessage := []byte(fmt.Sprintf("Order #%d, with a total of $%f has completed", order.ID, adminRevenue))
		smtp.SendMail("host.docker.internal:1025", nil, "no-reply@email.com", []string{order.AmbassadorEmail}, ambassadorMessage)
		smtp.SendMail("host.docker.internal:1025", nil, "no-reply@email.com", []string{"admin@admin.com"}, adminMessage)
	}(order)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
