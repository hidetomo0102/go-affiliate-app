package controllers

import (
	"ambassador/models"
	"ambassador/postgres"
	"ambassador/redis"
	"context"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/xerrors"
	"sort"
	"strconv"
	"strings"
	"time"
)

func Products(c *fiber.Ctx) error {
	var products []models.Product

	postgres.DB.Find(&products)

	return c.JSON(products)
}

func CreateProducts(c *fiber.Ctx) error {
	var products []models.Product

	if err := c.BodyParser(&products); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	postgres.DB.Create(&products)
	go redis.ClearCache("products_backend", "products_frontend")

	return c.JSON(products)
}

func GetProduct(c *fiber.Ctx) error {
	var product models.Product

	id, _ := strconv.Atoi(c.Params("id"))
	product.ID = uint(id)

	postgres.DB.Find(&product)

	return c.JSON(product)
}

func UpdateProduct(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	product := models.Product{
		ID: uint(id),
	}

	if err := c.BodyParser(&product); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	postgres.DB.Model(&product).Updates(&product)
	go redis.ClearCache("products_backend", "products_frontend")

	return c.JSON(product)
}

func DeleteProduct(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	product := models.Product{
		ID: uint(id),
	}

	if err := c.BodyParser(&product); err != nil {
		return xerrors.Errorf(": %w", err)
	}

	postgres.DB.Model(&product).Delete(&product)
	go redis.ClearCache("products_backend", "products_frontend")

	return c.JSON(fiber.Map{
		"message": "deleted",
	})
}

func ProductsFrontend(c *fiber.Ctx) error {
	var products []models.Product

	ctx := context.Background()
	result, err := redis.Cache.Get(ctx, "products_frontend").Result()

	if err != nil {
		postgres.DB.Find(&products)

		productBytes, err := json.Marshal(products)
		if err != nil {
			return xerrors.Errorf(": %w", err)
		}

		redis.Cache.Set(ctx, "products_frontend", productBytes, 30*time.Minute)
	} else {
		json.Unmarshal([]byte(result), &products)
	}

	return c.JSON(products)
}

const productsPerPage = 9

func SearchProducts(c *fiber.Ctx) error {
	var products []models.Product

	ctx := context.Background()
	result, err := redis.Cache.Get(ctx, "products_backend").Result()

	if err != nil {
		postgres.DB.Find(&products)

		productBytes, err := json.Marshal(products)
		if err != nil {
			return xerrors.Errorf(": %w", err)
		}

		redis.Cache.Set(ctx, "products_backend", productBytes, 30*time.Minute)
	} else {
		json.Unmarshal([]byte(result), &products)
	}
	// Search
	var searchedProducts []models.Product
	if s := c.Query("s"); s != "" {
		lowerStr := strings.ToLower(s)
		for _, product := range products {
			if strings.Contains(strings.ToLower(product.Title), lowerStr) || strings.Contains(strings.ToLower(product.Description), lowerStr) {
				searchedProducts = append(searchedProducts, product)
			}
		}
	} else {
		searchedProducts = products
	}
	// Sort
	if sortParam := c.Query("sort"); sortParam != "" {
		sortLower := strings.ToLower(sortParam)
		if sortLower == "asc" {
			sort.Slice(searchedProducts, func(i, j int) bool {
				return searchedProducts[i].Price < searchedProducts[j].Price
			})
		}
		if sortLower == "desc" {
			sort.Slice(searchedProducts, func(i, j int) bool {
				return searchedProducts[i].Price > searchedProducts[j].Price
			})
		}
	}
	// Pagination
	total := len(searchedProducts)
	page, _ := strconv.Atoi(c.Query("page", "1"))

	productsForPreviousPage := (page - 1) * productsPerPage
	productsForNextPage := page * productsPerPage

	var returnData []models.Product

	if productsForPreviousPage <= total && total <= productsForNextPage {
		returnData = searchedProducts[productsForPreviousPage:total]
	} else if total >= productsForNextPage {
		returnData = searchedProducts[productsForPreviousPage:productsForNextPage]
	} else {
		returnData = []models.Product{}
	}

	return c.JSON(fiber.Map{
		"data":      returnData,
		"total":     total,
		"page":      page,
		"last_page": total/productsPerPage + 1,
	})
}
