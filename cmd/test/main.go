package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/database"
)

func main() {

	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("INFO: No .env file found")
	}

	database.ConnectDB()
}
