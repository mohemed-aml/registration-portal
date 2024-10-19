package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
)

var dbPool *pgxpool.Pool

func initDB() {
	databaseURL := os.Getenv("DATABASE_URL")
	var err error
	dbPool, err = pgxpool.Connect(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
}

func loadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loading .env file")
	}
}
