package proyecto.tarea4.buscador.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyecto.tarea4.buscador.model.Comentario;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {

    List<Comentario> findByAvistamientoIdOrderByFechaDesc(Integer avistamientoId);
}
