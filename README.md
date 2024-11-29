# stringtojson

A simple Node.js application that converts a stringified JSON into a JSON object using Express and `body-parser`.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [License](#license)

## Description

`stringtojson` is a Node.js application built using Express.js. It accepts a stringified JSON as input via a POST request and converts it into a JSON object. This is useful for handling and parsing raw JSON data passed as strings in HTTP requests.

## Installation

Follow these steps to get your project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/irshadmb/stringtojson.git
    ```

2. Navigate into the project directory:
    ```bash
    cd stringtojson
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

Once you've installed the dependencies, you can start the application.

### Running the Application

1. Start the application:
    ```bash
    npm start
    ```

2. The app will now be running on [http://localhost:3000](http://localhost:3000) by default.

### API Endpoints

#### POST /convert
- **Description**: Converts a stringified JSON into a JSON object.
- **Request Body**:
    A stringified JSON (escaped correctly):
    ```json
    "{\"ticket_id\": \"TICKET-12345\", \"customer_name\": \"John Doe\"}"
    ```
- **Response**:
    If the conversion is successful:
    ```json
    {
        "success": true,
        "message": "String successfully converted to JSON",
        "data": {
            "ticket_id": "TICKET-12345",
            "customer_name": "John Doe"
        }
    }
    ```
    If the JSON is invalid:
    ```json
    {
        "success": false,
        "message": "Invalid JSON string provided",
        "error": "Unexpected non-whitespace character after JSON at position 2"
    }
    ```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

