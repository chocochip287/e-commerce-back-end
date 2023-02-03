# E-Commerce Back End

## License

This application uses an MIT license.

## Description

This E-commerce back end application allows a user to perform CRUD operations on a database built with Sequelize via POST, PUT, and DELETE routes built around each model.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)

## Installation Instructions

Once the repo has been cloned to your personal machine, run npm i in your machine's terminal to install the required Node.js packages. Please note that this application requires MySQL to be installed on the user's system. Please follow the instructions at the [MySQL Website](https://dev.mysql.com/doc/refman/8.0/en/installing.html) to ensure you are able to run MySQL in your CLI. MySQL Workbench is also recommended for additional database operations. Once you've verified that the installation was successful, run through the following instructions:

1. Rename the env.example file in the top level directory to .env and enter your MySQL username and password in the DB_USER and DB_PASSWORD fields within single quotes.

2. From your terminal's CLI run the commands mysql -u (your username) -p < schema.sql after navigating to the db directory to create the database.

3. After navigating back to the top level directory, enter npm run seed in your CLI to seed the new database.

4. Once the schema and seed files have been run, type node server in your CLI to initiate the server file. From here you can use Insomnia or your browser from the appropriate localhost link with whichever routes you're looking to explore.

## Usage

Each route file explains what HTML method functionality is available for each route. Routes that require inputs beyond URL inputs have brief commentary stating what body inputs are required and their formatting.

Additionally, [this video](https://www.youtube.com/watch?v=XWJ9AmFN-Aw) demonstrates all of the application's functionality.

## Tests

None for this application.

## Questions

None for now.

## App Author

chocochip287 - [GitHub](https://github.com/chocochip287)

## Author's Email

chocochip287@gmail.com