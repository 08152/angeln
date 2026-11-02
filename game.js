// 1. Import aller Spielkomponenten und Inseln
import { Himmel } from './himmel.js';
import { Insel1 } from './insel_1.js';
import { Insel1Shop } from './insel_1_shop.js';

// Items & Waffen
import { Cola } from './cola.js';
import { Hotdog } from './hotdog.js';
import { Krabenangel } from './krabenangel.js';
import { Messer } from './messer.js';
import { Schlagring } from './schlagring.js';

// Gegner / Krebse
import { Taschenkrebs } from './taschenkrebs.js';

class Game {
    constructor() {
        // Canvas Setup (Falls dein Spiel ein HTML5 Canvas nutzt)
        this.canvas = document.getElementById('gameCanvas') || this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        
        // Globaler Spielzustand (State)
        this.state = {
            player: {
                inventory: [],
                weapons: [],
                currentWeapon: null,
                money: 0
            },
            currentLocation: 'insel_1',
            isGameOver: false
        };

        // Instanziierung der geladenen Komponenten
        this.himmel = new Himmel(this);
        this.insel1 = new Insel1(this);
        this.shop = new Insel1Shop(this);

        this.init();
    }

    // Hilfsfunktion: Erstellt ein Canvas, falls keines in der index.html existiert
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 600;
        document.body.appendChild(canvas);
        return canvas;
    }

    // 2. Initialisierung & Setup
    init() {
        console.log("Spiel wird initialisiert...");

        // Start-Ausrüstung hinzufügen
        this.state.player.weapons.push(new Messer(), new Schlagring());
        this.state.player.inventory.push(new Krabenangel(), new Hotdog(), new Cola());
        this.state.player.currentWeapon = this.state.player.weapons[0];

        // Event-Listener für Tastatur oder Klicks hier hinzufügen
        this.setupInput();

        // Start des Game Loops
        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                // Interaktion mit dem Shop auf Insel 1
                if (this.state.currentLocation === 'insel_1') {
                    this.shop.interact(this.state.player);
                }
            }
        });
    }

    // 3. Der Game Loop (Aktualisieren und Zeichnen)
    gameLoop(timestamp) {
        if (this.state.isGameOver) return;

        this.update(timestamp);
        this.render();

        // Endlosschleife triggern
        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    // Logik-Updates
    update(timestamp) {
        // Umgebung updaten
        this.himmel.update(timestamp);

        if (this.state.currentLocation === 'insel_1') {
            this.insel1.update(timestamp);
        }
    }

    // Grafische Ausgabe (Rendering)
    render() {
        // Bildschirm leeren
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Hintergrund / Himmel zeichnen
        this.himmel.draw(this.ctx);

        // 2. Aktuelle Insel / Umgebung zeichnen
        if (this.state.currentLocation === 'insel_1') {
            this.insel1.draw(this.ctx);
            this.shop.draw(this.ctx);
        }

        // 3. UI / Inventar-Status zeichnen (Beispiel)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Waffe: ${this.state.player.currentWeapon?.constructor.name || 'Keine'}`, 10, 20);
        this.ctx.fillText(`Geld: ${this.state.player.money} $`, 10, 40);
    }
}

// Spiel starten, sobald das DOM geladen ist
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
