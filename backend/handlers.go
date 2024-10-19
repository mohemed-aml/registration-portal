package main

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx"
)

func CreateRegistration(c *gin.Context) {
	var reg Registration
	if err := c.ShouldBindJSON(&reg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate input
	if err := validate.Struct(&reg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Insert into the database
	query := `
        INSERT INTO registrations (name, email, phone, date_of_birth)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at, updated_at
    `
	err := dbPool.QueryRow(context.Background(), query, reg.Name, reg.Email, reg.Phone, reg.DateOfBirth).
		Scan(&reg.ID, &reg.CreatedAt, &reg.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create registration"})
		return
	}

	c.JSON(http.StatusCreated, reg)
}

func GetAllRegistrations(c *gin.Context) {
	query := `
        SELECT id, name, email, phone, date_of_birth, created_at, updated_at
        FROM registrations
    `
	rows, err := dbPool.Query(context.Background(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve registrations"})
		return
	}
	defer rows.Close()

	var registrations []Registration
	for rows.Next() {
		var reg Registration
		err := rows.Scan(&reg.ID, &reg.Name, &reg.Email, &reg.Phone, &reg.DateOfBirth, &reg.CreatedAt, &reg.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse registration data", "details": err.Error()})
			return
		}
		registrations = append(registrations, reg)
	}

	c.JSON(http.StatusOK, registrations)
}

func GetRegistrationByID(c *gin.Context) {
	idParam := c.Param("id")
	regID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid registration ID"})
		return
	}

	var reg Registration
	query := `
			SELECT id, name, email, phone, date_of_birth, created_at, updated_at
			FROM registrations
			WHERE id = $1
	`
	err = dbPool.QueryRow(context.Background(), query, regID).Scan(
		&reg.ID, &reg.Name, &reg.Email, &reg.Phone, &reg.DateOfBirth, &reg.CreatedAt, &reg.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Registration not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve registration"})
		}
		return
	}

	c.JSON(http.StatusOK, reg)
}

func UpdateRegistration(c *gin.Context) {
	idParam := c.Param("id")
	regID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid registration ID"})
		return
	}

	var reg Registration
	if err := c.ShouldBindJSON(&reg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate input
	if err := validate.Struct(&reg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Perform the update
	query := `
        UPDATE registrations
        SET name = $1, email = $2, phone = $3, date_of_birth = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING updated_at
    `
	err = dbPool.QueryRow(context.Background(), query, reg.Name, reg.Email, reg.Phone, reg.DateOfBirth, regID).
		Scan(&reg.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update registration"})
		return
	}

	c.JSON(http.StatusOK, reg)
}

func DeleteRegistration(c *gin.Context) {
	idParam := c.Param("id")
	regID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid registration ID"})
		return
	}

	// Perform the deletion
	query := `DELETE FROM registrations WHERE id = $1`
	_, err = dbPool.Exec(context.Background(), query, regID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete registration"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration deleted successfully"})
}
