package am.ivixhub.api.admin.psychologists;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectPsychologistRequest(
        @NotBlank @Size(max = 1000) String reason
) {}
