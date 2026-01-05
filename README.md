## 1. Project Goal

Build a **scalable, real-time casino website** capable of handling **~1,000 concurrent users**, with:

- Mobile-first, fully responsive UI
- Real-time gameplay using WebSockets
- Secure wallet & transaction handling
- Dockerized deployment
- Nginx as reverse proxy and load balancer

The system must be **scalable, stateless, production-ready**, and easy to extend.

---

## 2. Tech Stack (Mandatory)

### Frontend

- React (Vite or Next.js – decide during setup)
- Tailwind CSS
- Mobile-first responsive design
- Additional JS libraries for smooth UI:

  - Framer Motion (animations)
  - React Query / TanStack Query (data fetching)
  - Zustand or Redux Toolkit (state)
  - Socket.io-client (real-time)

### Backend

- Node.js
- Express.js
- REST APIs
- Socket.io (WebSockets)
- JWT authentication

### Infrastructure

- Docker
- Docker Compose
- Nginx (reverse proxy + load balancer)

### Data Layer

- MySql (primary database)
- Redis (cache, sessions, pub/sub)

---

## 3. High-Level Architecture

```
Client (Web/Mobile)
        ↓
      Nginx
        ↓
+-------------------+
|  API Services     |
|  (Node/Express)   |
+-------------------+
        ↓
+-------------------+
| WebSocket Service |
+-------------------+
        ↓
+-------------------+
| Game Engine       |
+-------------------+
        ↓
+-------------------+
| Wallet Service    |
+-------------------+
        ↓
MySql + Redis
```

---

## 4. Frontend Requirements (TODO)

### 4.1 General

- [ ] Mobile-first UI (primary target)
- [ ] Fully responsive across mobile, tablet, desktop
- [ ] Fast initial load (<2s on mobile)
- [ ] Smooth animations, no layout shifts
- [ ] Dark theme support

### 4.2 Pages

- [ ] Landing Page
- [ ] Login / Register
- [ ] User Dashboard
- [ ] Wallet Page
- [ ] Game Lobby
- [ ] Individual Game View (real-time)
- [ ] Bet History
- [ ] Profile & Settings

### 4.3 UI Components

- [ ] Responsive Navbar (mobile bottom nav)
- [ ] Game Cards
- [ ] Wallet Balance Widget
- [ ] Real-time Bet Feed
- [ ] Toast Notifications
- [ ] Loading Skeletons

### 4.4 Frontend Architecture

- [ ] Component-based folder structure
- [ ] API service abstraction
- [ ] WebSocket service abstraction
- [ ] Global auth state
- [ ] Route protection

---

## 5. Backend Requirements (TODO)

### 5.1 API Server (Express)

**Must be stateless**

- [ ] User authentication (JWT)
- [ ] User profile APIs
- [ ] Game list APIs
- [ ] Wallet balance API
- [ ] Transaction history API
- [ ] Admin APIs

### 5.2 WebSocket Server

- [ ] Handle real-time games
- [ ] Handle live bets
- [ ] Broadcast game results
- [ ] Redis Pub/Sub integration
- [ ] Sticky session support via Nginx

### 5.3 Game Engine Service

- [ ] Server-authoritative game logic
- [ ] Secure RNG execution
- [ ] Validate all bets server-side
- [ ] Generate results
- [ ] Emit events to WebSocket service

### 5.4 Wallet & Transaction Logic

**CRITICAL: ACID compliance required**

- [ ] Atomic balance updates
- [ ] Prevent double spending
- [ ] Transaction ledger
- [ ] Idempotent APIs
- [ ] Rollback on failure

---

## 6. Database Design (TODO)

### PostgreSQL Tables

- [ ] users
- [ ] wallets
- [ ] transactions
- [ ] games
- [ ] bets
- [ ] game_rounds

### Redis Usage

- [ ] Session cache
- [ ] Active games state
- [ ] Rate limiting
- [ ] WebSocket pub/sub
- [ ] Online users tracking

---

## 7. Docker Setup (TODO)

### Services

- [ ] nginx
- [ ] api-service
- [ ] websocket-service
- [ ] game-engine
- [ ] postgres
- [ ] redis

### Requirements

- [ ] Dockerfiles for each service
- [ ] docker-compose.yml
- [ ] Environment variables support
- [ ] Volume persistence for DB

---

## 8. Nginx Configuration (TODO)

- [ ] Reverse proxy setup
- [ ] Load balancing for API services
- [ ] WebSocket forwarding
- [ ] Rate limiting
- [ ] SSL termination
- [ ] Security headers

---

## 9. Security Requirements (Mandatory)

- [ ] HTTPS only
- [ ] JWT with short expiry
- [ ] Refresh token strategy
- [ ] Input validation
- [ ] SQL injection protection
- [ ] Server-side anti-cheat checks
- [ ] Audit logs

---

## 10. Performance Targets

- [ ] Handle 1,000 concurrent users
- [ ] API response < 200ms
- [ ] WebSocket latency < 100ms
- [ ] Zero downtime restarts

---

## 11. CI/CD

- [ ] GitHub repository
- [ ] Docker image build pipeline
- [ ] Auto deploy on main branch
- [ ] Nginx zero-downtime reload

---

## 12. Non-Functional Requirements

- [ ] Clean code
- [ ] Clear folder structure
- [ ] README updates
- [ ] Environment-based configs
- [ ] Logging & monitoring hooks

---

## 13. Important Design Rules

- Games must be **server-authoritative**
- Never trust client-side values
- Cache everything **except money**
- Wallet updates must be serialized
- WebSocket must not block API

---

## 14. Deliverables Expected

- Fully working Dockerized system
- Scalable architecture
- Clean frontend UI (mobile-first)
- Secure backend
- Clear documentation

---

## 15. Notes for the Implementer (Claude)

- Prioritize correctness over shortcuts
- Assume real money logic
- Follow production-grade patterns
- Design for scale, not demo usage

---

**End of README**

Project Structure

/home/dev/Documents/newfolder3/
├── docker-compose.yml # All services orchestration
├── .env # Environment variables
├── nginx/ # Reverse proxy & load balancer
├── database/ # MySQL schema & init scripts
├── backend/
│ ├── api-service/ # REST API (auth, users, wallet, games)
│ ├── websocket-service/ # Real-time Socket.io server
│ ├── game-engine/ # Provably fair game logic
│ └── wallet-service/ # ACID-compliant transactions
└── frontend/ # React/Vite mobile-first UI

Services Included

| Service        | Port      | Description                |
| -------------- | --------- | -------------------------- |
| Frontend       | 80        | React app via Nginx        |
| API Service    | 3001-3002 | Load balanced REST API     |
| WebSocket      | 3003      | Real-time game events      |
| Game Engine    | 3004      | Server-authoritative logic |
| Wallet Service | 3005      | Transaction processing     |
| MySQL          | 3306      | Primary database           |
| Redis          | 6379      | Cache & pub/sub            |
| phpMyAdmin     | 8080      | Database admin UI          |

To Run the Project

cd /home/dev/Documents/newfolder3
docker-compose up --build

Then access:

- Casino Website: http://localhost
- phpMyAdmin: http://localhost:8080 (user: casino_user, password: casino_password)

Features Implemented

- JWT authentication with refresh token rotation
- Provably fair RNG using HMAC-SHA256
- Real-time gameplay via WebSockets
- ACID-compliant wallet transactions
- Mobile-first responsive design with Tailwind CSS
- Three games: Dice, Crash, and Roulette
- Rate limiting and security headers via Nginx
- Redis-backed session caching and pub/sub



Docker Down

docker-compose down --remove-orphans

Start

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build