<template>
    <div class="line-chart">
        <canvas id="lineChart" ref="canvas"></canvas>
    </div>
</template>

<script>
import { Chart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
    name: 'LineChart',
    extends: Chart,
    props: {
        data: {
            type: Object,
            required: true
        },
        options: {
            type: Object,
            required: false,
            default: () => {}
        }
    },
    mounted() {
        this.chartInstance = new ChartJS(this.$refs.canvas.getContext('2d'), {
            type: 'line',
            data: this.data,
            options: this.options
        });
    }
};
</script>

<style scoped>
.line-chart {
    position: relative;
    width: 100%;
    height: 400px;
}
</style>
