
const datosMetricasRegion = [
    { region: "Región Metropolitana de Santiago", reportes: 120 },
    { region: "Valparaíso", reportes: 85 },
    { region: "Biobío", reportes: 54 },
    { region: "La Araucanía", reportes: 41 },
    { region: "Los Ríos", reportes: 33 },
    { region: "Coquimbo", reportes: 25 }
];

document.addEventListener('DOMContentLoaded', () => {
    const ctxAvistamientos = document.getElementById('chartAvistamientos').getContext('2d');
    new Chart(ctxAvistamientos, {
        type: 'bar',
        data: {
            labels: ['Metropolitana', 'Valparaíso', 'Biobío', 'La Araucanía', 'Los Ríos', 'Coquimbo'],
            datasets: [{
                label: 'Cantidad de Avistamientos',
                data: [120, 85, 54, 41, 33, 25],
                backgroundColor: '#27ae60',
                borderColor: '#1e8449',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxVoluntarios = document.getElementById('chartVoluntarios').getContext('2d');
    new Chart(ctxVoluntarios, {
        type: 'doughnut',
        data: {
            labels: ['Zona Norte', 'Zona Centro', 'Zona Sur', 'Zona Austral'],
            datasets: [{
                label: 'Voluntarios',
                data: [18, 65, 31, 10],
                backgroundColor: [
                    '#f39c12',
                    '#2980b9',
                    '#27ae60',
                    '#8e44ad'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});