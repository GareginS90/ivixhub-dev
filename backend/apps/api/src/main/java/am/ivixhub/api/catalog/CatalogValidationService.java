package am.ivixhub.api.catalog;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CatalogValidationService {

    private final CatalogSpecializationRepository specRepo;
    private final CatalogTherapyMethodRepository methodRepo;

    public CatalogValidationService(CatalogSpecializationRepository specRepo,
                                    CatalogTherapyMethodRepository methodRepo) {
        this.specRepo = specRepo;
        this.methodRepo = methodRepo;
    }

    public Set<String> normalizeAndValidateSpecializations(Set<String> codes) {
        Set<String> normalized = normalizeNonEmpty(codes, "specializations");
        List<String> existing = specRepo.findActiveCodes(normalized.stream().toList());
        ensureAllExist(normalized, existing, "Unknown specialization codes: ");
        return normalized;
    }

    public Set<String> normalizeAndValidateMethods(Set<String> codes) {
        Set<String> normalized = normalizeNonEmpty(codes, "methods");
        List<String> existing = methodRepo.findActiveCodes(normalized.stream().toList());
        ensureAllExist(normalized, existing, "Unknown method codes: ");
        return normalized;
    }

    private Set<String> normalizeNonEmpty(Set<String> input, String fieldName) {
        if (input == null || input.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be empty");
        }

        Set<String> normalized = new HashSet<>();
        for (String c : input) {
            if (c == null) continue;
            String x = c.trim().toLowerCase();
            if (!x.isBlank()) normalized.add(x);
        }

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be empty");
        }

        return normalized;
    }

    private void ensureAllExist(Set<String> normalized, List<String> existing, String prefix) {
        Set<String> ok = new HashSet<>(existing);
        Set<String> missing = new HashSet<>(normalized);
        missing.removeAll(ok);

        if (!missing.isEmpty()) {
            throw new IllegalArgumentException(prefix + String.join(", ", missing));
        }
    }
}

