<template>
    <div class="landing-page">
        <h1 class="main-title">TAKE CARE OF YOUR EYE!!</h1>

        <!-- Timer and Upload sections -->
        <div class="content-container">
            <div class="timer-section">
                <h2>Screen Time Tracker</h2>
                <div class="timer-display">{{ formatTime }}</div>
                <div class="timer-controls">
                    <button @click="startTimer" :disabled="isRunning">Start</button>
                    <button @click="stopTimer" :disabled="!isRunning">Stop</button>
                    <button @click="resetTimer">Reset</button>
                </div>
            </div>

            <div class="upload-section">
                <h2>ANALYZE YOUR EYE HEALTH</h2>
                <div class="upload-container">
                    <input type="file" @change="handleFileUpload" accept="image/*" id="image-upload" class="hidden">
                    <label for="image-upload" class="upload-label">
                        <span v-if="!selectedImage">Choose an image</span>
                        <img v-else :src="selectedImage" alt="Selected" class="preview-image">
                    </label>
                    <button @click="saveAndAnalyze" v-if="selectedImage" :disabled="uploading">
                        {{ uploading ? 'Saving...' : 'Analyze' }}
                    </button>
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
    </div>
</template>

<script>
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
            uploading: false
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
        async handleFileUpload(event) {
            const file = event.target.files[0]
            if (file) {
                this.imageFile = file
                this.selectedImage = URL.createObjectURL(file)
            }
        },
        analyzeImage() {
            console.log('Analyzing image...')
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
                const filePath = `/assets/eyeImages/${fileName}`

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