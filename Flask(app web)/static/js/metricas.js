
const datosMetricasRegion = [
    { region: "Región Metropolitana de Santiago", reportes: 120 },
    { region: "Valparaíso", reportes: 85 },
    { region: "Biobío", reportes: 54 },
    { region: "La Araucanía", reportes: 41 },
    { region: "Los Ríos", reportes: 33 },
    { region: "Coquimbo", reportes: 25 }
];

document.addEventListener('DOMContentLoaded', async() => {
    try {
        const ResDia = await fetch('/api/metricas/avistamientos-dia');
        const DataDia = await ResDia.json();
        const CtxDia = document.getElementById('chartAvistamientosDia').getContext('2d');
        const ResAves = await fetch('/api/metricas/avistamientos-aves');
        const DataAves = await ResAves.json();
        const CtxAves = document.getElementById('chartAvistamientosAves').getContext('2d');
        const ResComuna = await fetch('/api/metricas/voluntarios-comuna');
        const DataComuna = await ResComuna.json();
        const CtxComuna = document.getElementById('chartVoluntariosComuna').getContext('2d');

        new Chart( CtxDia, {
            type: 'line',
            data: {
                labels: DataDia.map(item => item.fecha),
                datasets: [{
                    label: 'Cantidad de Avistamientos',
                    data: DataDia.map(item => item.total),
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {beginAtZero:true, ticks: { stepSize:1 } }
                }
            }
        });

        new Chart(CtxAves, {
            type: 'pie',
            data: {
                labels: DataAves.map(item => item.ave),
                datasets: [{
                    data: DataAves.map(item => item.total),
                    backgroundColor: [
                        '#27ae60', '#2980b9', '#f39c12', '#e74c3c', '#8e44ad', '#1abc9c'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        new Chart(CtxComuna, {
            type: 'bar',
            data: {
                labels: DataComuna.map(item => item.comuna),
                datasets: [{
                    label: 'Total de Voluntarios',
                    data: DataComuna.map(item => item.total),
                    backgroundColor: '#2980b9',
                    borderColor: '#1f618d',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar y renderizar las metricas:', error);
    }
});