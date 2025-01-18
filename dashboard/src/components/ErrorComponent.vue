<template>
    <div class="error-message" v-if="message">
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: 'ErrorComponent',
    props: {
        message: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.error-message {
    color: red;
    font-weight: bold;
}
</style>
