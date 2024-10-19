package main

import (
	"time"

	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

type Registration struct {
	ID          int        `json:"id" db:"id"`
	Name        string     `json:"name" db:"name" validate:"required"`
	Email       string     `json:"email" db:"email" validate:"required,email"`
	Phone       string     `json:"phone" db:"phone"`
	DateOfBirth *time.Time `json:"date_of_birth,omitempty" db:"date_of_birth"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}
