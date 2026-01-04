package am.ivixhub.api.psychologists.documents;

import am.ivixhub.psychologists.domain.PsychologistDocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UploadDocumentRequest(
        @NotNull PsychologistDocumentType docType,
        @NotBlank @Size(max = 255) String fileName,
        @NotBlank @Size(max = 1024) String fileUrl
) {}
