<template>
    <header class="page-heading">
        <h1>{{ title }}</h1>
    </header>
</template>

<script>
export default {
    name: 'TopHeading',
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.page-heading {
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
}

.page-heading h1 {
    margin: 0;
    font-size: 2em;
    color: #333;
}
</style>
