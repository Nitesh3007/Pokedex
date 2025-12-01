Pokedex Search App

A simple full-stack Pokedex application built for the assignment.
Users can search any Pokemon by name and view detailed information from the PokeAPI, powered by a backend caching layer for fast responses.

🌟 Features
✅ Backend (Node.js + Express)

REST API to fetch Pokémon details

Uses LRU Cache for:

Faster repeated responses

Cache expiry

Max cache entries

Handles:

Invalid Pokémon names

API failures

Timeouts

CORS-enabled for frontend usage

✅ Frontend (React + Vite)

Clean UI to search Pokémon by name

Displays:

Pokemon image

ID, height, weight

Abilities list

Loading and error handling

Responsive design

⚡ Backend Setup
1️⃣ Install Dependencies
cd backend
npm install

2️⃣ Start Backend Server
npm start

3️⃣ API Endpoints
🔍 Search Pokémon
GET http://localhost:3001/api/pokemon/:name

Example:
curl http://localhost:3001/api/pokemon/pikachu

Sample Response:
{
  "fromCache": false,
  "data": {
    "id": 25,
    "name": "pikachu",
    "height": 4,
    "weight": 60,
    "sprites": { ... }
  }
}

🎨 Frontend Setup
1️⃣ Install Dependencies
cd frontend
npm install

2️⃣ Start Frontend
npm run dev

Frontend runs at:

👉 http://localhost:5173

🚀 How It Works

Frontend calls your backend:

/api/pokemon/:name


Backend checks LRU cache:

If cached → returns instantly

If not → fetches from https://pokeapi.co
 and stores in cache


📦 Technologies Used
Backend

Node.js

Express.js

Axios

LRU Cache

Frontend

React

Vite

Fetch API