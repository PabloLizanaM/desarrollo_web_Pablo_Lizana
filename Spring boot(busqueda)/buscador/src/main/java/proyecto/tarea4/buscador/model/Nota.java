package proyecto.tarea4.buscador.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "avistamiento_id", nullable = false)
    private Integer avistamientoId;

    @Column(name = "nota", nullable = false)
    private Integer nota;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAvistamiento() {
        return avistamientoId;
    }

    public void setAvistamiento(Integer avistamientoId) {
        this.avistamientoId = avistamientoId;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }
}