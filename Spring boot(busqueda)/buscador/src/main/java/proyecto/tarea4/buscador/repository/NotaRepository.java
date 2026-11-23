package proyecto.tarea4.buscador.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import proyecto.tarea4.buscador.model.Nota;

public interface NotaRepository extends JpaRepository<Nota, Integer> {
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avistamientoId = :avistamientoId")
    Double calcularPromedioPorAvistamiento(@Param("avistamientoId") Integer avistamientoId);
}