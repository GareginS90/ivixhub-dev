package am.ivixhub.api.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Component
public class LocalDocumentStorage implements DocumentStorage {

    private final Path rootDir;

    public LocalDocumentStorage(@Value("${ivixhub.storage.local.rootDir}") String rootDir) {
        this.rootDir = Paths.get(rootDir).toAbsolutePath().normalize();
    }

    @Override
    public StoredDocument store(String subdir, String originalFilename, InputStream inputStream) {
        try {
            String safeName = sanitize(originalFilename);
            String newName = UUID.randomUUID() + "-" + safeName;

            Path dir = rootDir.resolve(subdir).normalize();
            Files.createDirectories(dir);

            Path target = dir.resolve(newName).normalize();

            // защита от path traversal
            if (!target.startsWith(rootDir)) {
                throw new IllegalArgumentException("Invalid path");
            }

            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);

            // Пока возвращаем "file://" URL для dev.
            // Позже заменим на CDN/S3 URL без изменения доменной модели.
            String fileUrl = "file://" + target.toString();

            return new StoredDocument(newName, fileUrl);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to store document: " + e.getMessage());
        }
    }

    private String sanitize(String name) {
        if (name == null || name.isBlank()) return "file";
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
