import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private sounds: {[key: string]: AudioBuffer} = {};
  private _soundEnabled: boolean = true;

  constructor() {
    this.initAudio();
    this.loadSounds();
    
    // Check local storage for sound preference
    const soundPref = localStorage.getItem('ticTacToeSoundEnabled');
    if (soundPref !== null) {
      this._soundEnabled = soundPref === 'true';
    }
  }

  private initAudio(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser');
    }
  }

  private loadSounds(): void {
    if (!this.audioContext) return;
    
    // Load the provided sound file
    this.loadSound('move', '/assets/sounds/tic-tac-27828.mp3');
    
    // Create variations for win and draw sounds by adjusting pitch
    this.loadSound('win', '/assets/sounds/tic-tac-27828.mp3').then(buffer => {
      if (buffer && this.audioContext) {
        // Create a higher pitched version for win sound
        this.createPitchedSound('win', buffer, 1.2); // higher pitch for win
      }
    });
    
    this.loadSound('draw', '/assets/sounds/tic-tac-27828.mp3').then(buffer => {
      if (buffer && this.audioContext) {
        // Create a lower pitched version for draw sound
        this.createPitchedSound('draw', buffer, 0.8); // lower pitch for draw
      }
    });
  }

  private async loadSound(name: string, path: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[name] = audioBuffer;
      return audioBuffer;
    } catch (error) {
      console.warn(`Error loading sound ${name}:`, error);
      return null;
    }
  }

  private createPitchedSound(name: string, sourceBuffer: AudioBuffer, pitch: number): void {
    if (!this.audioContext) return;
    
    try {
      // Create a new buffer with adjusted length based on pitch
      const rate = pitch;
      const originalLength = sourceBuffer.length;
      const newLength = Math.floor(originalLength / rate);
      
      const offlineCtx = new OfflineAudioContext(
        sourceBuffer.numberOfChannels,
        newLength,
        sourceBuffer.sampleRate
      );
      
      const source = offlineCtx.createBufferSource();
      source.buffer = sourceBuffer;
      source.playbackRate.value = rate;
      source.connect(offlineCtx.destination);
      source.start();
      
      // Render the pitched buffer
      offlineCtx.startRendering().then(pitchedBuffer => {
        this.sounds[name] = pitchedBuffer;
      }).catch(err => {
        console.warn('Error creating pitched sound:', err);
      });
    } catch (e) {
      console.warn('Error creating pitched sound:', e);
    }
  }

  playSound(name: string): void {
    if (!this.audioContext || !this._soundEnabled || !this.sounds[name]) return;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      
      // Create a gain node for volume control
      const gainNode = this.audioContext.createGain();
      
      // Adjust volume based on sound type
      if (name === 'win') {
        gainNode.gain.value = 1.0; // Full volume for win
      } else if (name === 'draw') {
        gainNode.gain.value = 0.7; // Slightly lower volume for draw
      } else {
        gainNode.gain.value = 0.8; // Default volume for move
      }
      
      // Connect source to gain node, then to destination
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start(0);
    } catch (e) {
      console.warn('Error playing sound:', e);
    }
  }

  get soundEnabled(): boolean {
    return this._soundEnabled;
  }

  set soundEnabled(value: boolean) {
    this._soundEnabled = value;
    localStorage.setItem('ticTacToeSoundEnabled', value.toString());
  }

  toggleSound(): void {
    this.soundEnabled = !this._soundEnabled;
  }
}
 