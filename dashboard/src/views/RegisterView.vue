<template>
    <div class="registration-container">
        <h1>Register</h1>
        <form id="registrationForm" ref="form" @submit.prevent="register">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" v-model="form.firstName" required>

            <label for="surname">Surname:</label>
            <input type="text" id="surname" v-model="form.surname" required>

            <label for="email">Email:</label>
            <input type="email" id="email" v-model="form.email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" v-model="form.password" :disabled="isGoogleUser" required>

            <label for="passwordVerification">Verify Password:</label>
            <input type="password" id="passwordVerification" v-model="form.passwordVerification" :disabled="isGoogleUser" required>

            <label for="company">Company:</label>
            <input type="text" id="company" v-model="form.company" required>

            <button type="submit">Register</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                firstName: '',
                surname: '',
                email: '',
                password: '',
                passwordVerification: '',
                company: ''
            },
            isGoogleUser: false
        };
    },
    methods: {
        register() {
            // Handle form submission
            axios.post('/api/register', this.form)
                .then(response => {
                    console.log('Registration successful', response.data);
                    this.$router.replace('/dashboard')
                    // Handle successful registration (e.g., redirect to login page)
                })
                .catch(error => {
                    console.error('Registration failed', error);
                    // Handle registration error (e.g., display error message)
                });
            console.log('Form submitted', this.form);
        },
        populateGoogleFields() {
            const params = new URLSearchParams(window.location.search);
            const email = params.get('email');
            if (email) {
                this.form.email = email;
                this.isGoogleUser = true;
            }
        }
    },
    mounted() {
        this.populateGoogleFields();
    }
};
</script>

<style scoped>
.registration-container {
    /* Add your styles here */
}
</style>
