<template>
    <div class="login-container">
        <header>
            <h1>NurtureNode</h1>
            <button @click="toggleMode"><img class='dark-icon' src="images/darkmode.png" /></button>
        </header>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div>
                <input type="email" v-model="email" placeholder="Email" required>
            </div>
            <div>
                <input type="password" v-model="password" placeholder="Password" required>
            </div>
            <button type="submit" class="login-button">Login</button>
        </form>
        <router-link to="/register">Register</router-link>
        <hr>
        <button class="login-button google" @click="loginWithGoogle">Login with Google</button>
        <button class="login-button microsoft" @click="loginWithMicrosoft">Login with Microsoft</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async login() {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: this.email, password: this.password }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Login successful!');
                window.location.href = '/dashboard';
            } else {
                alert('Login failed: ' + result.message);
            }
        },
        loginWithGoogle() {
            window.location.href = "/auth/google";
        },
        loginWithMicrosoft() {
            window.location.href = "/auth/microsoft";
        },
        toggleMode() {
            document.body.classList.toggle('dark-mode');
        }
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-button {
    display: block;
    margin: 10px auto;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.google {
    background-color: #db4437;
    color: white;
}

.microsoft {
    background-color: #0078d7;
    color: white;
}
</style>
