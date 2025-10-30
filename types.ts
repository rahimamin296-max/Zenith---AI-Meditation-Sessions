
export interface MeditationSession {
  script: string;
  imageUrl: string;
  audioBuffer: AudioBuffer;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
