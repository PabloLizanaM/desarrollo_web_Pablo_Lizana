package proyecto.tarea4.buscador.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import proyecto.tarea4.buscador.model.Avistamiento;

import java.util.List;
import java.util.Optional;


public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("""
            SELECT a
            FROM Avistamiento a
            JOIN FETCH a.ave
            JOIN FETCH a.voluntario v
            JOIN FETCH v.comuna c
            JOIN FETCH c.region
            ORDER BY a.fechaHora DESC
            """)
    List<Avistamiento> findAllConDetalle();

    @Query("""
            SELECT a
            FROM Avistamiento a
            JOIN FETCH a.ave
            JOIN FETCH a.voluntario v
            JOIN FETCH v.comuna c
            JOIN FETCH c.region
            WHERE a.id = :id
            """)
    Optional<Avistamiento> findByIdConDetalle(Integer id);
}
