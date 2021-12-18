package main

import (
	"ambassador/postgres"
	"ambassador/redis"
	"ambassador/settings"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	env := settings.Env{}
	postgres.Connect(&env)
	postgres.AutoMigrate()
	redis.SetUpRedis()
	redis.NewCacheChannel()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))
	SetUp(app)
	app.Listen(":5555")
}
