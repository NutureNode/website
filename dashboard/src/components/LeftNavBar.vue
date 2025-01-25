<template>
    <div class="left-nav-bar">
        <ul>
            <li @click="navigateTo('Members')">Members</li>
            <li @click="navigateTo('Reports')">Reports</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'LeftNavBar',
    methods: {
        navigateTo(componentName) {
            this.$emit('navigate', componentName);
        }
    }
}
</script>

<style scoped>
.left-nav-bar {
    width: 200px;
    background-color: #f8f9fa;
    padding: 10px;
}

.left-nav-bar ul {
    list-style-type: none;
    padding: 0;
}

.left-nav-bar li {
    cursor: pointer;
    padding: 10px;
    margin: 5px 0;
    background-color: #e9ecef;
    border-radius: 4px;
}

.left-nav-bar li:hover {
    background-color: #ced4da;
}
</style>
