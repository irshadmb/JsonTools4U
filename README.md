![JsonTools4U](JSONTools4U.png)

# JsonTools4U

A simple Node.js application that converts a stringified JSON into a JSON object using Express and `body-parser`.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [License](#license)

## Description

`jsontools4u` is a Node.js application built using Express.js. It accepts a stringified JSON as input via a POST request and converts it into a JSON object. This is useful for handling and parsing raw JSON data passed as strings in HTTP requests.

## Installation

Follow these steps to get your project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/irshadmb/jsontools4u.git
    ```

2. Navigate into the project directory:
    ```bash
    cd jsontools4u
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

#### POST /validate
- **Description**: Validates JSON structure and provides detailed validation results.
- **Request Body**: 
    Can accept either a JSON object or a JSON string:
    ```json
    {
        "name": "John",
        "age": 30,
        "email": "john@example.com"
    }
    ```
- **Content-Type**: 
    - `application/json` for JSON objects
    - `text/plain` for JSON strings

- **Response**:
    If the JSON is valid:
    ```json
    {
        "success": true,
        "message": "JSON is valid",
        "validation": {
            "isValid": true,
            "issues": []
        },
        "data": {
            "name": "John",
            "age": 30,
            "email": "john@example.com"
        }
    }
    ```
    If the JSON has validation issues:
    ```json
    {
        "success": true,
        "message": "JSON has potential issues",
        "validation": {
            "isValid": false,
            "issues": [
                "Null value found at 'email'",
                "Undefined value found at 'address'"
            ]
        },
        "data": {
            "name": "John",
            "age": 30,
            "email": null,
            "address": undefined
        }
    }
    ```
    If the JSON is invalid:
    ```json
    {
        "success": false,
        "message": "Invalid JSON format",
        "error": "Unexpected token in JSON at position 0",
        "providedInput": "Invalid JSON string"
    }
    ```

#### POST /query
- **Description**: Executes JSONPath queries on JSON data
- **Request Body**: 
    A JSON object to query:
    ```json
    {
        "store": {
            "book": [
                {
                    "category": "reference",
                    "author": "Nigel Rees",
                    "title": "Sayings of the Century",
                    "price": 8.95
                },
                {
                    "category": "fiction",
                    "author": "J. R. R. Tolkien",
                    "title": "The Lord of the Rings",
                    "price": 22.99
                }
            ]
        }
    }
    ```
- **Query Parameters**:
    - `path`: JSONPath expression to evaluate (required)
    Example: `?path=$.store.book[*].author`

- **Content-Type**: `application/json`

- **Response**:
    Successful query:
    ```json
    {
        "success": true,
        "message": "JSONPath query executed successfully",
        "query": "$.store.book[*].author",
        "result": [
            "Nigel Rees",
            "J. R. R. Tolkien"
        ],
        "originalData": {
            // Original JSON data
        }
    }
    ```
    
    Invalid query or error:
    ```json
    {
        "success": false,
        "message": "Error executing JSONPath query",
        "error": "Invalid JSONPath expression",
        "query": "$.invalid.path"
    }
    ```

Example Usage:
```bash
curl -X POST \
  'http://localhost:3000/query?path=$.store.book[*].author' \
  -H 'Content-Type: application/json' \
  -d '{
    "store": {
        "book": [
            {
                "category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95
            },
            {
                "category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "price": 22.99
            }
        ]
    }
}'
```

#### POST /yaml2json
- **Description**: Converts YAML/YML content to JSON
- **Request Body**: 
    YAML content as plain text:
    ```yaml
    user:
      name: John Doe
      age: 30
      address:
        street: 123 Main St
        city: New York
        country: USA
      hobbies:
        - reading
        - gaming
        - traveling
    ```
- **Content-Type**: `text/plain`

- **Response**:
    Successful conversion:
    ```json
    {
        "success": true,
        "message": "YAML successfully converted to JSON",
        "data": {
            "user": {
                "name": "John Doe",
                "age": 30,
                "address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "country": "USA"
                },
                "hobbies": [
                    "reading",
                    "gaming",
                    "traveling"
                ]
            }
        },
        "originalYaml": "user:\n  name: John Doe\n  age: 30..."
    }
    ```
    
    Invalid YAML or error:
    ```json
    {
        "success": false,
        "message": "Error converting YAML to JSON",
        "error": "end of the stream or a document separator is expected",
        "providedInput": "invalid: yaml: content:"
    }
    ```

Example Usage:
```bash
curl -X POST \
  http://localhost:3000/yaml2json \
  -H 'Content-Type: text/plain' \
  -d 'user:
  name: John Doe
  age: 30
  address:
    street: 123 Main St
    city: New York
    country: USA
  hobbies:
    - reading
    - gaming
    - traveling'
```

#### POST /xml2json
- **Description**: Converts XML content to JSON
- **Request Body**: 
    XML content as plain text:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <user>
        <name>John Doe</name>
        <age>30</age>
        <address>
            <street>123 Main St</street>
            <city>New York</city>
            <country>USA</country>
        </address>
        <hobbies>
            <hobby>reading</hobby>
            <hobby>gaming</hobby>
            <hobby>traveling</hobby>
        </hobbies>
    </user>
    ```
- **Content-Type**: `text/plain`

- **Response**:
    Successful conversion:
    ```json
    {
        "success": true,
        "message": "XML successfully converted to JSON",
        "data": {
            "user": {
                "name": "John Doe",
                "age": "30",
                "address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "country": "USA"
                },
                "hobbies": {
                    "hobby": ["reading", "gaming", "traveling"]
                }
            }
        },
        "originalXml": "<?xml version=\"1.0\"...>"
    }
    ```

Example Usage:
```bash
curl -X POST \
  http://localhost:3000/xml2json \
  -H 'Content-Type: text/plain' \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<user>
    <name>John Doe</name>
    <age>30</age>
    <address>
        <street>123 Main St</street>
        <city>New York</city>
        <country>USA</country>
    </address>
    <hobbies>
        <hobby>reading</hobby>
        <hobby>gaming</hobby>
        <hobby>traveling</hobby>
    </hobbies>
</user>'
```
#### POST /build-validation-rule
- **Description**: Builds a validation rule for data validation
- **Request Body**: 
    ```json
    {
        "fieldName": "email",
        "ruleType": "string",
        "parameters": {
            "required": true,
            "format": "email",
            "minLength": 5,
            "maxLength": 100
        }
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "message": "Validation rule generated successfully",
        "rule": {
            "field": "email",
            "type": "string",
            "required": true,
            "minLength": 5,
            "maxLength": 100,
            "format": "email"
        }
    }
    ```

#### POST /validate-with-rules
- **Description**: Validates data against a set of validation rules
- **Request Body**:
    ```json
    {
        "data": {
            "email": "john@example.com",
            "age": 25,
            "name": "John Doe"
        },
        "rules": [
            {
                "field": "email",
                "type": "string",
                "required": true,
                "format": "email"
            },
            {
                "field": "age",
                "type": "number",
                "required": true,
                "minimum": 18,
                "maximum": 100
            }
        ]
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "message": "Validation passed",
        "results": {
            "valid": true,
            "errors": []
        }
    }
    ```

#### POST /map-json
- **Description**: Maps data from source JSON to target JSON structure using mapping rules
- **Request Body**: 
    ```json
    {
        "sourceData": {
            "user": {
                "firstName": "John",
                "lastName": "Doe",
                "contact": {
                    "email": "john.doe@example.com",
                    "phone": "1234567890"
                },
                "addresses": [
                    {
                        "type": "home",
                        "street": "123 Main St"
                    }
                ]
            }
        },
        "targetStructure": {
            "person": {
                "fullName": "",
                "contactInfo": {
                    "emailAddress": "",
                    "phoneNumber": ""
                },
                "homeAddress": ""
            }
        },
        "mappingRules": [
            {
                "sourcePath": "user.firstName",
                "targetPath": "person.fullName",
                "transform": {
                    "type": "custom",
                    "function": "return value + ' ' + sourceData.user.lastName"
                }
            },
            {
                "sourcePath": "user.contact.email",
                "targetPath": "person.contactInfo.emailAddress"
            },
            {
                "sourcePath": "user.contact.phone",
                "targetPath": "person.contactInfo.phoneNumber"
            },
            {
                "sourcePath": "user.addresses[0].street",
                "targetPath": "person.homeAddress"
            }
        ]
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "message": "JSON data mapped successfully",
        "result": {
            "person": {
                "fullName": "John Doe",
                "contactInfo": {
                    "emailAddress": "john.doe@example.com",
                    "phoneNumber": "1234567890"
                },
                "homeAddress": "123 Main St"
            }
        },
        "original": {
            "source": { ... },
            "target": { ... },
            "mappingRules": [ ... ]
        }
    }
    ```
    
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

