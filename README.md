# Real-Time Dashboard

This project is a full-stack application that provides a real-time dashboard displaying data through multiple communication methods. It utilizes React.js for the frontend and FastAPI for the backend, supporting both WebSocket and REST API for data retrieval.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Running Test Cases](#running-test-cases)
- [Sending Messages to WebSocket](#sending-messages-to-websocket)
- [Technical Choices](#technical-choices)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [AI Tools Used](#ai-tools-used)

## Technologies Used

- **Frontend**: React.js, WebSocket, CSS
- **Backend**: Python, FastAPI, WebSocket, REST API
- **Containerization**: Docker, Docker Compose

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Anirudhpsr/real-time-dashboard.git
   cd real-time-dashboard
   ```

## Running the Application

To run the entire application stack, use Docker Compose:

1. Ensure Docker and Docker Compose are installed on your machine.
2. From the root of the project, run:
   ```bash
   docker-compose up --build
   ```
3. Access the frontend application at `http://localhost:3000`.

## Running Test Cases

### Backend Test Cases
1. First, install the required dependencies:
   ```bash
   pip install fastapi httpx pytest
   ```
2. Run the backend test cases using `pytest`:
   ```bash
   pytest .\backend\tests\test_main.py
   ```

### Frontend Test Cases
To run the frontend test cases:
1. Install `react-scripts` if not already installed:
   ```bash
   npm install react-scripts
   ```
2. Run the tests:
   ```bash
   npm test
   ```

## Sending Messages to WebSocket

To send a message to the WebSocket, use Postman:

1. Open Postman.
2. Send a `POST` request to the following URL:
   ```
   http://localhost:8000/api/send-message
   ```
3. Use the following JSON body:
   ```json
   {
       "value": "Testing Completed",
       "status": 1
   }
   ```

## Technical Choices

- **Frontend**: React.js was chosen for its component-based architecture, allowing for a responsive and dynamic user interface. WebSocket is used for real-time data updates, while REST API is utilized for fetching historical data.
- **Backend**: FastAPI was selected for its performance and ease of use in creating APIs. It supports asynchronous programming, making it suitable for handling WebSocket connections efficiently.
- **Containerization**: Docker is used to ensure consistent environments across development and production, simplifying deployment.

## Assumptions and Limitations

- The application assumes a stable internet connection for WebSocket communication.
- Historical data is fetched using short polling every 30 seconds, which may not be suitable for applications requiring real-time accuracy.
- Error handling is implemented, but edge cases may need further refinement based on specific use cases.

## AI Tools Used

- AI tools were utilized to generate boilerplate code for the React components and FastAPI routes. 
- Modifications were made to enhance functionality, such as adding error handling and improving the user interface.
- The custom hook `useWebSocket` was generated with AI assistance and then refined to better manage WebSocket connections.
- **Claude** was used to assist with frontend design, providing suggestions and improvements for the user interface.

This README provides a comprehensive overview of the project, its setup, and its technical choices. For further details, please refer to the individual component and service documentation within the project.