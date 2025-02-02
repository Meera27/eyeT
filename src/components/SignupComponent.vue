<template>
    <div class="signup-page">
        <div class="form-side">
            <div class="signup-container">
                <h2>Create Account</h2>
                <p class="subtitle">Join eyeT today</p>
                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <input type="text" v-model="firstName" :class="{ 'error': errors.firstName }"
                            placeholder="First Name" required />
                        <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
                    </div>

                    <div class="form-group">
                        <input type="text" v-model="lastName" :class="{ 'error': errors.lastName }"
                            placeholder="Last Name" required />
                        <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
                    </div>

                    <div class="form-group">
                        <input type="email" v-model="email" :class="{ 'error': errors.email }"
                            placeholder="Email Address" required />
                        <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
                    </div>

                    <div class="form-group">
                        <input type="password" v-model="password" :class="{ 'error': errors.password }"
                            placeholder="Password" required />
                        <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                    </div>

                    <div class="form-group">
                        <input type="date" v-model="dateOfBirth" :class="{ 'error': errors.dateOfBirth }"
                            placeholder="Date of Birth" required />
                        <span class="error-message" v-if="errors.dateOfBirth">{{ errors.dateOfBirth }}</span>
                    </div>

                    <div class="form-group">
                        <input type="tel" v-model="phoneNumber" :class="{ 'error': errors.phoneNumber }"
                            placeholder="Phone Number" />
                        <span class="error-message" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
                    </div>

                    <div class="form-group">
                        <select v-model="gender" :class="{ 'error': errors.gender }">
                            <option value="" disabled selected>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        <span class="error-message" v-if="errors.gender">{{ errors.gender }}</span>
                    </div>

                    <button type="submit" :disabled="loading">
                        {{ loading ? 'Creating Account...' : 'Sign Up' }}
                    </button>
                </form>
                <p class="login-link">
                    Already have an account? <router-link to="/login">Login</router-link>
                </p>
            </div>
        </div>
        <div class="illustration-side">
            <img src="@/assets/images/2903548.jpg" alt="Signup" class="signup-image" />
            <h1 class="brand-text">eye<span>T</span></h1>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignupComponent',
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            dateOfBirth: '',
            phoneNumber: '',
            gender: '',
            loading: false,
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                dateOfBirth: '',
                phoneNumber: '',
                gender: ''
            }
        }
    },
    methods: {
        validateForm() {
            let isValid = true
            this.errors = {}

            if (!this.firstName) {
                this.errors.firstName = 'First name is required'
                isValid = false
            }

            if (!this.lastName) {
                this.errors.lastName = 'Last name is required'
                isValid = false
            }

            if (!this.email) {
                this.errors.email = 'Email is required'
                isValid = false
            } else if (!/\S+@\S+\.\S+/.test(this.email)) {
                this.errors.email = 'Please enter a valid email'
                isValid = false
            }

            if (!this.password) {
                this.errors.password = 'Password is required'
                isValid = false
            } else if (this.password.length < 6) {
                this.errors.password = 'Password must be at least 6 characters'
                isValid = false
            }

            if (!this.dateOfBirth) {
                this.errors.dateOfBirth = 'Date of birth is required'
                isValid = false
            }

            if (!this.gender) {
                this.errors.gender = 'Please select a gender'
                isValid = false
            }

            return isValid
        },

        async onSubmit() {
            if (!this.validateForm()) return

            this.loading = true
            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: this.firstName,
                        lastName: this.lastName,
                        email: this.email,
                        password: this.password,
                        dateOfBirth: this.dateOfBirth,
                        phoneNumber: this.phoneNumber,
                        gender: this.gender
                    })
                })

                if (!response.ok) throw new Error('Failed to create account')

                const data = await response.json()
                console.log('Account created:', data)
                this.$router.push('/login')

            } catch (error) {
                console.error('Error:', error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.signup-page {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    min-height: 100vh;
    background: #f5f5f5;
}

.form-side {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 8rem 0 4rem 2rem;
}

.signup-container {
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: -2rem;
}

.illustration-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
}

.signup-image {
    width: 100%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    margin-bottom: 2rem;
    border-radius: 12px;
}

.brand-text {
    color: #1a1a1a;
    font-size: 2.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.brand-text span {
    color: #00ffcc;
}

h2 {
    font-size: 2rem;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #666;
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1rem;
}

input,
select {
    width: 100%;
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

input::placeholder,
select::placeholder {
    color: #666;
}

input:focus,
select:focus {
    border-color: #00ffcc;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 255, 204, 0.1);
}

input.error,
select.error {
    border-color: #ff4444;
}

.error-message {
    color: #ff4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

button {
    width: 100%;
    padding: 1rem;
    background: #00ffcc;
    color: #1a1a1a;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

button:hover:not(:disabled) {
    background: #00e6b8;
    transform: translateY(-1px);
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}

.login-link {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
}

.login-link a {
    color: #00ffcc;
    text-decoration: none;
    font-weight: 500;
}

.login-link a:hover {
    text-decoration: underline;
}

input[type="date"] {
    color: #666;
    font-family: inherit;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: invert(0.5);
}

@media (max-width: 768px) {
    .signup-page {
        grid-template-columns: 1fr;
    }

    .illustration-side {
        display: none;
    }

    .form-side {
        padding: 2rem 1rem;
    }

    .signup-container {
        padding: 1.5rem;
        margin-top: 0;
    }
}
</style>