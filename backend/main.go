package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	loadEnv()
	initDB()
	defer dbPool.Close()

	router := gin.Default()

	// Enable CORS
	router.Use(cors.Default())

	// All routes are public
	router.GET("/registrations", GetAllRegistrations)
	router.POST("/registrations", CreateRegistration)
	router.GET("/registrations/:id", GetRegistrationByID)
	router.PUT("/registrations/:id", UpdateRegistration)
	router.DELETE("/registrations/:id", DeleteRegistration)

	router.Run(":8080")
}
