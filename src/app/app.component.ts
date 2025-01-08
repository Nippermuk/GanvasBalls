import { Component, AfterViewInit } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ConfigDialogComponent} from './config-dialog/config-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MatIconButton,
    MatIcon,
    MatButton,
    NgIf
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {


  config = new Config();
  preset = new Config();
  handyPreset = new Config();
  fancyPreset = new Config();
  orbitPreset = new Config();

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    const canvas = document.getElementById('stage') as HTMLCanvasElement;

    // Verhindert Pull-to-Refresh und andere Touch-Events
    canvas.addEventListener('touchstart', (event) => event.preventDefault(), {passive: false});
    canvas.addEventListener('touchmove', (event) => event.preventDefault(), {passive: false});
    canvas.addEventListener('touchend', (event) => event.preventDefault(), {passive: false});

    window.addEventListener('keydown', (event) => {
      if (event.key === 'f' || event.key === 'F') {
        this.toggleFullscreen();
      }
    });

    let lastTap = 0; // Zeitpunkt des letzten Taps

    canvas.addEventListener('touchstart', (event) => {
      const currentTime = new Date().getTime();
      const tapGap = currentTime - lastTap;

      if (tapGap < 300 && tapGap > 0) {
        // Doppel-Tap erkannt
        this.toggleFullscreen();
      }

      lastTap = currentTime;
    });

    this.loadConfigFromCookie(); // Config beim Laden initialisieren
    this.startAnimation();

    this.handyPreset.canvasheight = 3000;
    this.handyPreset.radius = 50;
    this.handyPreset.clearcanvas = false;

    this.fancyPreset.allballs = false;
    this.fancyPreset.b = 220;
    this.fancyPreset.ball1 = true;
    this.fancyPreset.ball2 = false;
    this.fancyPreset.ball3 = false;
    this.fancyPreset.ball4 = true;
    this.fancyPreset.clearcanvas = false;
    this.fancyPreset.colorbrightness = 150;
    this.fancyPreset.currentX = 991.2524858805191;
    this.fancyPreset.currentY = 409.6417097531764;
    this.fancyPreset.disablegravity = false;
    this.fancyPreset.lastX = 1015.7192256594665;
    this.fancyPreset.lastY = 422.8992648852211;
    this.fancyPreset.radius = 30;
    this.fancyPreset.vx = 24.466739778947385;
    this.fancyPreset.vy = -13.257555132044672;
    this.fancyPreset.x = 991.2524858805191;
    this.fancyPreset.y = 409.6417097531764;

    this.orbitPreset.allballs = false;
    this.orbitPreset.ball1 = true;
    this.orbitPreset.ball2 = false;
    this.orbitPreset.ball3 = false;
    this.orbitPreset.ball4 = true;
    this.orbitPreset.x = 700;
    this.orbitPreset.y = 200;
    this.orbitPreset.vx = 7.5;
    this.orbitPreset.vy = 5;
    this.orbitPreset.currentX = 700;
    this.orbitPreset.currentY = 200;
    this.orbitPreset.lastX = 680;
    this.orbitPreset.lastY = 187;
    this.orbitPreset.colorbrightness = 150;
    this.orbitPreset.colorspeed = 1;
    this.orbitPreset.radius = 30;
    this.orbitPreset.disablespeedloss = true;
    this.orbitPreset.disableBorders = true;
    this.orbitPreset.disablegravity = false;
    this.orbitPreset.clearcanvas = false;
    this.orbitPreset.enableOrbit = true;
    this.orbitPreset.r = 150;
  }
  startAnimation(): void {
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //TODO: Fix
    //const resizeCanvas = () => {
    //  canvas.width = container.clientWidth-3;
    //  canvas.height = container.clientHeight-6;
    //};
    //new ResizeObserver(resizeCanvas).observe(container);

    if (!ctx) {
      console.error('Canvas-Kontext konnte nicht geladen werden.');
      return;
    }

    let frameCounter = 0;

    const draw = () => {
      if(this.config.clearcanvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
      }

      //calculate coolor
      if (this.config.r >= this.config.colordarkness && this.config.g <= this.config.colordarkness && this.config.b <= this.config.colorbrightness) {
        this.config.g += this.config.colorspeed;
      } else if (this.config.r >= this.config.colorbrightness && this.config.g >= this.config.colordarkness && this.config.b <= this.config.colorbrightness) {
        this.config.r -= this.config.colorspeed;
      } else if (this.config.r <= this.config.colorbrightness && this.config.g >= this.config.colordarkness && this.config.b <= this.config.colordarkness) {
        this.config.b += this.config.colorspeed;
      } else if (this.config.r <= this.config.colorbrightness && this.config.g >= this.config.colorbrightness && this.config.b >= this.config.colordarkness) {
        this.config.g -= this.config.colorspeed;
      } else if (this.config.r <= this.config.colordarkness && this.config.g <= this.config.colorbrightness && this.config.b >= this.config.colordarkness) {
        this.config.r += this.config.colorspeed;
      } else if (this.config.r >= this.config.colordarkness && this.config.g <= this.config.colorbrightness && this.config.b >= this.config.colorbrightness) {
        this.config.b -= this.config.colorspeed;
      } else {
        this.config.r = this.config.colordarkness;
        this.config.g = this.config.colorbrightness;
        this.config.b = this.config.colorbrightness;
      }

      if(this.config.isMousedown) {
        this.config.x = this.config.mouseX
        this.config.y = this.config.mouseY
        if(this.config.clearCanvasOnClick) {
          this.clearCanvas();
        }
        if(!this.config.wasMousedown) {
          console.log("click")
          this.config.wasMousedown = true;
          this.config.lastX = this.config.x;
          this.config.lastY = this.config.y;
          this.config.currentX = this.config.x;
          this.config.currentY = this.config.y;
        }
        this.config.vy = this.config.currentY - this.config.lastY;
        this.config.vx = this.config.currentX - this.config.lastX;
      }

      if(!this.config.disableBorders) {
        if (this.config.y > canvas.height - this.config.radius && this.config.vy > 0) { // Boden erreicht
          this.config.vy *= this.config.bounce; // Rücksprung (Geschwindigkeit umkehren)
        } else if (this.config.y < this.config.radius && this.config.vy < 0) { // Decke erreicht
          this.config.vy *= this.config.bounce; // Rücksprung (Geschwindigkeit umkehren)
        }

        if (this.config.x > canvas.width - this.config.radius && this.config.vx > 0) { // Boden erreicht
          this.config.vx *= this.config.bounce; // Rücksprung (Geschwindigkeit umkehren)
        } else if (this.config.x < this.config.radius && this.config.vx < 0) { // Decke erreicht
          this.config.vx *= this.config.bounce; // Rücksprung (Geschwindigkeit umkehren)
        }
      }

      if(!this.config.disablegravity){
        if(this.config.enableOrbit) {
          const dx = (canvas.width / 2) - this.config.x; // Abstand zum Gravitationspunkt (X)
          const dy = (canvas.height / 2) - this.config.y; // Abstand zum Gravitationspunkt (Y)
          const distance = Math.sqrt(dx * dx + dy * dy); // Abstand berechnen

          // Normierte Kraftvektoren
          const forceX = (dx / distance) * this.config.gravity;
          const forceY = (dy / distance) * this.config.gravity;

          this.config.vx += forceX;
          this.config.vy += forceY;
        } else {
          if (this.config.y < canvas.height/2){
            this.config.vy += this.config.gravity; // Geschwindigkeit durch Schwerkraft erhöhen
          } else if (this.config.y > canvas.height/2) {
            this.config.vy -= this.config.gravity; // Geschwindigkeit durch Schwerkraft erhöhen
          }
        }
      }
      if(!this.config.isMousedown) {
        this.config.y += this.config.vy; // Position ändern
        this.config.x += this.config.vx;
      }

      if(!this.config.disablespeedloss) {
        this.config.vx *= this.config.resistance;
        this.config.vx -= this.config.friction;
        this.config.vy *= this.config.resistance;
        this.config.vy -= this.config.friction;
      }

      ctx.fillStyle = `rgb(${this.config.r} ${this.config.g} ${this.config.b})`;
      ctx.strokeStyle = `rgb(${this.config.r} ${this.config.g} ${this.config.b})`;

      this.config.lastX = this.config.currentX;
      this.config.lastY = this.config.currentY;
      this.config.currentX = this.config.x;
      this.config.currentY = this.config.y;

      if (this.config.ball1 || this.config.allballs) {
        if(this.config.smoothlines){
          ctx.beginPath();
          ctx.lineWidth = this.config.radius * 2; // Setze die Linienbreite auf den Durchmesser des Balls
          ctx.arc(this.config.lastX, this.config.lastY, this.config.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(this.config.lastX, this.config.lastY);
          ctx.lineTo(this.config.x, this.config.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(this.config.x, this.config.y, this.config.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (this.config.ball2 || this.config.allballs) {
        if(this.config.smoothlines) {
          ctx.beginPath();
          ctx.lineWidth = this.config.radius * 2; // Setze die Linienbreite auf den Durchmesser des Balls
          ctx.arc(canvas.width - this.config.lastX, this.config.lastY, this.config.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(canvas.width - this.config.lastX, this.config.lastY);
          ctx.lineTo(canvas.width - this.config.x, this.config.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(canvas.width - this.config.x, this.config.y, this.config.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (this.config.ball3 || this.config.allballs) {
        if(this.config.smoothlines){
          ctx.beginPath();
          ctx.lineWidth = this.config.radius * 2; // Setze die Linienbreite auf den Durchmesser des Balls
          ctx.arc(this.config.lastX, canvas.height - this.config.lastY, this.config.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(this.config.lastX, canvas.height - this.config.lastY);
          ctx.lineTo(this.config.x, canvas.height - this.config.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(this.config.x, canvas.height - this.config.y, this.config.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (this.config.ball4 || this.config.allballs) {
        if(this.config.smoothlines){
          ctx.beginPath();
          ctx.lineWidth = this.config.radius * 2; // Setze die Linienbreite auf den Durchmesser des Balls
          ctx.arc(canvas.width - this.config.lastX, canvas.height - this.config.lastY, this.config.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(canvas.width - this.config.lastX, canvas.height - this.config.lastY);
          ctx.lineTo(canvas.width - this.config.x, canvas.height - this.config.y);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(canvas.width - this.config.x, canvas.height - this.config.y, this.config.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameCounter++;
      if (frameCounter % 60 === 0) {
        console.log(this.config)
        this.saveConfigToCookie();
      }

      requestAnimationFrame(draw); // Nächsten Frame anfordern
    };

    draw(); // Animation starten
  }

  openConfigDialog(): void {
    const dialogRef = this.dialog.open(ConfigDialogComponent, {
      width: '400px',
      data: { config: this.config, preset: this.preset },
    });

    dialogRef.afterClosed().subscribe((updatedConfig) => {
      if (updatedConfig) {
        this.config = updatedConfig.config;
        this.preset = updatedConfig.preset;
      }
    });
  }

  mousedown(isMousedown: boolean) {
    if (!isMousedown && this.config.wasMousedown) {
      this.config.wasMousedown = false;
    }
    this.config.isMousedown = isMousedown;
  }

  getCursor(event: MouseEvent | TouchEvent) {
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();


    if (event instanceof MouseEvent) {
      // Desktop: Maus-Position
      const scaleX = canvas.width / rect.width; // Verhältnis der Breite
      const scaleY = canvas.height / rect.height; // Verhältnis der Höhe
      this.config.mouseX = (event.clientX - rect.left) * scaleX;
      this.config.mouseY = (event.clientY - rect.top) * scaleY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      // Mobile: Touch-Position
      const touch = event.touches[0];
      const scaleX = canvas.width / rect.width; // Verhältnis der Breite
      const scaleY = canvas.height / rect.height; // Verhältnis der Höhe
      this.config.mouseX = (touch.clientX - rect.left) * scaleX;
      this.config.mouseY = (touch.clientY - rect.top) * scaleY;
    }

  }


  selectPreset(preset: number) {
    switch (preset) {
      case 1:
        this.config = this.preset;
        break;
      case 2:
        this.config = this.fancyPreset;
        break;
      case 3:
        this.config = this.handyPreset;
        break;
      case 4:
        this.config = this.orbitPreset;
        break;
    }
  }

  clearCanvas() {
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
  }

  setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
  }

  saveConfigToCookie(): void {
    const configString = JSON.stringify(this.config);
    this.setCookie('config', configString, 7); // Speichere für 7 Tage
  }

  loadConfigFromCookie(): void {
    const configString = this.getCookie('config');
    if (configString) {
      this.config = JSON.parse(configString);
    }
  }

  toggleFullscreen(): void {
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const container = document.documentElement; // Gesamtes Dokument

    this.config.fullscreen = !this.config.fullscreen;

    if (this.config.fullscreen) {

      const dpr = window.devicePixelRatio || 1;

      // Vollbildmodus aktivieren
      const requestFullscreen = container.requestFullscreen
        || (container as any).webkitRequestFullscreen
        || (container as any).msRequestFullscreen
        || (container as any).mozRequestFullScreen;

      if (requestFullscreen) {
        requestFullscreen.call(container).then(() => {
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
        }).catch(err => {
          console.error("Fehler beim Aktivieren des Vollbildmodus:", err);
        });
      } else {
        console.warn("Fullscreen API wird nicht unterstützt.");
      }
    } else {
      // Vollbildmodus verlassen
      const exitFullscreen = document.exitFullscreen
        || (document as any).webkitExitFullscreen
        || (document as any).msExitFullscreen
        || (document as any).mozCancelFullScreen;

      if (exitFullscreen) {
        exitFullscreen.call(document).then(() => {
          canvas.width = this.config.canvaswidth;
          canvas.height = this.config.canvasheight;
        }).catch(err => {
          console.error("Fehler beim Verlassen des Vollbildmodus:", err);
        });
      } else {
        console.warn("Fullscreen API wird nicht unterstützt.");
      }
    }
  }


  protected readonly Math = Math;
}
export class Config {
  x = 50; // Startposition des Kreises
  vx = 3; // Geschwindigkeit
  y = 50; // Startposition des Balls
  vy = 2; // Startgeschwindigkeit
  resistance = 0.995;
  friction = 0.01; // Konstante Bodenreibung
  currentX = this.x;
  currentY = this.y;
  lastX = this.x;
  lastY = this.y;
  r = 255;
  g = 0;
  b = 0;
  colorbrightness = 0;
  colordarkness = 255;
  colorspeed = 5;
  gravity = 0.5; // Schwerkraft
  bounce = -1; // Rücksprungkoeffizient
  radius = 20; // Radius des Balls
  isMousedown = false;
  wasMousedown = false;
  mouseX = 0;
  mouseY = 0;
  disablespeedloss = true;
  disablegravity = true;
  ball1 = true;
  ball2 = true;
  ball3 = true;
  ball4 = true;
  allballs = true;
  smoothlines = true;
  clearcanvas = true;
  canvasheight = 800;
  canvaswidth = 1400;
  fullscreen = false;
  enableOrbit = false;
  disableBorders = false;
  clearCanvasOnClick = true;
}
