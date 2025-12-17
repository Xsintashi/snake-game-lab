# 🐍 Gra Snake (HTML/CSS/JavaScript)

Prosta, klasyczna implementacja gry Snake stworzona przy użyciu czystego HTML, CSS i JavaScript. Celem gry jest sterowanie wężem, jedzenie jabłek i unikanie kolizji ze ścianami oraz z własnym ogonem.

---

## 🛠️ Technologie

* **HTML5:** Struktura strony i element `<canvas>` do rysowania planszy.
* **CSS3:** Podstawowa stylizacja interfejsu i centrum planszy.
* **JavaScript (ES6):** Pełna logika gry, obsługa ruchu, kolizji, generowania jedzenia i liczenia punktów.

---

## 🚀 Jak Uruchomić

1.  **Sklonuj Repozytorium** (Jeśli używasz Git):
    ```bash
    git clone [LINK_DO_TWOJEGO_REPO]
    cd snake-game
    ```
2.  **Otwórz Plik:**
    Otwórz plik `index.html` bezpośrednio w dowolnej nowoczesnej przeglądarce internetowej (np. Chrome, Firefox).

---

## 🕹️ Zasady Gry i Sterowanie

### Cel
Zbieraj czerwone "jedzenie", aby wąż rósł i zdobywał punkty.

### Sterowanie
Gra reaguje na standardowe klawisze strzałek oraz klawisze WASD.

| Akcja | Klawisz |
| :--- | :--- |
| W górę | Strzałka w górę / W |
| W dół | Strzałka w dół / S |
| W lewo | Strzałka w lewo / A |
| W prawo | Strzałka w prawo / D |
| Start | Przycisk "Rozpocznij Grę" |

### Koniec Gry
Gra kończy się, gdy wąż:
1.  Uderzy w jedną z **krawędzi** planszy.
2.  Uderzy we **własny ogon**.
