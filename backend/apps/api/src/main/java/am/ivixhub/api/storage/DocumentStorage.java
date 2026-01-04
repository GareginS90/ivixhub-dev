package am.ivixhub.api.storage;

import java.io.InputStream;

public interface DocumentStorage {

    StoredDocument store(String subdir, String originalFilename, InputStream inputStream);

    record StoredDocument(String fileName, String fileUrl) {}
}
