
const datosMetricasRegion = [
    { region: "Región Metropolitana de Santiago", reportes: 120 },
    { region: "Valparaíso", reportes: 85 },
    { region: "Biobío", reportes: 54 },
    { region: "La Araucanía", reportes: 41 },
    { region: "Los Ríos", reportes: 33 },
    { region: "Coquimbo", reportes: 25 }
];

const cargarGraficoDia = async () => {
    const canvas = document.getElementById('chartAvistamientosDia');
    if (!canvas) return;

    try {
        const res = await fetch('/api/metricas/avistamientos-dia');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.map(item => item.fecha),
                datasets: [{
                    label: 'Cantidad de Avistamientos',
                    data: data.map(item => item.total),
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
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar avistamientos por día:', error);
    }
};

const cargarGraficoAves = async () => {
    const canvas = document.getElementById('chartAvistamientosAves');
    if (!canvas) return;

    try {
        const res = await fetch('/api/metricas/avistamientos-aves');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        new Chart(canvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: data.map(item => item.ave),
                datasets: [{
                    data: data.map(item => item.total),
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
    } catch (error) {
        console.error('Error al cargar avistamientos por ave:', error);
    }
};

const cargarGraficoComuna = async () => {
    const canvas = document.getElementById('chartVoluntariosComuna');
    if (!canvas) return;

    try {
        const res = await fetch('/api/metricas/voluntarios-comuna');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.map(item => item.comuna),
                datasets: [{
                    label: 'Total de Voluntarios',
                    data: data.map(item => item.total),
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
        console.error('Error al cargar voluntarios por comuna:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cargarGraficoDia();
    cargarGraficoAves();
    cargarGraficoComuna();
});