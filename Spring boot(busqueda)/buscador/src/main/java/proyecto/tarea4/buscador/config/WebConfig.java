package proyecto.tarea4.buscador.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.uploads.dir:}")
    private String configuredUploadsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path resolvedDir = resolverDirectorioUploads();
        String location = resolvedDir.toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }

        System.out.println("[WebConfig] Sirviendo /uploads/** desde: " + location + " (existe: " + Files.exists(resolvedDir) + ")");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }

    private Path resolverDirectorioUploads() {
        if (configuredUploadsDir != null && !configuredUploadsDir.isBlank()) {
            Path explicita = Paths.get(configuredUploadsDir).toAbsolutePath().normalize();
            if (Files.exists(explicita)) {
                return explicita;
            }
        }

        Path actual = Paths.get("").toAbsolutePath().normalize();
        Path cursor = actual;
        for (int i = 0; i < 5 && cursor != null; i++) {
            List<Path> candidatos = List.of(
                    cursor.resolve("static/uploads"),
                    cursor.resolve("uploads"),
                    cursor.resolve("Flask(app web)/static/uploads"),
                    cursor.resolve("flask/static/uploads")
            );
            for (Path candidato : candidatos) {
                Path normalizado = candidato.normalize();
                if (Files.isDirectory(normalizado)) {
                    return normalizado;
                }
            }
            cursor = cursor.getParent();
        }

        Path fallback = actual.resolve("uploads").normalize();
        return fallback;
    }
}
