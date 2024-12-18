import { Component, AfterViewInit } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ConfigDialogComponent} from './config-dialog/config-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MatIconButton,
    MatIcon,
    MatButton
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {


  config = new Config();
  preset = new Config();
  handyPreset = new Config();

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.startAnimation();
    this.loadConfigFromCookie(); // Config beim Laden initialisieren

    this.handyPreset.canvasheight = 3000;
    this.handyPreset.radius = 50;
    this.handyPreset.clearcanvas = false;
  }

  startAnimation(): void {
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    const container = canvas.parentElement as HTMLElement;
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

      //
      // console.log(currentX)
      // console.log(lastX)
      // console.log(speed);

      if(this.config.isMousedown) {
        this.config.x = this.config.mouseX
        this.config.y = this.config.mouseY
        if(!this.config.wasMousedown) {
          console.log("click")
          this.config.wasMousedown = true;
          this.config.lastX = this.config.x;
          this.config.lastY = this.config.y;
          this.config.currentX = this.config.x;
          this.config.currentY = this.config.y;
        }
        this.config.vy = this.config.currentY - this.config.lastY;
      }
      this.config.speed = Math.abs(this.config.currentX - this.config.lastX);

      this.config.isDirectionRight = this.config.currentX > this.config.lastX;

      if (this.config.y > canvas.height - this.config.radius && this.config.vy > 0) { // Boden erreicht
        // this.config.y = canvas.height - this.config.radius; // Ball bleibt auf dem Boden
        this.config.vy *= this.config.bounce; // Rücksprung (Geschwindigkeit umkehren)
      } else if (this.config.y < this.config.radius && this.config.vy < 0) { // Decke erreicht
        // this.config.y = this.config.radius; // Ball bleibt auf dem Boden
        this.config.vy *= this.config.bounce; // Rücksprung (Geschwindigkeit umkehren)
      } else if(!this.config.disablegravity){
        if (this.config.y < canvas.height/2){
          this.config.vy += this.config.gravity; // Geschwindigkeit durch Schwerkraft erhöhen
        } else if (this.config.y > canvas.height/2) {
          this.config.vy -= this.config.gravity; // Geschwindigkeit durch Schwerkraft erhöhen
        }
      }
      if(!this.config.isMousedown) {
        this.config.y += this.config.vy; // Position ändern
      }

      if(!this.config.disablespeedloss) {
        this.config.speed *= this.config.resistance;
        this.config.speed -= this.config.friction;
      }
      if (this.config.speed < 0) {
        this.config.speed = 0;
      }

      if (this.config.x + this.config.radius > canvas.width) {
        this.config.isDirectionRight = false;
      }
      if (this.config.x - this.config.radius < 0) {
        this.config.isDirectionRight = true;
      }
      if(!this.config.isMousedown) {
        if(this.config.isDirectionRight){
          this.config.x += this.config.speed;
        } else {
          this.config.x -= this.config.speed;
        }
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
        this.config = this.handyPreset;
    }
  }

  clearCanvas() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
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

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
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

  onSaveConfig(): void {
    this.saveConfigToCookie(); // Config manuell speichern
  }

  protected readonly Math = Math;
}
export class Config {
  x = 50; // Startposition des Kreises
  speed = 3; // Geschwindigkeit
  resistance = 0.995;
  friction = 0.01; // Konstante Bodenreibung
  y = 50; // Startposition des Balls
  vy = 2; // Startgeschwindigkeit
  isDirectionRight = true;
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
}
