<template>
    <div class="main-body">
        <header>
            <h1>Main Dashboard</h1>
        </header>
        <section>
            <!-- Add your main components here -->
            <DiscordGraph />
            <!-- Add more components as needed -->
        </section>
    </div>
</template>

<script>
import DiscordGraph from '../components/DiscordGraph.vue';


export default {
    name: 'DashboardView',
    components: {
        DiscordGraph,

    },
    data() {
        return {
            // Add your main business logic data here
        };
    },
    methods: {
        // Add your main business logic methods here
    },
    mounted() {
        // Add any initialization logic here
    }
};
</script>

<style scoped>
.main-body {
    padding: 20px;
}

header {
    margin-bottom: 20px;
}

section {
    display: flex;
    flex-direction: column;
}
</style>
