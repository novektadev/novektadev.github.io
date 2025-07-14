// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Burger Functionality ---
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // --- Dynamic Content Loading ---
    const contentWrapper = document.getElementById('contentWrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to update content by fetching HTML from a file
    async function updateContent(contentKey) {
        const filePath = `pages/${contentKey}.html`; // Construct the file path
        try {
            const response = await fetch(filePath);
            //console.log(filePath)
            if (!response.ok) {
                // If the response is not OK (e.g., 404 Not Found)
                console.error(`Error fetching content: ${response.status} ${response.statusText}`);
                // Attempt to load a default error page or home page
                contentWrapper.innerHTML = `
                    <section class="section has-text-centered">
                        <h1 class="title has-text-danger">Error al cargar el contenido</h1>
                        <p class="subtitle">No se encontró la página solicitada (${contentKey}).</p>
                        <p>Por favor, intente de nuevo más tarde o navegue a otra sección.</p>
                    </section>
                `;
                return; // Stop execution
            }
            const htmlContent = await response.text();
            contentWrapper.innerHTML = htmlContent;
            contentWrapper.scrollTop = 0; // Scroll to top of content
        } catch (error) {
            console.error('Network or parsing error:', error);
            contentWrapper.innerHTML = `
                <section class="section has-text-centered">
                    <h1 class="title has-text-danger">Error de red</h1>
                    <p class="subtitle">No se pudo cargar el contenido debido a un problema de red.</p>
                    <p>Verifique su conexión a internet o intente de nuevo.</p>
                </section>
            `;
        }
    }

    // Function to set active class on nav item
    function setActiveNavItem(clickedLink) {
        navLinks.forEach(link => link.classList.remove('is-active'));
        if (clickedLink) {
            clickedLink.classList.add('is-active');
        }
    }

    // Add click listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior (page refresh)
            const contentKey = event.target.dataset.content;
            //console.log('adding listener for ', contentKey)
            updateContent(contentKey);
            setActiveNavItem(event.target);
            // Close the mobile menu after clicking a link
            const navbarMenu = document.getElementById('navbarBasic');
            const navbarBurger = document.querySelector('.navbar-burger');
            if (navbarMenu.classList.contains('is-active')) {
                navbarMenu.classList.remove('is-active');
                navbarBurger.classList.remove('is-active');
            }
        });
    });

    // Set initial content to "Home" and mark it as active
    updateContent('inicio');
    setActiveNavItem(document.querySelector('.navbar-item.nav-link[data-content="inicio"]'));

    // --- Footer Time Update ---
    const currentTimeSpan = document.getElementById('currentTime');

    function updateLocalTime() {
        const options = {
            timeZone: 'America/Mazatlan',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };
        const culiacanTime = new Date().toLocaleTimeString('en-US', options);
        currentTimeSpan.textContent = culiacanTime;
    }

    // Update time immediately and then every second
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
});