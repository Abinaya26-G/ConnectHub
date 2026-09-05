# ConnectHub

ConnectHub is a simple real-time private chat application made using Java Spring Boot and React.

Users can register, login, create a room or join a room using a 6-character room code. Only two users can be in a room and they can chat with each other in real time.

## Features

* User registration and login
* JWT authentication
* BCrypt password encryption
* Create and join rooms
* Maximum 2 users per room
* Real-time chat
* Join and leave notifications
* Online user count
* No chat history
* Room gets deleted when both users leave

## Technologies Used

* Java 21
* Spring Boot
* Spring Security
* JWT
* PostgreSQL
* Spring Data JPA
* WebSocket
* STOMP
* React
* Vite
* Tailwind CSS
* Axios
* Maven

## How to Run

### Backend

Go to the backend folder:

```bash
cd backend
```

Update the PostgreSQL username and password in `application.properties`.

Then run:

```bash
mvn spring-boot:run
```

Backend will run on:

`http://localhost:8080`

### Frontend

Go to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

`http://localhost:5173`

## Database

Create a PostgreSQL database named:

```sql
CREATE DATABASE connecthub;
```

JPA will create the required tables automatically.

## WebSocket

The chat uses WebSocket with STOMP and SockJS for real-time messaging.

Users can:

* Join a room
* Send messages
* Receive messages instantly
* Leave the room

## Future Improvements

* Typing indicator
* File sharing
* Message reactions
* Profile pictures
* Dark mode

## Author

Abinaya
