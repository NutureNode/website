<template>
    <div class="main-body">
        <TopHeading />
        <LeftNavBar />
        <section>
            <!-- Add your main components here -->
            <DiscordGraph />
            <!-- Add more components as needed -->
        </section>
    </div>
</template>

<script>
import LeftNavBar from '../components/LeftNavBar.vue';
import DiscordGraph from '../components/DiscordGraph.vue';
import TopHeading from '../components/TopHeading.vue';


export default {
    name: 'DashboardView',
    components: {
        LeftNavBar,
        DiscordGraph,
        TopHeading,
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
