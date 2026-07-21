# ConnectHub

A temporary real-time private chat application built with **Java Spring Boot** and **React**. Users can create or join private rooms using a 6-character room code and chat in real-time without any message history.

---

## Features

### Authentication
- User Registration with email validation
- User Login with JWT Authentication
- BCrypt Password Encryption
- Protected APIs with JWT
- Logout (frontend removes JWT)

### Room Features
- Create Room with auto-generated 6-character code
- Join Room using room code
- Maximum 2 participants per room
- Third user is prevented from joining
- Leave Room functionality
- Room auto-deletes when all users leave

### Chat Features
- Real-time messaging via WebSocket (STOMP + SockJS)
- Private two-user chat only
- No database storage for messages
- No chat history - messages disappear after leaving
- Online user count display
- "User Joined" and "User Left" notifications

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.2 |
| Security | Spring Security, JWT |
| Database | PostgreSQL, Spring Data JPA |
| Real-time | Spring WebSocket, STOMP, SockJS |
| Frontend | React 18, Vite, Tailwind CSS |
| HTTP Client | Axios |
| Build Tool | Maven |

---

## Project Structure

```
ConnectHub/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/connecthub/
│       │   ├── ConnectHubApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java
│       │   │   └── WebSocketConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── RoomController.java
│       │   │   └── UserController.java
│       │   ├── dto/
│       │   │   ├── ApiResponse.java
│       │   │   ├── AuthResponse.java
│       │   │   ├── ChatMessage.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── RegisterRequest.java
│       │   │   ├── RoomRequest.java
│       │   │   ├── RoomResponse.java
│       │   │   └── UserProfileResponse.java
│       │   ├── entity/
│       │   │   ├── Room.java
│       │   │   └── User.java
│       │   ├── exception/
│       │   │   ├── DuplicateEmailException.java
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── InvalidCredentialsException.java
│       │   │   ├── ResourceNotFoundException.java
│       │   │   ├── RoomFullException.java
│       │   │   └── RoomNotFoundException.java
│       │   ├── repository/
│       │   │   ├── RoomRepository.java
│       │   │   └── UserRepository.java
│       │   ├── security/
│       │   │   ├── CustomUserDetailsService.java
│       │   │   └── JwtAuthenticationFilter.java
│       │   ├── service/
│       │   │   ├── AuthService.java
│       │   │   ├── RoomService.java
│       │   │   ├── UserService.java
│       │   │   └── impl/
│       │   │       ├── AuthServiceImpl.java
│       │   │       ├── RoomServiceImpl.java
│       │   │       └── UserServiceImpl.java
│       │   ├── util/
│       │   │   ├── JwtUtil.java
│       │   │   └── RoomCodeGenerator.java
│       │   └── websocket/
│       │       ├── ChatWebSocketController.java
│       │       └── WebSocketEventListener.java
│       └── resources/
│           └── application.properties
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   └── ChatRoom.jsx
│       └── utils/
│           └── api.js
└── README.md
```

---

## PostgreSQL Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE connecthub;
```

2. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/connecthub
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Tables are auto-created by JPA (`spring.jpa.hibernate.ddl-auto=update`)

---

## Backend Setup

1. Open `backend/` folder in IntelliJ IDEA
2. Wait for Maven to download dependencies
3. Update `application.properties` with your PostgreSQL credentials
4. Run `ConnectHubApplication.java`
5. Server starts on `http://localhost:8080`

---

## Frontend Setup

1. Open `frontend/` folder in VS Code
2. Install dependencies:
```bash
cd frontend
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open `http://localhost:5173`

---

## API Documentation

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Rooms (Protected - Bearer Token Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms/create` | Create a new room |
| POST | `/api/rooms/join` | Join a room by code |
| POST | `/api/rooms/leave` | Leave current room |
| GET | `/api/rooms/{roomCode}` | Get room details |

### User (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |

---

## WebSocket Flow

1. Connect to `ws://localhost:8080/ws` using SockJS
2. Subscribe to `/topic/room/{roomCode}` to receive messages
3. Send messages to:
   - `/app/chat/{roomCode}/join` - When joining
   - `/app/chat/{roomCode}/send` - Send chat message
   - `/app/chat/{roomCode}/leave` - When leaving

### Message Types
- `JOIN` - User joined notification
- `LEAVE` - User left notification
- `CHAT` - Regular chat message
- `COUNT` - Online user count update

---

## Future Enhancements
- Typing indicators
- Message reactions
- File sharing
- Room expiration timer
- User avatars
- Dark mode

---

## Author
Built for Java Backend Developer Portfolio - Fresher Level
