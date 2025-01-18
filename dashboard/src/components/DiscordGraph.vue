<template>
    <div>
        <h2>Discord Events Graph</h2>
        <line-chart :chart-data="chartData"></line-chart>
    </div>
</template>

<script>
import axios from 'axios';
import { defineAsyncComponent } from 'vue';

import ErrorComponent from './ErrorComponent.vue';
import LoadingComponent from './LoadingComponent.vue';

const LineChart = defineAsyncComponent({
    loader: () => import('./LineChart'),
    // A component to use while the async component is loading
    loadingComponent: LoadingComponent,
    // A component to use if the load fails
    errorComponent: ErrorComponent,
})

export default {
    components: {
        LineChart
    },
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Event 1',
                        backgroundColor: '#f87979',
                        data: []
                    },
                    {
                        label: 'Event 2',
                        backgroundColor: '#7acbf9',
                        data: []
                    },
                    {
                        label: 'Event 3',
                        backgroundColor: '#f9f77a',
                        data: []
                    }
                ]
            }
        };
    },
    methods: {
        fetchData() {
            axios.get('/discord')
                .then(response => {
                    const data = response.data;
                    this.chartData.labels = data.labels;
                    this.chartData.datasets[0].data = data.event1;
                    this.chartData.datasets[1].data = data.event2;
                    this.chartData.datasets[2].data = data.event3;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    },
    mounted() {
        this.fetchData();
        setInterval(this.fetchData, 60000); // Update data every minute
    }
};
</script>

<style scoped>
h2 {
    text-align: center;
}
</style>
