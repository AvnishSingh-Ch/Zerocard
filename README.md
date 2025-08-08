# 🃏 Zerocard - Smart Learning System

A modern, vanilla JavaScript flashcard application for efficient learning and memorization.

## ✨ Features

- 📚 **Deck Management** - Organize cards into custom decks
- 🎯 **Interactive Study Sessions** - Type answers and get similarity feedback
- 📊 **Progress Tracking** - Monitor learning statistics and streaks
- 💾 **Local Storage** - All data saved in your browser
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **No Backend Required** - Pure client-side application

## 🚀 Quick Start

### Option 1: Direct Deployment
1. Upload all files to any static hosting service
2. Access `index.html` in your browser
3. Start creating and studying flashcards!

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/AvnishSingh-Ch/Zerocard.git
cd Zerocard

# Serve locally (Python 3)
python -m http.server 8000

# Or use any static file server
# Then open http://localhost:8000
```

### Option 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🛠 Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: Browser localStorage
- **Deployment**: Static hosting (Vercel, Netlify, GitHub Pages)
- **No Dependencies**: Pure web technologies

## 📁 Project Structure

```
Zerocard/
├── index.html          # Main application page
├── script.js           # Core application logic
├── styles.css          # Application styling
├── vercel.json         # Deployment configuration
└── README.md           # This file
```

## 🎯 Usage

1. **Create Decks**: Organize your flashcards by topic
2. **Add Cards**: Create question/answer pairs with difficulty levels
3. **Study**: Interactive sessions with answer checking
4. **Track Progress**: Monitor your learning statistics
5. **Export/Import**: Backup your data as JSON files

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 License

MIT License - see LICENSE file for details