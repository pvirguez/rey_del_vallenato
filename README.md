# Rey del Acordeón - Accordion Learning Tracker

A sleek, dark-mode kanban board to track your accordion learning journey. Move songs through different stages as you progress from wanting to learn them to mastering them.

## Features

- **Kanban Board**: 4 columns (Want to Learn, Currently Learning, Learned, Mastered)
- **Drag & Drop**: Easily move songs between statuses
- **YouTube Integration**: Add tutorial links to each song
- **Difficulty Levels**: Tag songs as Beginner, Intermediate, or Advanced
- **Dark Mode UI**: Clean, modern interface built with vanilla CSS

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Deployment**: Vercel (frontend) + Railway (backend)

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your browser, or use a simple HTTP server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js (install globally first: npm install -g http-server)
http-server -p 8080
```

3. Open `http://localhost:8080` in your browser

**Important**: Make sure the backend is running before using the frontend.

## Deployment

### Backend (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect the Node.js project
4. Set the root directory to `backend`
5. Railway will automatically run `npm install` and `npm start`
6. Copy the deployed URL (e.g., `https://your-app.railway.app`)

**Note**: The SQLite database file will persist on Railway's volume storage.

### Frontend (Vercel)

1. Navigate to the frontend directory
2. Update the API URL in `app.js`:
```javascript
const API_URL = 'https://your-backend-url.railway.app/api';
```

3. Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

4. Follow the prompts to deploy

Alternatively, connect your GitHub repo to Vercel and set the root directory to `frontend`.

## Usage

1. Click "Add New Song" to create a new song card
2. Fill in the song title, YouTube tutorial link (optional), difficulty, and initial status
3. Drag and drop cards between columns to update their status
4. Click the × button to delete a song
5. Click "Watch Tutorial" to open the YouTube link in a new tab

## Customization

### Changing Colors

Edit the CSS variables in `frontend/styles.css`:

```css
:root {
    --bg-primary: #0f0f23;        /* Main background */
    --bg-secondary: #1a1a2e;      /* Column background */
    --bg-card: #1f2937;           /* Card background */
    --accent-primary: #6366f1;    /* Primary accent color */
    /* ... more variables */
}
```

### Adding New Statuses

1. Update the database schema in `backend/db.js`
2. Add the new column in `frontend/index.html`
3. Update the statuses array in `frontend/app.js`

## API Endpoints

- `GET /api/songs` - Get all songs
- `POST /api/songs` - Create a new song
- `PUT /api/songs/:id` - Update a song
- `DELETE /api/songs/:id` - Delete a song
- `GET /health` - Health check

## Database Schema

```sql
CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  youtube_url TEXT,
  difficulty TEXT CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  status TEXT CHECK(status IN ('Want to Learn', 'Currently Learning', 'Learned', 'Mastered')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## License

MIT

## Contributing

Feel free to fork and customize this project for your own use!
