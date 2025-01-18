<template>
    <div :class="mode">
        <header>
            <h1>NurtureNode</h1>
            <button id="login"><router-link to="/login">Login</router-link></button>
            <button id="toggleMode" @click="toggleMode"><img class='dark-icon' src="../assets/darkmode.png" /></button>
        </header>
        <main>
            <h2>Welcome to NurtureNode</h2>
            <p>Community management made simple. Sign up for early access today!</p>
            <button class="cta-button">Join Early Access</button>
            <div class="features">
                <div class="feature" v-for="(feature, index) in features" :key="index">
                    <img :src="feature.image" :alt="feature.alt">
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                </div>
            </div>
        </main>
        <footer>
            <p>&copy; 2024 NurtureNode. All rights reserved.</p>
        </footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mode: 'light-mode',
            features: [
                {
                    image: '../assets/manage-community.jpeg',
                    alt: 'Feature 1',
                    title: 'Manage Your Community',
                    description: 'Simple and intuitive tools to help you manage your community efficiently.'
                },
                {
                    image: '../assets/engagement.jpeg',
                    alt: 'Feature 2',
                    title: 'Engage Effectively',
                    description: 'Keep your members engaged with modern communication tools.'
                },
                {
                    image: '../assets/analytics.jpeg',
                    alt: 'Feature 3',
                    title: 'Grow Seamlessly',
                    description: 'Insights and analytics to help you grow your community.'
                }
            ]
        };
    },
    methods: {
        toggleMode() {
            this.mode = this.mode === 'light-mode' ? 'dark-mode' : 'light-mode';
        }
    }
};
import '@/assets/nuturenode.css';
</script>

<style scoped>

</style>
