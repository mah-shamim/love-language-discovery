(function() {
    'use strict';

    // Constants and Configurations
    const DESCRIPTIONS = {
        words: "You feel most loved when you hear sincere compliments and verbal appreciation. Kind words and encouragement mean the world to you!",
        acts: "Actions speak louder than words for you. You value when others go out of their way to make your life easier or help with tasks.",
        gifts: "Thoughtful presents show you're cared for. It's not about materialism but the symbolism and effort behind the gift.",
        time: "Undivided attention is your key to feeling loved. Quality conversations and shared activities fill your emotional cup.",
        touch: "Physical connection is vital for you. Hugs, hand-holding, and appropriate physical contact make you feel secure and loved."
    };

    const EMOJI_MAP = {
        words: '💬', acts: '🛠️', gifts: '🎁',
        time: '⏳', touch: '🤗'
    };

    const QUIZ_DATA = [
        {
            question: "What makes you feel most appreciated?",
            options: [
                {text: "Hearing 'I love you' or compliments", language: "words"},
                {text: "Someone helping with chores", language: "acts"},
                {text: "Receiving a thoughtful gift", language: "gifts"}
            ]
        },
        {
            question: "What's your ideal way to spend time with someone?",
            options: [
                {text: "Deep conversations", language: "time"},
                {text: "Physical closeness like hugging", language: "touch"},
                {text: "Working on a project together", language: "acts"}
            ]
        },
        {
            question: "What's the best surprise to receive?",
            options: [
                {text: "A handwritten letter", language: "words"},
                {text: "Planned quality time together", language: "time"},
                {text: "A small meaningful gift", language: "gifts"}
            ]
        }
    ];
    const CHALLENGES = [
        {text: "Compliment three people genuinely today", type: "words"},
        {text: "Do someone's chore without being asked", type: "acts"},
        {text: "Leave a small thoughtful gift for someone", type: "gifts"},
        {text: "Spend 30 minutes of quality time with a loved one", type: "time"},
        {text: "Give someone a heartfelt hug", type: "touch"},
        {text: "Write a thank-you note to someone you appreciate", type: "words"},
        {text: "Cook a meal for someone special", type: "acts"}
    ];
    const CULTURAL_DATA = {
        asia: {
            title: "Asian Love Expressions",
            content: "In Japan, 'Koi no yokan' describes the预感 of love. China celebrates Qixi Festival, while Korea has Pepero Day. Many cultures emphasize familial love and respect.",
            emoji: "🌸"
        },
        europe: {
            title: "European Traditions",
            content: "France popularized the 'Language of Flowers'. Nordic countries celebrate midsummer love rituals. Italy's 'La Bella Figura' emphasizes romantic gestures.",
            emoji: "🏛️"
        },
        americas: {
            title: "American Love Customs",
            content: "Brazil celebrates Dia dos Namorados. Mexico has 'El Día del Amor y la Amistad'. Native American traditions emphasize spiritual connections.",
            emoji: "🌎"
        },
        africa: {
            title: "African Love Practices",
            content: "In Nigeria, Yoruba propose with 'Igba Ifọọrọ'. Ethiopia celebrates 'Antrosht' family love. Many cultures emphasize communal expressions of care.",
            emoji: "🌍"
        }
    };

    // DOM Elements
    const DOM = {
        cards: document.querySelectorAll('.card'),
        quiz: {
            startBtn: document.getElementById('start-quiz'),
            questionDisplay: document.getElementById('question-display'),
            optionsContainer: document.getElementById('options-container')
        },
        socialBtns: document.querySelectorAll('.share-btn'),
        // Add other DOM references as needed
    };

    // Utility Functions
    const utils = {
        smoothScroll(target, offset = 80) {
            const element = document.querySelector(target);
            const elementRect = element.getBoundingClientRect().top;
            const offsetPosition = elementRect - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },

        addAccessibility(element, role, tabindex = 0) {
            element.setAttribute('role', role);
            element.setAttribute('tabindex', tabindex);
        }
    };

    // Card Component
    const cardsComponent = {
        currentDescription: null,

        init() {
            DOM.cards.forEach(card => {
                const lang = card.dataset.language;
                card.innerHTML = `${EMOJI_MAP[lang]}<br>${card.textContent}`;
                this.setupCardEvents(card);
                utils.addAccessibility(card, 'button');
            });
        },

        setupCardEvents(card) {
            const handler = e => this.handleCardClick(e);
            card.addEventListener('click', handler);
            card.addEventListener('keypress', e => e.key === 'Enter' && handler(e));
        },

        handleCardClick(e) {
            const card = e.currentTarget;
            const lang = card.dataset.language;

            DOM.cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            this.showDescription(lang);
        },

        showDescription(lang) {
            if (this.currentDescription) this.currentDescription.remove();

            this.currentDescription = document.createElement('div');
            this.currentDescription.className = 'description';
            this.currentDescription.innerHTML = `
                <h3>${DESCRIPTIONS[lang]}</h3>
                <p style="margin-top: 1rem; color: #ff758c;">
                    ❤️ This might be your primary love language!
                </p>
            `;

            document.getElementById('hero').appendChild(this.currentDescription);

            // Trigger the animation by adding the class
            setTimeout(() => {
                this.currentDescription.classList.add('show');
            }, 10); // Slight delay to ensure the element is rendered before animation

            setTimeout(() => {
                this.currentDescription.style.display = 'none';
            }, 3000);
        }
    };

    // Quiz Component
    const quizComponent = {
        currentQuestion: 0,
        scores: {words: 0, acts: 0, gifts: 0, time: 0, touch: 0},

        init() {
            DOM.quiz.startBtn.addEventListener('click', () => this.startQuiz());
            DOM.quiz.optionsContainer.addEventListener('click', e => {
                if (e.target.classList.contains('option')) this.handleAnswer(e);
            });
        },

        startQuiz() {
            this.currentQuestion = 0;
            this.scores = {words: 0, acts: 0, gifts: 0, time: 0, touch: 0};
            DOM.quiz.startBtn.style.display = 'none';
            this.showQuestion();
        },

        showQuestion() {
            const current = QUIZ_DATA[this.currentQuestion];
            DOM.quiz.questionDisplay.textContent = current.question;
            DOM.quiz.optionsContainer.innerHTML = current.options
                .map(opt => `<button class="option" data-language="${opt.language}">${opt.text}</button>`)
                .join('');
        },

        handleAnswer(e) {
            const button = e.target.closest('.option');
            this.scores[button.dataset.language]++;
            this.currentQuestion++;

            this.currentQuestion < QUIZ_DATA.length
                ? this.showQuestion()
                : this.showResults();
        },

        showResults() {
            DOM.quiz.startBtn.style.display = 'block';
            DOM.quiz.questionDisplay.textContent = "Your Results Are Ready! ❤️";
            DOM.quiz.optionsContainer.innerHTML = "";
            this.updateChart();
            utils.smoothScroll('#results-section');
        },

        updateChart() {
            const maxScore = Math.max(...Object.values(this.scores)) || 1;
            document.querySelectorAll('.bar-container').forEach(container => {
                const lang = container.dataset.language;
                const bar = container.querySelector('.bar');
                const percentage = (this.scores[lang] / maxScore) * 100;

                bar.style.height = `${percentage}%`;
                bar.textContent = this.scores[lang];
            });
        }
    };

    // Story Component
    const storiesComponent = {
        currentIndex: 0,
        DOM: {
            carousel: document.getElementById('story-carousel'),
            cards: document.querySelectorAll('.story-card'),
            prevBtn: document.getElementById('prev-story'),
            nextBtn: document.getElementById('next-story')
        },

        init() {
            this.setupNavigation();
            this.setupExpandButtons();
            this.updateButtonStates();
        },

        setupNavigation() {
            this.DOM.prevBtn.addEventListener('click', () => this.navigate(-1));
            this.DOM.nextBtn.addEventListener('click', () => this.navigate(1));
        },

        setupExpandButtons() {
            document.querySelectorAll('.expand-btn').forEach(btn => {
                utils.addAccessibility(btn, 'button');
                btn.addEventListener('click', e => this.toggleStory(e));
                btn.addEventListener('keypress', e => {
                    if (e.key === 'Enter') this.toggleStory(e);
                });
            });
        },

        navigate(direction) {
            this.currentIndex = Math.max(0,
                Math.min(this.currentIndex + direction, this.DOM.cards.length - 1));

            this.updateCarouselPosition();
            this.updateButtonStates();
        },

        updateCarouselPosition() {
            const card = this.DOM.cards[0];
            const cardStyle = window.getComputedStyle(card);
            const cardWidth = card.offsetWidth +
                parseInt(cardStyle.marginLeft) +
                parseInt(cardStyle.marginRight);

            this.DOM.carousel.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;
        },

        updateButtonStates() {
            this.DOM.prevBtn.disabled = this.currentIndex === 0;
            this.DOM.nextBtn.disabled = this.currentIndex === this.DOM.cards.length - 1;
        },

        toggleStory(e) {
            const card = e.target.closest('.story-card');
            const elements = {
                preview: card.querySelector('.preview'),
                fullStory: card.querySelector('.full-story'),
                btn: card.querySelector('.expand-btn')
            };

            card.classList.toggle('expanded');
            elements.preview.style.display = card.classList.contains('expanded') ? 'none' : 'block';
            elements.fullStory.style.display = card.classList.contains('expanded') ? 'block' : 'none';
            elements.btn.textContent = card.classList.contains('expanded') ? '-' : '+';
        }
    };

    // Map Component
    const mapsComponent = {
        DOM: {
            markers: document.querySelectorAll('.marker'),
            regionInfo: document.getElementById('region-info')
        },

        init() {
            this.setupMarkers();
            this.setupAccessibility();
        },

        setupMarkers() {
            this.DOM.markers.forEach(marker => {
                marker.addEventListener('click', e => this.handleRegionClick(e));
                this.positionMarker(marker);
            });
        },

        setupAccessibility() {
            this.DOM.markers.forEach(marker => {
                utils.addAccessibility(marker, 'button');
                marker.addEventListener('keypress', e => {
                    if (e.key === 'Enter') this.handleRegionClick(e);
                });
            });
        },

        handleRegionClick(e) {
            const marker = e.currentTarget;
            const region = marker.dataset.region;

            this.DOM.markers.forEach(m => m.classList.remove('active'));
            marker.classList.add('active');
            this.updateRegionInfo(region);
        },

        updateRegionInfo(region) {
            const data = CULTURAL_DATA[region];
            this.DOM.regionInfo.innerHTML = `
            <h3>${data.emoji} ${data.title}</h3>
            <p>${data.content}</p>
        `;
            this.DOM.regionInfo.style.animation = 'fadeIn 0.5s ease';
        },

        positionMarker(marker) {
            // Optional: Add dynamic positioning logic if needed
            const region = marker.dataset.region;
            const positions = {
                asia: { left: '70%', top: '45%' },
                europe: { left: '50%', top: '30%' },
                americas: { left: '20%', top: '40%' },
                africa: { left: '45%', top: '55%' }
            };

            Object.entries(positions[region]).forEach(([prop, value]) => {
                marker.style[prop] = value;
            });
        },

        handleResize() {
            this.DOM.markers.forEach(marker => this.positionMarker(marker));
        }
    };

    // Daily Challenge Component
    const dailyChallengesComponent = {
        DOM: {
            challengeText: document.getElementById('challenge-text'),
            newChallengeBtn: document.getElementById('new-challenge'),
            days: document.querySelectorAll('.day')
        },

        init() {
            this.setupEventListeners();
            this.updateChallenge();
            this.setupAccessibility();
        },

        setupEventListeners() {
            this.DOM.newChallengeBtn.addEventListener('click', () => this.updateChallenge());
            this.DOM.days.forEach(day => {
                day.addEventListener('click', e => this.toggleDayCompletion(e));
            });
        },

        setupAccessibility() {
            this.DOM.days.forEach(day => {
                utils.addAccessibility(day, 'button');
            });
            utils.addAccessibility(this.DOM.newChallengeBtn, 'button');
        },

        getRandomChallenge() {
            const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
            return CHALLENGES[randomIndex].text;
        },

        updateChallenge() {
            this.DOM.challengeText.textContent = this.getRandomChallenge();
            this.animateChallengeUpdate();
        },

        animateChallengeUpdate() {
            this.DOM.challengeText.style.animation = 'none';
            void this.DOM.challengeText.offsetWidth; // Trigger reflow
            this.DOM.challengeText.style.animation = 'fadeIn 0.5s ease';
        },

        toggleDayCompletion(e) {
            const day = e.currentTarget;
            day.classList.toggle('completed');
            this.updateProgressStorage();
        },

        updateProgressStorage() {
            // Optional: Add localStorage persistence
            const progress = Array.from(this.DOM.days).map(day =>
                day.classList.contains('completed')
            );
            localStorage.setItem('challengeProgress', JSON.stringify(progress));
        },

        loadProgress() {
            const savedProgress = localStorage.getItem('challengeProgress');
            if (savedProgress) {
                JSON.parse(savedProgress).forEach((completed, index) => {
                    if (completed) this.DOM.days[index].classList.add('completed');
                });
            }
        }
    };

    // Social Share Component
    const socialSharesComponent = {
        DOM: {
            shareBtns: document.querySelectorAll('.share-btn')
        },

        shareConfig: {
            twitter: {
                baseUrl: 'https://twitter.com/intent/tweet',
                params: { text: 'Discover your love language!', url: window.location.href }
            },
            facebook: {
                baseUrl: 'https://www.facebook.com/sharer/sharer.php',
                params: { u: window.location.href }
            },
            instagram: {
                handler: () => alert('Share to Instagram: Copy the link and paste in your story!')
            }
        },

        init() {
            this.setupAccessibility();
            this.setupEventListeners();
        },

        setupAccessibility() {
            this.DOM.shareBtns.forEach(btn => {
                utils.addAccessibility(btn, 'button');
            });
        },

        setupEventListeners() {
            this.DOM.shareBtns.forEach(btn => {
                btn.addEventListener('click', e => this.handleShare(e));
                btn.addEventListener('keypress', e => {
                    if (e.key === 'Enter') this.handleShare(e);
                });
            });
        },

        handleShare(e) {
            const platform = e.currentTarget.dataset.platform;
            const config = this.shareConfig[platform];

            if (!config) {
                console.warn(`Unsupported platform: ${platform}`);
                return;
            }

            if (config.handler) {
                config.handler();
            } else {
                this.openShareWindow(config);
            }
        },

        openShareWindow(config) {
            const params = new URLSearchParams(config.params).toString();
            const shareUrl = `${config.baseUrl}?${params}`;

            window.open(
                shareUrl,
                '_blank',
                'width=600,height=400,menubar=no,toolbar=no,location=no'
            );
        },

        updateShareUrl(newUrl) {
            this.shareConfig.twitter.params.url = newUrl;
            this.shareConfig.facebook.params.u = newUrl;
        }
    };

    // Initialize all components
    function init() {
        cardsComponent.init();
        quizComponent.init();
        storiesComponent.init();
        mapsComponent.init();
        dailyChallengesComponent.init();
        dailyChallengesComponent.loadProgress();
        socialSharesComponent.init();
        // Initialize other components here

        // Optional: Add resize listener if using dynamic positioning
        window.addEventListener('resize', () => mapsComponent.handleResize());
    }

    document.addEventListener('DOMContentLoaded', init);
})();