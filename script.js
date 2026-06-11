// ===================================
// 1. VALIDACIÓN DEL FORMULARIO DE CONTACTO
// ===================================
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearErrors();
    
    // Obtener valores
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const people = document.getElementById('people').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value.trim();
    const terms = document.getElementById('terms').checked;
    
    let hasError = false;
    
    // Validar nombre
    if (name.length < 2) {
        showError('nameError', 'El nombre debe tener al menos 2 caracteres');
        hasError = true;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Ingresa un email válido');
        hasError = true;
    }
    
    // Validar teléfono
    const phoneRegex = /^[\d\s\+\-]+$/;
    if (phone.length < 8 || !phoneRegex.test(phone)) {
        showError('phoneError', 'Ingresa un teléfono válido (min 8 dígitos)');
        hasError = true;
    }
    
    // Validar número de personas
    if (!people || parseInt(people) < 1 || parseInt(people) > 20) {
        showError('peopleError', 'Número de personas debe ser entre 1 y 20');
        hasError = true;
    }
    
    // Validar fecha
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showError('dateError', 'Selecciona una fecha futura');
        hasError = true;
    }
    
    // Validar términos
    if (!terms) {
        alert('Debes aceptar los términos y condiciones');
        hasError = true;
    }
    
    // Si no hay errores
    if (!hasError) {
        const formData = {
            name,
            email,
            phone,
            people: parseInt(people),
            date,
            message,
            type: document.getElementById('type').value
        };

        fetch("https://lns7itq7jg.execute-api.us-east-2.amazonaws.com/reserva", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Reserva guardada:", data);

            showSuccessMessage(formData);

            document.getElementById("contactForm").reset();
        })
        .catch(error => {
            console.error("Error:", error);

            alert("No se pudo guardar la reserva");
        });
    }
});

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function showSuccessMessage(formData) {
    const total = formData.people <= 10 
        ? formData.people * (formData.people > 10 ? 38 : 45)
        : formData.people * 38;
    
    const message = `
        ✨ ¡Gracias ${formData.name}! 
        
        Tu reserva ha sido recibida correctamente:
        
        📅 Fecha: ${formData.date}
        👥 Personas: ${formData.people}
        💰 Total estimado: $${total} USD
        
        Javier Zamora se pondrá en contacto contigo en menos de 24 horas para confirmar tu tour.
        
        📞 Teléfono: +593 99 XXX XXXX
        📧 Email: javier.zamora@tourmanta.ec
        
        ¡Esperamos tu aventura en Manta! 🌊
    `;
    
    alert(message);
}

// ===================================
// 2. DESPLIEGUE DEL MENÚ DE NAVEGACIÓN MÓVIL
// ===================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    
    // Animación del botón
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav')) {
        navLinks.classList.remove('active');
        
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ===================================
// 3. ANIMACIÓN DE SCROLL SUAVE
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// 4. CAMBIO DE HEADER AL SCROLL
// ===================================
const header = document.getElementById('header');

window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Actualizar navegación activa
    updateActiveNav();
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');
        }
    });
}

// ===================================
// 5. ANIMACIÓN DE ELEMENTOS AL SCROLL
// ===================================
const animatedElements = document.querySelectorAll('.tour-card, .price-card, .fauna-card, .testimonio-card, .info-card');

function checkAnimation() {
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Inicializar elementos animados
animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', checkAnimation);
window.addEventListener('load', checkAnimation);

// ===================================
// 6. VALIDACIÓN DE FECHA (NO PERMITIR FECHAS PASADAS)
// ===================================
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// ===================================
// 7. CONTADOR DE ESTADÍSTICAS DEL HERO
// ===================================
const statNumbers = document.querySelectorAll('.stat-number');

function animateStats() {
    statNumbers.forEach(stat => {
        const target = stat.getAttribute('data-count');
        if (target && !stat.classList.contains('animated')) {
            stat.classList.add('animated');
            stat.textContent = target + stat.textContent.replace(target, '');
        }
    });
}

window.addEventListener('load', animateStats);

// ===================================
// 8. EFECTO PARALLEX EN HERO (OPCIONAL)
// ===================================
document.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        hero.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// ===================================
// 9. CONFIRMACIÓN DE TELÉFONO
// ===================================
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', function(e) {
    // Permitir solo números, espacios, + y -
    this.value = this.value.replace(/[^\d\s\+-]/g, '');
});

// ===================================
// 10. INICIALIZACIÓN
// ===================================
console.log('🌊 Landing page Tour Manta - Javier Zamora cargada correctamente');
console.log('✅ Validación de formulario activa');
console.log('✅ Menú móvil activo');
console.log('✅ Scroll suave activo');
console.log('✅ Animaciones al scroll activas');

// Inicializar cuando la página esté completamente cargada
window.addEventListener('load', function() {
    checkAnimation();
});
