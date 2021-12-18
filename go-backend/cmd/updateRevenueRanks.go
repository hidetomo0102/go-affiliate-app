package main

import (
	"ambassador/models"
	"ambassador/postgres"
	redisDB "ambassador/redis"
	"ambassador/settings"
	"context"
	"github.com/go-redis/redis/v8"
)

func main() {
	env := settings.Env{}
	postgres.Connect(&env)
	redisDB.SetUpRedis()

	var users []models.User

	ctx := context.Background()
	postgres.DB.Find(&users, models.User{
		IsAmbassador: true,
	})

	for _, user := range users {
		ambassador := models.Ambassador(user)
		ambassador.CalculateRevenue(postgres.DB)

		redisDB.Cache.ZAdd(ctx, "rankings", &redis.Z{
			Score:  *ambassador.Revenue,
			Member: user.Name(),
		})
	}
}
