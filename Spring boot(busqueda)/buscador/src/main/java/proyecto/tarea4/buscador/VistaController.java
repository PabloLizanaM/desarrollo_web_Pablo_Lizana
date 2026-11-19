package proyecto.tarea4.buscador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/consultas")
    public String consultas() {
        return "consultas";
    }

    @GetMapping("/metricas")
    public String metricas() {
        return "metricas";
    }

    @GetMapping("/registro")
    public String registro() {
        return "registro";
    }

    @GetMapping("/registro2")
    public String registro2() {
        return "registro2";
    }

    @GetMapping("/avistamiento")
    public String avistamiento() {
        return "avistamiento";
    }
}
