<template>
  <div class="landing-page">
    <h1 class="main-title">Take care of your eyes!</h1>

    <!-- Timer and Upload sections -->
    <div class="content-container">
      <div class="timer-section">
        <h2 style="text-align: center;">Screen Time Tracker</h2>
        <div class="timer-display">{{ formatTime }}</div>
        <div class="timer-controls">
          <button @click="startTimer" :disabled="isRunning">Start</button>
          <button @click="stopTimer" :disabled="!isRunning">Stop</button>
          <button @click="resetTimer">Reset</button>
        </div>
      </div>

      <div class="upload-section">
        <h2 style="text-align: center;">Analyze your eye health</h2>
        <div class="upload-container">
          <input type="file" @change="handleFileUpload" accept="image/*" id="image-upload" class="hidden">
          <label for="image-upload" class="upload-label">
            <span v-if="!selectedImage">Choose an image</span>
            <img v-else :src="selectedImage" alt="Selected" class="preview-image">
          </label>
          <div class="button-group" v-if="imageFile">
            <button @click="saveImage" :disabled="imageSaved">
              {{ imageSaved ? 'Image Saved' : 'Save Image' }}
            </button>
            <button @click="submitImage" v-if="imageSaved" :disabled="uploading">
              {{ uploading ? 'Submitting...' : 'Submit for Analysis' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Element -->
    <audio ref="notification">
      <source src="@/assets/sounds/notification.wav" type="audio/wav">
    </audio>

    <!-- Break Reminder Popup -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h3>Eye Break Time!</h3>
        <p>Look away 20 feet for 20 seconds</p>
        <div class="break-timer">{{ breakCountdown }}s</div>
        <button @click="closePopup">Close</button>
      </div>
    </div>

    <div v-if="analysisResult" class="analysis-result">
      <h3>Analysis Result:</h3>
      <p :class="{ 'red': analysisResult.includes('Red') }">
        {{ analysisResult }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LandingPage',
  data() {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
      isRunning: false,
      selectedImage: null,
      showPopup: false,
      breakCountdown: 20,
      imageFile: null,
      uploading: false,
      imageSaved: false,
      savedImagePath: null,
      isCameraMode: false,
      stream: null,
      capturedImage: null,
      analysisResult: null,
      settings: {
        apiKey: 'CGYmpefXrYRP5zAqEiPO',
        modelId: 'conuhacks-eye-model-own',
        version: '1'
      },
      inferenceResult: null,
      isLoading: false
    }
  },
  computed: {
    formatTime() {
      return `${this.padTime(this.hours)}:${this.padTime(this.minutes)}:${this.padTime(this.seconds)}`
    }
  },
  methods: {
    padTime(time) {
      return time.toString().padStart(2, '0')
    },
    startTimer() {
      if (!this.isRunning) {
        this.isRunning = true
        this.timer = setInterval(this.incrementTimer, 1000)
      }
    },
    stopTimer() {
      this.isRunning = false
      clearInterval(this.timer)
    },
    resetTimer() {
      this.stopTimer()
      this.hours = 0
      this.minutes = 0
      this.seconds = 0
    },
    incrementTimer() {
      this.seconds++
      if (this.seconds === 60) {
        this.seconds = 0
        this.minutes++
        if (this.minutes % 20 === 0 && this.minutes !== 0) {
          this.showBreakReminder()
        }
        // Show reminder every minute
        if (this.minutes === 60) {
          this.minutes = 0
          this.hours++
        }
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.selectedImage = URL.createObjectURL(file);
        this.imageSaved = false; // Reset when new image selected
      }
    },
    async saveImage() {
      if (!this.imageFile) return;

      // In a real app, you would save to server storage
      // For now, we'll simulate saving
      this.imageSaved = true;
      this.savedImagePath = `/uploads/${Date.now()}_${this.imageFile.name}`;
      console.log('Image saved with path:', this.savedImagePath);
    },
    analyzeEyeHealth(predictions) {
      // Check if any prediction is red-eyes
      const hasRedEyes = predictions.some(prediction =>
        prediction.class === "red-eyes"
      );

      // Return status
      return hasRedEyes ? "Red Eyes Detected" : "Healthy Eyes";
    },
    async analyzeImage() {
      try {
        this.isLoading = true;
        console.log('Inferring...');

        // Create form data
        const formData = new FormData();
        formData.append('file', this.imageFile);

        const settings = {
          url: `https://detect.roboflow.com/${this.settings.modelId}/${this.settings.version}`,
          method: 'POST',
          params: {
            api_key: this.settings.apiKey
          },
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        const response = await axios(settings);


        this.inferenceResult = response.data;
        console.log('Inference result:', this.inferenceResult);
        const predictions = response.data.predictions;
        this.analysisResult = this.analyzeEyeHealth(predictions);
        console.log(this.analysisResult);

      } catch (error) {
        console.error('Error loading response:', error);
        throw new Error([
          'Error loading response.',
          '',
          'Check your API key, model, version,',
          'and other parameters',
          'then try again.'
        ].join('\n'));
      } finally {
        this.isLoading = false;
      }
    },
    getBase64Image(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // Remove data URL prefix
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = error => reject(error);
      });
    },
    saveSettings() {
      localStorage.setItem('roboflowSettings', JSON.stringify(this.settings));
    },

    loadSettings() {
      const saved = localStorage.getItem('roboflowSettings');
      if (saved) {
        this.settings = JSON.parse(saved);
      }
    },
    created() {
      this.loadSettings();
    },
    showBreakReminder() {
      this.showPopup = true;
      this.breakCountdown = 20;

      // Play notification sound
      const audio = this.$refs.notification;
      if (audio) {
        audio.currentTime = 0;
        audio.play()
          .then(() => console.log('Notification played'))
          .catch(error => console.error('Failed to play notification:', error));
      }

      // Start countdown
      const countdownTimer = setInterval(() => {
        this.breakCountdown--;
        if (this.breakCountdown <= 0) {
          clearInterval(countdownTimer);
          this.closePopup();
        }
      }, 1000);
    },
    async submitImage() {
      if (!this.imageSaved || !this.savedImagePath) return;
      this.uploading = true;

      try {
        // Get user email from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) {
          throw new Error('User not logged in');
        }

        // Create image metadata
        const imageData = {
          id: Date.now(),
          userEmail: user.email,
          imagePath: this.savedImagePath,
          uploadDate: new Date().toISOString()
        };

        // Save to database (eye.json)
        const response = await fetch('http://localhost:6001/eyeImages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imageData)
        });

        if (response.ok) {
          await this.analyzeImage(); // Call analysis after successful upload
        }
        else {
          throw new Error('Failed to save image data');
        }

        console.log('Image metadata saved to database');
        alert('Image submitted successfully!');

        // Reset the form
        this.resetUpload();

      } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit image. Please try again.');
      } finally {
        this.uploading = false;
      }
    },
    resetUpload() {
      this.imageFile = null;
      this.selectedImage = null;
      this.imageSaved = false;
      this.savedImagePath = null;
    }
  },

  async showCamera() {
    this.isCameraMode = true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.$refs.video.srcObject = this.stream;
    } catch (err) {
      console.error('Camera error:', err);
      alert('Cannot access camera');
      this.isCameraMode = false;
    }
  },
  showUpload() {
    this.isCameraMode = false;
    this.stopCamera();
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  },

  capturePhoto() {
    const video = this.$refs.video;
    const canvas = this.$refs.canvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    this.capturedImage = canvas.toDataURL('image/jpeg');
    this.imageFile = this.dataURLtoFile(this.capturedImage, 'captured-photo.jpg');
    this.selectedImage = this.capturedImage;
    this.imageSaved = false;
  },
  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  ,
  beforeUnmount() {
    this.stopCamera();
  },
  async saveAndAnalyze() {
    if (!this.imageFile) return
    this.uploading = true

    try {
      // Get user email from localStorage
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || !user.email) {
        throw new Error('User not logged in')
      }

      // Create unique filename
      const fileName = `${Date.now()}_${this.imageFile.name}`
      const filePath = `/ assets / eyeImages / ${fileName}`

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', this.imageFile)

      // Save image metadata to eye.json
      const imageData = {
        id: Date.now(),
        userEmail: user.email,
        fileName: fileName,
        filePath: filePath,
        uploadDate: new Date().toISOString()
      }

      const response = await fetch('http://localhost:3000/eyeImages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(imageData)
      })

      if (!response.ok) {
        throw new Error('Failed to save image data')
      }

      console.log('Image saved successfully')
      this.analyzeImage()

    } catch (error) {
      console.error('Error:', error)
    } finally {
      this.uploading = false
    }
  },
  closePopup() {
    this.showPopup = false;
    this.breakCountdown = 20;
  }
}
</script>

<style scoped>
.landing-page {
  padding-top: 120px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-title {
  text-align: center;
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 4rem;
  padding-top: 2rem;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.button-group {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.button-group button {
  min-width: 120px;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.timer-section,
.upload-section {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timer-display {
  font-size: 3rem;
  font-family: monospace;
  text-align: center;
  margin: 2rem 0;
  color: #00ffcc;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  animation: popIn 0.3s ease;
}

.analysis-result {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.red {
  color: #ff4444;
  font-weight: bold;
}

.break-timer {
  font-size: 2rem;
  color: #00ffcc;
  margin: 1rem 0;
  font-weight: bold;
}

@keyframes popIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

button {
  padding: 0.8rem 1.5rem;
  background: #00ffcc;
  color: #1a1a1a;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background: #00e6b8;
  transform: translateY(-1px);
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

.upload-label {
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-label:hover {
  border-color: #00ffcc;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
  }
}
</style>
