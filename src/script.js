// Ustawienia gry
const CANVAS_SIZE = 400; // Rozmiar planszy w pikselach (zgodnie z HTML)
const TILE_SIZE = 20;    // Rozmiar pojedynczego segmentu węża/jedzenia w pikselach
const TILES_COUNT = CANVAS_SIZE / TILE_SIZE; // Ilość segmentów na jednej krawędzi (400/20 = 20)
let GAME_SPEED = 150;    // Szybkość gry w milisekundach (mniejsza liczba = szybsza gra)
let gameLoopInterval;    // Zmienna przechowująca interwał gry

// Elementy DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

const scoreAudio = new Audio('./src/audio/score.ogg');
const deathAudio = new Audio('./src/audio/death.ogg');

// Stan gry
let snake;
let food;
let dx = TILE_SIZE; // Kierunek X: 20 (w prawo)
let dy = 0;         // Kierunek Y: 0
let score = 0;
let isGameOver = false;

// --- Funkcje inicjujące i resetujące grę ---

function initializeGame() {
    // Ustawienie początkowej pozycji węża (na środku)
    snake = [
        { x: Math.floor(TILES_COUNT / 2) * TILE_SIZE, y: Math.floor(TILES_COUNT / 2) * TILE_SIZE },
        // Początkowy wąż ma 1 segment, reszta będzie dodawana
    ];

    // Resetowanie zmiennych
    dx = TILE_SIZE;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    isGameOver = false;

    // Generowanie pierwszego jedzenia
    generateFood();

    // Aktywacja przycisku i czyszczenie interwału (na wszelki wypadek)
    startButton.disabled = false;
    startButton.textContent = "Rozpocznij Grę";
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    draw(); // Rysowanie planszy początkowej
}

function startGame() {
    if (isGameOver || !gameLoopInterval) {
        // Zabezpieczenie przed wielokrotnym uruchomieniem
        initializeGame(); 

        // Uruchomienie głównej pętli gry
        gameLoopInterval = setInterval(gameLoop, GAME_SPEED);

        // Wyłączenie przycisku na czas gry
        startButton.disabled = true;
        startButton.textContent = "Gra w trakcie...";
    }
}

// --- Główna pętla i logika gry ---

function gameLoop() {
    if (isGameOver) {
        clearInterval(gameLoopInterval);
        alert(`Koniec Gry! Twój wynik: ${score}`);
        initializeGame(); // Przygotowanie do nowej gry
        return;
    }

    // Aktualizacja stanu gry
    update();

    // Rysowanie na ekranie
    draw();
}

function update() {
    // 1. Tworzenie nowej głowy węża
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 2. Wstawienie nowej głowy na początek tablicy
    snake.unshift(head);

    // 3. Sprawdzenie kolizji
    if (checkCollision(head)) {
        isGameOver = true;
        deathAudio.play();
        return;
    }

    // 4. Sprawdzenie, czy wąż zjadł jedzenie
    if (head.x === food.x && head.y === food.y) {
        // Zjedzone jedzenie: nie usuwamy ogona, wąż rośnie
        scoreAudio.play();
        score += 10;
        scoreElement.textContent = score;
        generateFood(); // Generowanie nowego jedzenia
    } else {
        // Nie zjedzone: usuwamy ostatni element (ogon), wąż przesuwa się o 1
        snake.pop();
    }
}

function checkCollision(head) {
    // Kolizja ze ścianami
    const hitWall = head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE;

    // Kolizja z samym sobą (sprawdzamy od 4 segmentu, bo wąż musi mieć czas się obrócić)
    const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

    return hitWall || hitSelf;
}

function generateFood() {
    let newFood;
    let isOnSnake;

    do {
        // Losowanie pozycji w granicach planszy z krokiem TILE_SIZE
        const foodX = Math.floor(Math.random() * TILES_COUNT) * TILE_SIZE;
        const foodY = Math.floor(Math.random() * TILES_COUNT) * TILE_SIZE;
        newFood = { x: foodX, y: foodY };

        // Sprawdzenie, czy jedzenie nie pojawiło się na wężu
        isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);

    } while (isOnSnake); // Powtarzaj, jeśli jedzenie wylądowało na wężu

    food = newFood;
}

// --- Funkcje rysowania ---

function draw() {
    // 1. Wyczyść całą planszę
    ctx.fillStyle = '#242424'; // Tło planszy z CSS
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 2. Rysuj jedzenie
    drawSquare(food.x, food.y, 'red');

    // 3. Rysuj węża
    snake.forEach((segment, index) => {
        // Głowa (pierwszy element) ma inny kolor
        const color = (index === 0) ? '#4CAF50' : '#8BC34A'; 
        drawSquare(segment.x, segment.y, color);
    });
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // Dodanie obramowania, aby segmenty były lepiej widoczne
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
}

// --- Kontrola klawiatury ---

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;

    // Definicje kierunków
    const LEFT = -TILE_SIZE;
    const RIGHT = TILE_SIZE;
    const UP = -TILE_SIZE;
    const DOWN = TILE_SIZE;

    // Zapobieganie natychmiastowemu zawracaniu
    switch (keyPressed) {
        case 'ArrowLeft':
        case 'a':
            if (dx !== RIGHT) { dx = LEFT; dy = 0; }
            break;
        case 'ArrowUp':
        case 'w':
            if (dy !== DOWN) { dx = 0; dy = UP; }
            break;
        case 'ArrowRight':
        case 'd':
            if (dx !== LEFT) { dx = RIGHT; dy = 0; }
            break;
        case 'ArrowDown':
        case 's':
            if (dy !== UP) { dx = 0; dy = DOWN; }
            break;
    }
}


// --- Inicjalizacja przy ładowaniu strony ---
document.addEventListener('DOMContentLoaded', initializeGame);
startButton.addEventListener('click', startGame);