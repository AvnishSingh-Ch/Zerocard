// Firebase functions will be added later - for now, working offline only

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app && window.app.showNotification) {
        window.app.showNotification('❌ An error occurred. Please refresh if issues persist.');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.app && window.app.showNotification) {
        window.app.showNotification('❌ An error occurred. Please refresh if issues persist.');
    }
});

class Zerocard {
    constructor() {
        try {
            this.currentUser = null;
            this.decks = {};
            this.currentDeck = 'default';
            this.currentCard = null;
            this.studyQueue = [];
            this.currentIndex = 0;
            this.sessionStats = { 
                correct: 0, 
                total: 0, 
                streak: 0, 
                maxStreak: 0,
                xp: 0,
                focusScore: 85
            };
            this.isAnswerShown = false;
            this.isOnline = navigator.onLine;
            
            this.initializeElements();
            this.attachEventListeners();
            this.initializeAuth();
            console.log('🃏 Zerocard initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing Zerocard:', error);
            this.showErrorMessage('Failed to initialize application. Please refresh the page.');
        }
    }

    initializeElements() {
        // Form elements
        this.newWordInput = document.getElementById('new-word');
        this.wordDefinitionInput = document.getElementById('word-definition');
        this.addWordBtn = document.getElementById('add-word-btn');
        this.cardDeckSelect = document.getElementById('card-deck');
        this.cardDifficultySelect = document.getElementById('card-difficulty');
        
        // Deck management
        this.deckSelector = document.getElementById('deck-selector');
        this.newDeckInput = document.getElementById('new-deck');
        this.createDeckBtn = document.getElementById('create-deck-btn');
        
        // Flashcard elements
        this.flashcard = document.getElementById('flashcard');
        this.definition = document.getElementById('definition');
        this.result = document.getElementById('result');
        this.feedbackResponse = document.getElementById('feedback-response');
        this.answerInputContainer = document.getElementById('answer-input-container');
        this.userAnswerInput = document.getElementById('user-answer');
        this.checkAnswerBtn = document.getElementById('check-answer-btn');
        
        // Control buttons
        this.startBtn = document.getElementById('start-btn');
        this.showAnswerBtn = document.getElementById('show-answer-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        // Display elements
        this.focusScoreDisplay = document.getElementById('focus-score');
        this.streakDisplay = document.getElementById('streak');
        this.xpDisplay = document.getElementById('xp-points');
        this.cardList = document.getElementById('card-list');
        this.cardCount = document.getElementById('card-count');
        this.currentDeckName = document.getElementById('current-deck-name');
        
        // Stats
        this.totalCardsDisplay = document.getElementById('total-cards');
        this.newCardsDisplay = document.getElementById('new-cards');
        this.learningCardsDisplay = document.getElementById('learning-cards');
        this.reviewCardsDisplay = document.getElementById('review-cards');
        
        // Browser controls
        this.searchCards = document.getElementById('search-cards');
        this.filterDeck = document.getElementById('filter-deck');
        this.exportBtn = document.getElementById('export-btn');
    }

    initializeAuth() {
        // Initialize without Firebase for now - working offline only
        this.currentUser = null;
        this.decks = this.loadLocalDecks();
        this.updateDisplay();
        
        // Check online status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('🌐 Back online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('📱 Offline mode');
        });
    }

    async onUserSignedIn() {
        this.showNotification(`👋 Welcome back, ${this.currentUser.email}!`);
        this.hideAuthModals();
        this.showUserInfo();
        
        // Load user data from cloud
        await this.loadUserData();
        this.updateDisplay();
    }

    onUserSignedOut() {
        this.showNotification('👋 Signed out successfully');
        this.decks = this.loadLocalDecks();
        this.hideUserInfo();
        this.updateDisplay();
    }

    async loadUserData() {
        // Working offline only for now
        this.decks = this.loadLocalDecks();
    }

    convertCardsToDecks(cards) {
        const decks = {};
        
        cards.forEach(card => {
            const deckId = card.deck || 'default';
            if (!decks[deckId]) {
                decks[deckId] = {
                    name: card.deckName || (deckId === 'default' ? 'Default Deck' : deckId),
                    cards: []
                };
            }
            decks[deckId].cards.push(card);
        });

        // Ensure default deck exists
        if (!decks.default) {
            decks.default = {
                name: 'Default Deck',
                cards: []
            };
        }

        return decks;
    }

    async syncLocalToCloud() {
        // Firebase sync disabled for now - working offline only
        return;
    }

    async syncData() {
        if (!this.currentUser || !this.isOnline) return;
        await this.loadUserData();
    }

    showUserInfo() {
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userInfo && this.currentUser) {
            userInfo.innerHTML = `
                <div class="user-profile">
                    <span class="user-email">${this.currentUser.email}</span>
                    <button id="sign-out-btn" class="btn secondary">Sign Out</button>
                </div>
            `;
            userInfo.classList.remove('hidden');
            
            document.getElementById('sign-out-btn').addEventListener('click', () => this.handleSignOut());
        }
        
        if (authButtons) {
            authButtons.classList.add('hidden');
        }
    }

    hideUserInfo() {
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userInfo) {
            userInfo.classList.add('hidden');
        }
        
        if (authButtons) {
            authButtons.classList.remove('hidden');
        }
    }

    attachEventListeners() {
        // Authentication - disabled for now
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showNotification('🔐 Authentication coming soon - working offline for now');
            });
        }

        // Card creation
        if (this.addWordBtn) {
            this.addWordBtn.addEventListener('click', () => this.addCard());
        }
        if (this.newWordInput) {
            this.newWordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addCard();
                }
            });
        }
        
        // Deck management
        if (this.createDeckBtn) {
            this.createDeckBtn.addEventListener('click', () => this.createDeck());
        }
        if (this.deckSelector) {
            this.deckSelector.addEventListener('change', (e) => this.switchDeck(e.target.value));
        }
        
        // Study controls
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startStudying());
        }
        if (this.showAnswerBtn) {
            this.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextCard());
        }
        
        // Answer checking
        if (this.checkAnswerBtn) {
            this.checkAnswerBtn.addEventListener('click', () => this.checkUserAnswer());
        }
        if (this.userAnswerInput) {
            this.userAnswerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    this.checkUserAnswer();
                }
            });
        }
        
        // Feedback response system
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('response-btn')) {
                this.handleFeedbackResponse(e.target.dataset.response);
            }
        });
        
        // Search and filter
        if (this.searchCards) {
            this.searchCards.addEventListener('input', () => this.filterCards());
        }
        if (this.filterDeck) {
            this.filterDeck.addEventListener('change', () => this.filterCards());
        }
        
        // Export
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportCards());
        }
    }

    showSignInModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔐 Sign In</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="sign-in-form">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="signin-email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="signin-password" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn primary">Sign In</button>
                            <button type="button" class="btn secondary switch-to-signup">Need an account? Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.switch-to-signup').addEventListener('click', () => {
            modal.remove();
            this.showSignUpModal();
        });

        modal.querySelector('#sign-in-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            // Firebase authentication disabled for now
            this.showNotification('🔐 Authentication coming soon - working offline');
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    showSignUpModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📝 Sign Up</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="sign-up-form">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="signup-password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" id="signup-confirm-password" required minlength="6">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn primary">Sign Up</button>
                            <button type="button" class="btn secondary switch-to-signin">Have an account? Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.switch-to-signin').addEventListener('click', () => {
            modal.remove();
            this.showSignInModal();
        });

        modal.querySelector('#sign-up-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = modal.querySelector('#signup-email').value;
            const password = modal.querySelector('#signup-password').value;
            const confirmPassword = modal.querySelector('#signup-confirm-password').value;
            
            if (password !== confirmPassword) {
                this.showNotification('❌ Passwords do not match');
                return;
            }
            
            // Firebase authentication disabled for now
            this.showNotification('🔐 Authentication coming soon - working offline');
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    hideAuthModals() {
        const modals = document.querySelectorAll('.auth-modal');
        modals.forEach(modal => modal.remove());
    }

    async handleSignOut() {
        // Firebase authentication disabled for now
        this.showNotification('🔐 Authentication coming soon');
    }

    loadLocalDecks() {
        const saved = localStorage.getItem('zerocard-decks');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            default: {
                name: 'Default Deck',
                cards: [
                    this.createCard('What is a flashcard?', 'A card bearing information on both sides, used for studying and memorization'),
                    this.createCard('What is spaced repetition?', 'A learning technique that incorporates increasing intervals of time between reviews'),
                    this.createCard('What is active recall?', 'A principle of efficient learning that claims retrieving information from memory strengthens memory'),
                    this.createCard('What is the testing effect?', 'The finding that long-term memory is enhanced when some of the learning period is devoted to retrieving information'),
                    this.createCard('What is metacognition?', 'Awareness and understanding of one\'s own thought processes')
                ]
            }
        };
    }

    createCard(front, back, difficulty = 'medium', deck = 'default') {
        return {
            id: Date.now() + Math.random(),
            front: front,
            back: back,
            deck: deck,
            difficulty: difficulty,
            status: 'new',
            confidence: 0,
            nextReview: new Date(),
            created: new Date(),
            lastReviewed: null,
            reviewCount: 0,
            streakCount: 0
        };
    }

    saveLocalDecks() {
        localStorage.setItem('zerocard-decks', JSON.stringify(this.decks));
    }

    async saveDecks() {
        // Save locally only for now
        this.saveLocalDecks();
    }

    createDeck() {
        if (!this.newDeckInput) return;
        
        const deckName = this.newDeckInput.value.trim();
        if (!deckName) {
            this.showNotification('❌ Please enter a deck name');
            return;
        }
        
        const deckId = deckName.toLowerCase().replace(/\s+/g, '-');
        if (this.decks[deckId]) {
            this.showNotification('❌ Deck already exists');
            return;
        }
        
        this.decks[deckId] = {
            name: deckName,
            cards: []
        };
        
        this.saveDecks();
        this.updateDeckSelectors();
        this.newDeckInput.value = '';
        this.showNotification(`✅ Created deck: ${deckName}`);
    }

    switchDeck(deckId) {
        this.currentDeck = deckId;
        this.showNotification(`📚 Switched to: ${this.decks[deckId].name}`);
        this.updateDisplay();
        
        if (this.filterDeck) {
            this.filterDeck.value = deckId;
        }
    }

    addCard() {
        if (!this.newWordInput || !this.wordDefinitionInput) return;
        
        const front = this.newWordInput.value.trim();
        const back = this.wordDefinitionInput.value.trim();
        const deck = this.cardDeckSelect ? this.cardDeckSelect.value : 'default';
        const difficulty = this.cardDifficultySelect ? this.cardDifficultySelect.value : 'medium';
        
        if (!front || !back) {
            this.showNotification('❌ Please fill in both question and answer');
            return;
        }
        
        const card = this.createCard(front, back, difficulty, deck);
        
        if (!this.decks[deck]) {
            this.decks[deck] = { name: deck, cards: [] };
        }
        
        this.decks[deck].cards.push(card);
        
        this.saveDecks();
        this.updateDisplay();
        
        this.newWordInput.value = '';
        this.wordDefinitionInput.value = '';
        
        this.showNotification('✅ Card created successfully!');
    }

    confirmDeleteCard(cardId) {
        let cardToDelete = null;
        let deckName = '';
        
        Object.keys(this.decks).forEach(deckId => {
            const card = this.decks[deckId].cards.find(c => c.id === cardId);
            if (card) {
                cardToDelete = card;
                deckName = this.decks[deckId].name;
            }
        });
        
        if (!cardToDelete) return;
        
        const modal = document.createElement('div');
        modal.className = 'delete-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🗑️ Delete Card</h3>
                </div>
                <div class="modal-body">
                    <p><strong>Are you sure you want to delete this card?</strong></p>
                    <div class="card-preview">
                        <div class="preview-question"><strong>Q:</strong> ${this.truncateText(cardToDelete.front, 60)}</div>
                        <div class="preview-answer"><strong>A:</strong> ${this.truncateText(cardToDelete.back, 60)}</div>
                        <div class="preview-deck">📚 From: ${deckName}</div>
                    </div>
                    <p class="warning">⚠️ This action cannot be undone!</p>
                </div>
                <div class="modal-footer">
                    <button class="btn secondary cancel-btn">Cancel</button>
                    <button class="btn danger confirm-delete-btn">Delete Card</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.confirm-delete-btn').addEventListener('click', () => {
            this.deleteCard(cardId);
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    async deleteCard(cardId) {
        Object.keys(this.decks).forEach(deckId => {
            this.decks[deckId].cards = this.decks[deckId].cards.filter(card => card.id !== cardId);
        });
        
        this.saveDecks();
        this.updateDisplay();
        this.showNotification('🗑️ Card deleted successfully');
    }

    editCard(cardId) {
        let cardToEdit = null;
        
        Object.keys(this.decks).forEach(id => {
            const card = this.decks[id].cards.find(c => c.id === cardId);
            if (card) {
                cardToEdit = card;
            }
        });
        
        if (!cardToEdit) return;
        
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✏️ Edit Card</h3>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Question/Front</label>
                        <textarea id="edit-front" rows="2">${cardToEdit.front}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Answer/Back</label>
                        <textarea id="edit-back" rows="3">${cardToEdit.back}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Difficulty</label>
                            <select id="edit-difficulty">
                                <option value="easy" ${cardToEdit.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                                <option value="medium" ${cardToEdit.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="hard" ${cardToEdit.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn secondary cancel-btn">Cancel</button>
                    <button class="btn primary save-btn">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.save-btn').addEventListener('click', () => {
            const newFront = modal.querySelector('#edit-front').value.trim();
            const newBack = modal.querySelector('#edit-back').value.trim();
            const newDifficulty = modal.querySelector('#edit-difficulty').value;
            
            if (!newFront || !newBack) {
                this.showNotification('❌ Please fill in both question and answer');
                return;
            }
            
            cardToEdit.front = newFront;
            cardToEdit.back = newBack;
            cardToEdit.difficulty = newDifficulty;
            
            this.saveDecks();
            this.updateDisplay();
            this.showNotification('✅ Card updated successfully');
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    startStudying() {
        const allCards = this.getAllCards();
        if (allCards.length === 0) {
            this.showNotification('❌ No cards to study. Add some cards first!');
            return;
        }
        
        this.studyQueue = [...allCards];
        this.shuffleArray(this.studyQueue);
        this.currentIndex = 0;
        this.sessionStats = { 
            correct: 0, 
            total: 0, 
            streak: 0, 
            maxStreak: 0,
            xp: this.sessionStats.xp,
            focusScore: this.sessionStats.focusScore
        };
        
        this.showCurrentCard();
        this.startBtn.classList.add('hidden');
        this.showAnswerBtn.classList.remove('hidden');
    }

    showCurrentCard() {
        if (this.currentIndex >= this.studyQueue.length) {
            this.showSessionComplete();
            return;
        }
        
        this.currentCard = this.studyQueue[this.currentIndex];
        this.isAnswerShown = false;
        this.userAnswerSubmitted = false;
        
        this.definition.textContent = this.currentCard.front;
        this.result.classList.add('hidden');
        this.feedbackResponse.classList.add('hidden');
        this.answerInputContainer.classList.remove('hidden');
        this.showAnswerBtn.classList.add('hidden');
        
        // Clear and focus on answer input
        if (this.userAnswerInput) {
            this.userAnswerInput.value = '';
            this.userAnswerInput.focus();
        }
    }

    checkUserAnswer() {
        if (!this.currentCard || this.userAnswerSubmitted) return;
        
        const userAnswer = this.userAnswerInput.value.trim();
        const correctAnswer = this.currentCard.back;
        
        if (!userAnswer) {
            this.showNotification('❌ Please type your answer first');
            return;
        }
        
        this.userAnswerSubmitted = true;
        
        // Calculate similarity
        const similarity = this.calculateSimilarity(userAnswer, correctAnswer);
        
        // Hide input container and show comparison
        this.answerInputContainer.classList.add('hidden');
        this.showAnswerComparison(userAnswer, correctAnswer, similarity);
        
        // Show feedback response for self-assessment
        this.feedbackResponse.classList.remove('hidden');
        
        // Update card stats
        this.currentCard.lastReviewed = new Date();
        this.currentCard.reviewCount++;
    }

    showAnswerComparison(userAnswer, correctAnswer, similarity) {
        this.result.classList.remove('hidden');
        this.result.className = 'result with-comparison';
        
        let similarityClass = 'similarity-low';
        let similarityText = 'Low similarity';
        let encouragement = 'Keep practicing! 💪';
        
        if (similarity >= 0.8) {
            similarityClass = 'similarity-high';
            similarityText = 'Excellent match!';
            encouragement = 'Great job! 🎉';
        } else if (similarity >= 0.5) {
            similarityClass = 'similarity-medium';
            similarityText = 'Good attempt!';
            encouragement = 'You\'re on the right track! 👍';
        }
        
        this.result.innerHTML = `
            <div class="answer-comparison">
                <div class="user-answer-display">
                    <div class="answer-label">Your Answer:</div>
                    <div class="answer-text">${userAnswer}</div>
                </div>
                <div class="correct-answer-display">
                    <div class="answer-label">Correct Answer:</div>
                    <div class="answer-text">${correctAnswer}</div>
                </div>
                <div class="similarity-score ${similarityClass}">
                    ${similarityText} (${Math.round(similarity * 100)}% match) - ${encouragement}
                </div>
            </div>
        `;
        
        this.isAnswerShown = true;
    }

    calculateSimilarity(str1, str2) {
        // Simple similarity calculation based on common words and character similarity
        const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
        const text1 = normalize(str1);
        const text2 = normalize(str2);
        
        // Exact match
        if (text1 === text2) return 1.0;
        
        // Word-based similarity
        const words1 = text1.split(/\s+/);
        const words2 = text2.split(/\s+/);
        const allWords = new Set([...words1, ...words2]);
        
        let commonWords = 0;
        allWords.forEach(word => {
            if (words1.includes(word) && words2.includes(word)) {
                commonWords++;
            }
        });
        
        const wordSimilarity = commonWords / Math.max(words1.length, words2.length);
        
        // Character-based similarity (Levenshtein-inspired)
        const maxLength = Math.max(text1.length, text2.length);
        if (maxLength === 0) return 1.0;
        
        const distance = this.levenshteinDistance(text1, text2);
        const charSimilarity = 1 - (distance / maxLength);
        
        // Combine both similarities (weighted towards word similarity for better results)
        return (wordSimilarity * 0.7) + (charSimilarity * 0.3);
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    showAnswer() {
        // This method is now mainly for the "Show Answer" button if user wants to skip typing
        if (!this.isAnswerShown && this.currentCard) {
            this.answerInputContainer.classList.add('hidden');
            this.result.classList.remove('hidden');
            this.result.textContent = this.currentCard.back;
            this.result.className = 'result';
            this.isAnswerShown = true;
            
            this.showAnswerBtn.classList.add('hidden');
            this.feedbackResponse.classList.remove('hidden');
        }
    }

    handleFeedbackResponse(response) {
        if (!this.currentCard) return;
        
        this.currentCard.lastReviewed = new Date();
        this.currentCard.reviewCount++;
        
        const confidenceChanges = {
            struggle: -15,
            think: -5,
            flow: +10,
            instant: +20
        };
        
        this.currentCard.confidence = Math.max(0, Math.min(100, 
            this.currentCard.confidence + confidenceChanges[response]
        ));
        
        if (response === 'flow' || response === 'instant') {
            this.sessionStats.correct++;
            this.sessionStats.streak++;
            this.sessionStats.maxStreak = Math.max(this.sessionStats.maxStreak, this.sessionStats.streak);
            this.sessionStats.xp += response === 'instant' ? 15 : 10;
        } else {
            this.sessionStats.streak = 0;
            this.sessionStats.xp += response === 'think' ? 5 : 2;
        }
        
        this.sessionStats.total++;
        
        if (response === 'instant' && this.currentCard.confidence > 80) {
            this.currentCard.status = 'mastered';
        } else if (response === 'struggle') {
            this.currentCard.status = 'learning';
        } else {
            this.currentCard.status = 'review';
        }
        
        this.saveDecks();
        this.updateSessionStats();
        
        this.feedbackResponse.classList.add('hidden');
        this.nextBtn.classList.remove('hidden');
    }

    nextCard() {
        this.currentIndex++;
        this.nextBtn.classList.add('hidden');
        this.showAnswerBtn.classList.remove('hidden');
        this.userAnswerSubmitted = false;
        this.showCurrentCard();
    }

    showSessionComplete() {
        const accuracy = this.sessionStats.total > 0 ? 
            Math.round((this.sessionStats.correct / this.sessionStats.total) * 100) : 0;
        
        let message = `🎉 Session Complete!\n\n`;
        message += `📊 Cards studied: ${this.sessionStats.total}\n`;
        message += `🎯 Accuracy: ${accuracy}%\n`;
        message += `🔥 Best streak: ${this.sessionStats.maxStreak}\n`;
        message += `⚡ XP earned: ${this.sessionStats.xp}`;
        
        this.definition.textContent = message;
        this.result.classList.add('hidden');
        this.feedbackResponse.classList.add('hidden');
        this.answerInputContainer.classList.add('hidden');
        
        this.nextBtn.classList.add('hidden');
        this.showAnswerBtn.classList.add('hidden');
        this.startBtn.classList.remove('hidden');
        this.startBtn.innerHTML = '<span class="btn-icon">🚀</span><span>Study More</span>';
        
        this.updateDisplay();
    }

    getAllCards() {
        const allCards = [];
        Object.values(this.decks).forEach(deck => {
            allCards.push(...deck.cards);
        });
        return allCards;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    filterCards() {
        const searchTerm = this.searchCards ? this.searchCards.value.toLowerCase() : '';
        const deckFilter = this.filterDeck ? this.filterDeck.value : 'all';
        
        let cardsToShow = [];
        
        if (deckFilter === 'all') {
            Object.keys(this.decks).forEach(deckId => {
                this.decks[deckId].cards.forEach(card => {
                    card.deckId = deckId;
                    card.deckName = this.decks[deckId].name;
                    cardsToShow.push(card);
                });
            });
        } else {
            if (this.decks[deckFilter]) {
                this.decks[deckFilter].cards.forEach(card => {
                    card.deckId = deckFilter;
                    card.deckName = this.decks[deckFilter].name;
                    cardsToShow.push(card);
                });
            }
        }
        
        if (searchTerm) {
            cardsToShow = cardsToShow.filter(card => {
                return card.front.toLowerCase().includes(searchTerm) || 
                       card.back.toLowerCase().includes(searchTerm);
            });
        }
        
        this.displayCards(cardsToShow);
    }

    displayCards(cards) {
        if (!this.cardList) return;
        
        if (this.cardCount) {
            this.cardCount.textContent = cards.length;
        }
        
        if (this.currentDeckName && this.filterDeck) {
            const selectedDeck = this.filterDeck.value;
            if (selectedDeck === 'all') {
                this.currentDeckName.textContent = 'All Decks';
            } else if (this.decks[selectedDeck]) {
                this.currentDeckName.textContent = this.decks[selectedDeck].name;
            }
        }
        
        this.cardList.innerHTML = '';
        
        if (cards.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-icon">📚</div>
                <h3>No cards found</h3>
                <p>Add some cards to get started with your learning journey!</p>
            `;
            this.cardList.appendChild(emptyState);
            return;
        }
        
        cards.forEach(card => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            
            const cardInfo = document.createElement('div');
            cardInfo.className = 'card-info';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.innerHTML = `<strong>Q:</strong> ${this.truncateText(card.front, 80)}`;
            
            const cardBackHidden = document.createElement('div');
            cardBackHidden.className = 'card-back-hidden';
            
            const showAnswerHint = document.createElement('span');
            showAnswerHint.className = 'show-answer-hint';
            showAnswerHint.textContent = '👁️ Click to reveal answer';
            
            const cardBackContent = document.createElement('div');
            cardBackContent.className = 'card-back-content hidden';
            cardBackContent.innerHTML = `<strong>A:</strong> ${this.truncateText(card.back, 100)}`;
            
            cardBackHidden.appendChild(showAnswerHint);
            cardBackHidden.appendChild(cardBackContent);
            
            cardBackHidden.addEventListener('click', () => {
                showAnswerHint.classList.toggle('hidden');
                cardBackContent.classList.toggle('hidden');
            });
            
            const cardMeta = document.createElement('div');
            cardMeta.className = 'card-meta';
            cardMeta.innerHTML = `
                <span class="card-status ${card.status}">${card.status}</span>
                <span class="card-difficulty">${card.difficulty}</span>
                <span class="card-confidence">${card.confidence}% confidence</span>
                ${card.deckName ? `<span class="card-deck">📚 ${card.deckName}</span>` : ''}
            `;
            
            cardInfo.appendChild(cardFront);
            cardInfo.appendChild(cardBackHidden);
            cardInfo.appendChild(cardMeta);
            
            const cardActions = document.createElement('div');
            cardActions.className = 'card-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✏️ Edit';
            editBtn.onclick = () => this.editCard(card.id);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '🗑️ Delete';
            deleteBtn.onclick = () => this.confirmDeleteCard(card.id);
            
            cardActions.appendChild(editBtn);
            cardActions.appendChild(deleteBtn);
            
            cardItem.appendChild(cardInfo);
            cardItem.appendChild(cardActions);
            
            this.cardList.appendChild(cardItem);
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    exportCards() {
        const allCards = this.getAllCards();
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalCards: allCards.length,
            decks: this.decks
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `neurocards-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('📁 Cards exported successfully!');
    }

    updateDeckSelectors() {
        const deckOptions = Object.keys(this.decks).map(deckId => 
            `<option value="${deckId}">${this.decks[deckId].name}</option>`
        ).join('');
        
        if (this.deckSelector) {
            this.deckSelector.innerHTML = deckOptions;
        }
        if (this.cardDeckSelect) {
            this.cardDeckSelect.innerHTML = deckOptions;
        }
        if (this.filterDeck) {
            this.filterDeck.innerHTML = '<option value="all">All Decks</option>' + deckOptions;
        }
    }

    updateStats() {
        const allCards = this.getAllCards();
        let newCards = 0;
        let learningCards = 0;
        let reviewCards = 0;
        
        allCards.forEach(card => {
            if (card.status === 'new') newCards++;
            else if (card.status === 'learning') learningCards++;
            else if (card.status === 'review' || card.status === 'mastered') reviewCards++;
        });
        
        if (this.totalCardsDisplay) this.totalCardsDisplay.textContent = allCards.length;
        if (this.newCardsDisplay) this.newCardsDisplay.textContent = newCards;
        if (this.learningCardsDisplay) this.learningCardsDisplay.textContent = learningCards;
        if (this.reviewCardsDisplay) this.reviewCardsDisplay.textContent = reviewCards;
    }

    updateSessionStats() {
        if (this.streakDisplay) {
            this.streakDisplay.textContent = this.sessionStats.streak;
        }
        if (this.xpDisplay) {
            this.xpDisplay.textContent = this.sessionStats.xp;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    showErrorMessage(message) {
        // Create a more prominent error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            font-weight: bold;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    updateDisplay() {
        this.updateDeckSelectors();
        this.updateStats();
        this.updateSessionStats();
        
        if (this.filterDeck && this.currentDeck) {
            this.filterDeck.value = this.currentDeck;
        }
        
        this.filterCards();
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

let app;
document.addEventListener('DOMContentLoaded', () => {
    try {
        app = new Zerocard();
        window.app = app; // Make globally available for error handlers
        console.log('✅ Zerocard application loaded successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Zerocard:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 10000;
            text-align: center;
            font-weight: bold;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;
        errorDiv.innerHTML = `
            <h3>⚠️ Application Failed to Load</h3>
            <p>There was an error starting Zerocard. Please:</p>
            <ul style="text-align: left; margin: 15px 0;">
                <li>Refresh the page</li>
                <li>Check your browser console for details</li>
                <li>Ensure JavaScript is enabled</li>
            </ul>
            <button onclick="location.reload()" style="
                background: white;
                color: #ef4444;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 10px;
            ">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
    }
});