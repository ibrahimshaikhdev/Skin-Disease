package com.dermacarevision.gateway.prediction;

import com.dermacarevision.gateway.config.AppProperties;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/** Stores and retrieves uploaded lesion images on the local filesystem. */
@Service
public class FileStorageService {

    private final Path root;

    public FileStorageService(AppProperties props) {
        this.root = Paths.get(props.getUploadsDir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not create uploads directory", e);
        }
    }

    /** Persist bytes and return the generated filename (UUID + extension). */
    public String store(byte[] bytes, String originalFilename) {
        String ext = extensionOf(originalFilename);
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        try {
            Files.write(root.resolve(filename), bytes);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store image", e);
        }
        return filename;
    }

    public byte[] read(String filename) {
        Path resolved = safeResolve(filename);
        try {
            return Files.readAllBytes(resolved);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read image: " + filename, e);
        }
    }

    public boolean exists(String filename) {
        if (filename == null) return false;
        return Files.exists(safeResolve(filename));
    }

    /** Resolve a filename within the uploads root, rejecting path traversal. */
    private Path safeResolve(String filename) {
        Path resolved = root.resolve(filename).normalize();
        if (!resolved.startsWith(root)) {
            throw new IllegalArgumentException("Invalid filename");
        }
        return resolved;
    }

    private String extensionOf(String name) {
        if (name == null) return "";
        int dot = name.lastIndexOf('.');
        if (dot < 0) return "";
        String ext = name.substring(dot).toLowerCase();
        return ext.matches("\\.[a-z0-9]{1,5}") ? ext : "";
    }
}
