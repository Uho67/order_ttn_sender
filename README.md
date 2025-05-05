# Order TTN Sender Copilot

## Description
A brief description of the project goes here. Explain the purpose and functionality of the application.
Main reason of creating :
  1 . team sell products and send orders to telegram chanel
  2 . store sends orders with Nova post
  3 . team should check if order is sent or not + ttn of orders
  So the codebase gets orders save them and map with ttn from nova posts, sends ttn to telegram chanel as response on order message

## Features
- List key features of the project.
- Highlight any unique aspects.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/order_ttn_sender_copilot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd order_ttn_sender_copilot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
Provide instructions on how to use the application. For example:
```bash
node app.js
```

## Configuration
Explain any configuration steps required, such as setting environment variables.

## Running the Application
### Backend (BE)
1. Navigate to the root directory of the project:
   ```bash
   cd order_ttn_sender_copilot
   ```
2. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

### Frontend (FE)
1. Navigate to the frontend directory:
   ```bash
   cd fe_part
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run serve
   ```
   The frontend will run on `http://localhost:8080`.

## Routes
### `GET /`
- **Description**: Welcome route to verify the server is running.
- **Response**: A welcome message.

### `POST /api/configuration`
- **Description**: Set a configuration value.
- **Request Body**:
  ```json
  {
    "config_path": "string",
    "value": "string"
  }
  ```
- **Response**: Confirmation of the configuration set.

### `POST /api/novaPostConnections`
- **Description**: Add a new Nova Post connection.
- **Request Body**:
  ```json
  {
    "name": "string",
    "token": "string"
  }
  ```
- **Response**: The newly created connection.

### `GET /api/novaPostConnections`
- **Description**: Fetch all Nova Post connections.
- **Response**: A list of connections.

### `DELETE /api/novaPostConnections/:id`
- **Description**: Delete a Nova Post connection by ID.
- **Response**: The deleted connection.

### `GET /api/orders`
- **Description**: Fetch all orders.
- **Response**: A list of orders.

### `GET /api/packages`
- **Description**: Fetch all packages.
- **Response**: A list of packages.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
Specify the license under which the project is distributed.

## Contact
Provide contact information or links for further inquiries.
