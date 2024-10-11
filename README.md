# VirtualPet

VirtualPet API allows users to manage virtual pets, including creating, updating, deleting, and interacting with the pets.

## Prerequisites

- Java
- Maven
- SpringBoot
- JWT
- MySQL
- JPA
- Lombok

The API will be available at:
http://localhost:8080/index.html

## Available Endpoints

### Register
`POST /petapp/register`
- Request:
  ```json
  {
    "userName": "john_doe",
    "userPassword": "password123",
    "userRole": "USER"
  }
  
### Login
`POST /petapp/login`
- Request:
  ```json
  {
  "userName": "john_doe",
  "userPassword": "password123"
  }
  
### Create a Pet
`POST /petapp/create`
- Request:
  ```json
  {
  "petName": "coco",
  "petColor": "original",
  "petBreed": "wolf"
  }
  
### View User's Pets
`GET /petapp/user/pets`

### View All Pets in Database (ADMIN only)
`GET /petapp/admin/pets`

### Update a Pet
`PUT /petapp/pet/update/{petId}`
- Request:
  ```json
  {
  "update": "change_name",
  "change": "Fido"
  }

### Interact with a Pet
`PUT /petapp/pet/action/{petId}`
- Request:
  ```json
  {
  "action": "play"
  }

### Delete a Pet
`DELETE /petapp/pet/delete/{petId}`

## Usage Examples (Postman)

### Register
  ```Postman
POST http://localhost:8080/petapp/register
Body:
raw:
JSON:
  {
    "userName": "john_doe",
    "userPassword": "password123",
    "userRole": "USER"
  }
```
### Login
  ```Postman
POST http://localhost:8080/petapp/login
Body:
raw:
JSON:
  {
    "userName": "john_doe",
    "userPassword": "password123"
  }
```
### Create a Pet
  ```Postman
POST http://localhost:8080/petapp/create
Authorization:
Auth Type:
Bearer Token: Token
Body:
raw:
JSON:
  {
    "petName": "coco",
    "petColor": "original",
    "petBreed": "wolf"
  }
```
### View User's Pets
  ```Postman
GET http://localhost:8080/petapp/user/pets
Authorization:
Auth Type:
Bearer Token: Token
```
### View All Pets in Database (ADMIN only)
  ```Postman
GET http://localhost:8080/petapp/admin/pets
Authorization:
Auth Type:
Bearer Token: Token
```
### Update a Pet
  ```Postman
PUT http://localhost:8080/petapp/pet/update/{petId}
Authorization:
Auth Type:
Bearer Token: Token
Body:
raw:
JSON:
  {
    "update": "change_name",
    "change": "Fido"
  }
```
### Interact with a Pet
  ```Postman
PUT http://localhost:8080/petapp/pet/action/{petId}
Authorization:
Auth Type:
Bearer Token: Token
Body:
raw:
JSON:
  {
    "action": "play"
  }
```
### Delete a Pet
  ```Postman
DELETE http://localhost:8080/petapp/pet/delete/{petId}
Authorization:
Auth Type:
Bearer Token: Token
```
## Authentication
The API uses token-based authentication. Include the token in the header of your requests:
  ```Postman
Authorization:
Auth Type:
Bearer Token: Token
```
