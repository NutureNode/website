<template>
    <footer class="footer">
        <div class="container">
            <ul class="footer-links">
                <li><a href="/sitemap">Sitemap</a></li>
                <li><a href="https://www.facebook.com/NutureNode" target="_blank">Facebook</a></li>
                <li><a href="https://twitter.com/NutureNode" target="_blank">Twitter</a></li>
                <li><a href="https://www.instagram.com/NutureNode" target="_blank">Instagram</a></li>
            </ul>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
    background-color: #f8f9fa;
    padding: 1rem 0;
    text-align: center;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.footer-links a {
    color: #007bff;
    text-decoration: none;
}

.footer-links a:hover {
    text-decoration: underline;
}
</style>
