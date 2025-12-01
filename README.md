#  Pokedex Search App

A simple full-stack Pokémon search application built as part of an assignment.
Users can search for any Pokémon by name and view detailed information fetched from the **PokeAPI**, optimized through a **backend caching layer** for fast responses.

---

## 🌟 Features

###  Backend (Node.js + Express)

* REST API to fetch Pokémon details
* **LRU Cache** implementation for:

  * Faster repeated responses
  * Cache expiry
  * Maximum cache entries
* Error handling for:

  * Invalid Pokémon names
  * API failures
  * Timeouts
* CORS enabled for frontend usage

###  Frontend (React + Vite)

* Clean and responsive UI
* Search Pokémon by name
* Displays:

  * Image
  * ID, height, weight
  * Abilities
* Loading states & error messages

---

## ⚡ Backend Setup

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Start Backend Server

```bash
npm start
```

### 3️⃣ API Endpoints

#### 🔍 Search Pokémon

`GET http://localhost:3001/api/pokemon/:name`

##### Example:

```bash
curl http://localhost:3001/api/pokemon/pikachu
```

##### Sample Response:

```json
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
```

---

## 🎨 Frontend Setup

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Start Frontend

```bash
npm run dev
```

Frontend will run at:

👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🚀 How It Works

### 🔸 Frontend Flow

1. User searches a Pokémon by name
2. Frontend sends a request to:

   ```
   /api/pokemon/:name
   ```

### 🔸 Backend Flow

1. Check if Pokémon data exists in **LRU Cache**

   * If **cached →** return instantly
2. If **not cached →** fetch from
   `https://pokeapi.co`
3. Store result in cache
4. Return response to frontend

---

## 📦 Technologies Used

### **Backend**

* Node.js
* Express.js
* Axios
* LRU Cache

### **Frontend**

* React
* Vite
* Fetch API
