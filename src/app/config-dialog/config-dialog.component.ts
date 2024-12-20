import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatButton} from '@angular/material/button';
import {Config} from '../app.component';

@Component({
  selector: 'app-config-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckbox,
    MatSliderModule,
    MatButton,
  ],
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.css'],
})
export class ConfigDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { config: any, preset: any }
  ) {}

  preset = new Config();

  save(): void {
    this.dialogRef.close(this.data);
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleAllBalls(checked: boolean): void {
    // Setze den Status aller Bälle basierend auf "Show all Balls"
    this.data.config.ball1 = checked;
    this.data.config.ball2 = checked;
    this.data.config.ball3 = checked;
    this.data.config.ball4 = checked;
  }

  updateAllBallsStatus(): void {
    // Aktualisiere den Status von "Show all Balls", wenn die Einzel-Checkboxen sich ändern
    const { ball1, ball2, ball3, ball4 } = this.data.config;
    this.data.config.allballs = ball1 && ball2 && ball3 && ball4;
  }
  createPreset() {
    this.data.preset = JSON.parse(JSON.stringify(this.data.config));
  }

  onEnableOrbitChange(checked: boolean) {
    this.data.config.enableOrbit = checked;
    this.data.config.disablegravity = false;
  }

  onDisableGravityChange(checked: boolean) {
    this.data.config.disablegravity = checked;
    this.data.config.enableOrbit = false;
  }
}
