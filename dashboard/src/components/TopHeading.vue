<template>
    <header class="page-heading">
        <h1>{{ user }}</h1>
    </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: 'TopHeading',
    computed: {
        ...mapGetters(["user"]),
    },
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
