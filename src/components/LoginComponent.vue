<template>
    <div class="login-page">
        <div class="illustration-side">
            <img src="@/assets/6333040.jpg" alt="Login" class="login-image" />
            <h1 class="brand-text">eye<span>T</span></h1>
        </div>
        <div class="form-side">
            <div class="login-container">
                <h2>Welcome Back</h2>
                <p class="subtitle">Sign in to your account</p>
                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="email" required :class="{ 'error': errors.email }"
                            placeholder="Enter your email">
                        <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" v-model="password" required
                            :class="{ 'error': errors.password }" placeholder="Enter your password">
                        <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                    </div>

                    <button type="submit" :disabled="loading">
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </button>

                    <p class="error-message" v-if="loginError">{{ loginError }}</p>
                </form>
                <p class="signup-link">
                    Don't have an account? <router-link to="/signup">Sign up</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginComponent',
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            loginError: '',
            errors: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        validateForm() {
            let isValid = true
            this.errors = {
                email: '',
                password: ''
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
            }

            return isValid
        },

        async handleLogin() {
            if (!this.validateForm()) return

            this.loading = true
            this.loginError = ''

            try {
                const response = await fetch(`http://localhost:3000/users?email=${this.email}`)
                const users = await response.json()

                const user = users.find(u => u.email === this.email && u.password === this.password)

                if (user) {
                    console.log('Login successful:', true)
                    localStorage.setItem('user', JSON.stringify(user))
                    this.$router.push('/dashboard')
                } else {
                    console.log('Login successful:', false)
                    throw new Error('Invalid email or password')
                }

            } catch (error) {
                this.loginError = error.message
                console.error('Login error:', error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.login-page {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    min-height: 100vh;
    background: #f5f5f5;
}

.illustration-side {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    /* background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); */
    padding: 2rem;
    position: relative;
}

.login-image {
    width: 100%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    margin-bottom: 2rem;
    border-radius: 12px;
    /* box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); */
}

.brand-text {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.brand-text span {
    color: #00ffcc;
}

.form-side {
    display: flex;
    align-items: flex-start;
    /* Changed from center */
    justify-content: flex-start;
    padding: 8rem 2rem 4rem 0;
    /* Increased top padding */
}

.login-container {
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: -3rem;
    /* Added negative margin to move up */
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
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #444;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #00ffcc;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 255, 204, 0.1);
}

input.error {
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
}

button:hover:not(:disabled) {
    background: #00e6b8;
    transform: translateY(-1px);
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}

.signup-link {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
}

.signup-link a {
    color: #00ffcc;
    text-decoration: none;
    font-weight: 500;
}

.signup-link a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .login-page {
        grid-template-columns: 1fr;
    }

    .illustration-side {
        display: none;
    }

    .form-side {
        padding: 2rem 1rem;
    }

    .login-container {
        padding: 1.5rem;
    }
}
</style>