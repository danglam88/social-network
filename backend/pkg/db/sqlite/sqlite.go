package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
)

func RunMigrations(db *sql.DB, state bool) error {
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://./backend/pkg/db/migrations/sqlite",
		"sqlite3", driver)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return err
	}

	if state {
		log.Println("Migrations UP applied")
		err = m.Up()
	} else {
		log.Println("Migrations DOWN applied")
		err = m.Down()
	}
	if err != nil && err != migrate.ErrNoChange {
		fmt.Fprintln(os.Stderr, err)
		return err
	}

	return nil
}
