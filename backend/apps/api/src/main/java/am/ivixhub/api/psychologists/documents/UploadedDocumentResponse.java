package am.ivixhub.api.psychologists.documents;

import am.ivixhub.psychologists.domain.PsychologistDocumentType;

import java.time.OffsetDateTime;

public record UploadedDocumentResponse(
        Long id,
        Long psychologistId,
        PsychologistDocumentType docType,
        String fileName,
        String fileUrl,
        OffsetDateTime uploadedAt
) {}
