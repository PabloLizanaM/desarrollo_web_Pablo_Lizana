package proyecto.tarea4.buscador.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyecto.tarea4.buscador.model.Registro;

import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Integer> {

    List<Registro> findByAvistamientoId(Integer avistamientoId);

    long countByAvistamientoId(Integer avistamientoId);
}