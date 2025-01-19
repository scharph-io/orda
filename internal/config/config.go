package config

import (
	"fmt"
	"strings"
	"sync"

	"github.com/spf13/viper"
)

type Config struct {
	Server struct {
		Port     int
		Host     string
		Timezone string
	}
	Database struct {
		Host     string
		Port     int
		Name     string
		User     string
		Password string
	}
	Account struct {
		InitialBalance int32
		MaxDeposit     int
		NegativeLimit  int
		Limit          int
		TopUpFactor    int
	}
}

var (
	config *Config
	once   sync.Once
)

func loadConfig() *Config {

	// Set up Viper
	v := viper.New()

	// Set default values
	v.SetDefault("server.port", 3000)
	v.SetDefault("server.host", "localhost")
	v.SetDefault("server.timezone", "UTC")

	v.SetDefault("database.host", "localhost")
	v.SetDefault("database.port", 3306)

	v.SetDefault("account.initialBalance", 0)
	v.SetDefault("account.maxDeposit", 1000)
	v.SetDefault("account.negativeLimit", 0)
	v.SetDefault("account.limit", 10000)
	v.SetDefault("account.topUpFactor", 0)

	// Config file setup
	v.SetConfigName("config") // config file name without extension
	v.SetConfigType("yaml")   // yaml, json, etc.
	v.AddConfigPath(".")      // optionally look for config in working directory

	// Environment variables setup
	v.SetEnvPrefix("ORDA") // prefix for environment variables
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv() // read in environment variables that match

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			fmt.Println("No config file found, using defaults and environment variables")
		} else {
			panic(fmt.Sprintf("Fatal error reading config file: %s", err))
		}
	}
	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		panic(fmt.Sprintf("Unable to decode config into struct: %s", err))
	}
	return &cfg
}

func GetConfig() *Config {
	once.Do(func() {
		config = loadConfig()
	})
	return config
}
