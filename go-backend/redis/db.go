package redis

import (
	"context"
	"github.com/go-redis/redis/v8"
	"time"
)

var Cache *redis.Client
var CacheChannel chan string

func SetUpRedis() {
	Cache = redis.NewClient(&redis.Options{
		Addr: "redis:6379",
		DB:   0,
	})
}

func NewCacheChannel() {
	CacheChannel = make(chan string)
	go func(ch chan string) {
		for {
			time.Sleep(5 * time.Second)
			key := <-ch
			Cache.Del(context.Background(), key)
		}
	}(CacheChannel)
}

func ClearCache(keys ...string) {
	for _, key := range keys {
		CacheChannel <- key
	}
}
