package controllers

import (
	"ambassador/models"
	"ambassador/postgres"
	redisDB "ambassador/redis"
	"context"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/xerrors"
)

var users []models.User

func Ambassadors(c *fiber.Ctx) error {
	postgres.DB.Where("is_ambassador = true").Find(&users)

	return c.JSON(users)
}

func Rankings(c *fiber.Ctx) error {
	ctx := context.Background()
	rankings, err := redisDB.Cache.ZRevRangeByScoreWithScores(ctx, "rankings", &redis.ZRangeBy{
		Min: "-inf",
		Max: "+inf",
	}).Result()
	if err != nil {
		return xerrors.Errorf(": %w", err)
	}

	results := make(map[string]float64)
	for _, ranking := range rankings {
		results[ranking.Member.(string)] = ranking.Score
	}

	return c.JSON(results)
}
