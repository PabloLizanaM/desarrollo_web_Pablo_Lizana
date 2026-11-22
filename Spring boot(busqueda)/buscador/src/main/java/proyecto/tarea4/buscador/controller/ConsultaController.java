package proyecto.tarea4.buscador.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import proyecto.tarea4.buscador.model.Avistamiento;
import proyecto.tarea4.buscador.model.Comentario;
import proyecto.tarea4.buscador.model.Registro;
import proyecto.tarea4.buscador.repository.AvistamientoRepository;
import proyecto.tarea4.buscador.repository.ComentarioRepository;
import proyecto.tarea4.buscador.repository.RegistroRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Controller
public class ConsultaController {

    private final AvistamientoRepository avistamientoRepository;
    private final RegistroRepository registroRepository;
    private final ComentarioRepository comentarioRepository;

    private static final DateTimeFormatter FORMATO_FECHA_HORA = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final DateTimeFormatter FORMATO_DIA = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public ConsultaController(
            AvistamientoRepository avistamientoRepository,
            RegistroRepository registroRepository,
            ComentarioRepository comentarioRepository
    ) {
        this.avistamientoRepository = avistamientoRepository;
        this.registroRepository = registroRepository;
        this.comentarioRepository = comentarioRepository;
    }

    @GetMapping("/consultas")
    public String mostrarConsultas(Model model) {
        List<Avistamiento> avistamientos = avistamientoRepository.findAllConDetalle();

        var datosParaJs = new ArrayList<>();
        for (Avistamiento a : avistamientos) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", a.getId());
            item.put("ave_nombre", a.getAve().getNombre());
            item.put("voluntario_nombre", a.getVoluntario().getNombre());
            item.put("comuna_nombre", a.getVoluntario().getComuna().getNombre());
            item.put("fecha_hora", a.getFechaHora() != null ? a.getFechaHora().format(FORMATO_FECHA_HORA) : "");
            item.put("dia", a.getFechaHora() != null ? a.getFechaHora().format(FORMATO_DIA) : "");
            item.put("cantidad_archivos", registroRepository.countByAvistamientoId(a.getId()));
            datosParaJs.add(item);
        }

        model.addAttribute("avistamientos", datosParaJs);
        return "consultas";
    }

    @GetMapping("/consulta/{id}")
    @ResponseBody
    public ResponseEntity<Object> obtenerDetalle(@PathVariable Integer id) {
        Optional<Avistamiento> opt = avistamientoRepository.findByIdConDetalle(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Avistamiento no encontrado"));
        }

        Avistamiento a = opt.get();
        List<Registro> registros = registroRepository.findByAvistamientoId(id);
        List<Comentario> comentarios = comentarioRepository.findByAvistamientoIdOrderByFechaDesc(id);

        var archivosJson = new ArrayList<>();
        for (Registro r : registros) {
            Map<String, Object> archivoMap = new LinkedHashMap<>();
            archivoMap.put("ruta_archivo", r.getRutaArchivo());
            archivoMap.put("nombre_archivo", r.getNombreArchivo());
            archivosJson.add(archivoMap);
        }

        var comentariosJson = new ArrayList<>();
        for (Comentario c : comentarios) {
            Map<String, Object> comentarioMap = new LinkedHashMap<>();
            comentarioMap.put("nombre", c.getNombre());
            comentarioMap.put("texto", c.getTexto());
            comentarioMap.put("fecha", c.getFecha() != null ? c.getFecha().format(FORMATO_FECHA_HORA) : "");
            comentariosJson.add(comentarioMap);
        }

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("id", a.getId());
        respuesta.put("ave_nombre", a.getAve().getNombre());
        respuesta.put("voluntario_nombre", a.getVoluntario().getNombre());
        respuesta.put("fecha_hora", a.getFechaHora() != null ? a.getFechaHora().format(FORMATO_FECHA_HORA) : "");
        respuesta.put("comuna_nombre", a.getVoluntario().getComuna().getNombre());
        respuesta.put("region_nombre", a.getVoluntario().getComuna().getRegion().getNombre());
        respuesta.put("descripcion", a.getDescripcion() != null ? a.getDescripcion() : "");
        respuesta.put("archivos", archivosJson);
        respuesta.put("comentarios", comentariosJson);

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/consulta/{id}/comentario")
    @ResponseBody
    public ResponseEntity<Object> agregarComentario(
            @PathVariable Integer id,
            @RequestBody Map<String, String> payload
    ) {
        Optional<Avistamiento> opt = avistamientoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "El avistamiento no existe."));
        }

        String nombre = payload.getOrDefault("nombre", "").trim();
        String texto = payload.getOrDefault("texto", "").trim();

        if (nombre.length() < 3 || nombre.length() > 50) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "El nombre debe tener entre 3 y 50 caracteres."));
        }

        if (texto.length() < 5 || texto.length() > 300) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "El comentario debe tener entre 5 y 300 caracteres."));
        }

        Comentario nuevo = new Comentario();
        nuevo.setAvistamiento(opt.get());
        nuevo.setNombre(nombre);
        nuevo.setTexto(texto);
        nuevo.setFecha(LocalDateTime.now());

        comentarioRepository.save(nuevo);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Comentario guardado correctamente."
        ));
    }
}