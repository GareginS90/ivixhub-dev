package am.ivixhub.api.admin.catalog;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.api.catalog.CatalogSpecializationRepository;
import am.ivixhub.api.catalog.CatalogTherapyMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminCatalogService {

    private final CatalogSpecializationRepository specRepo;
    private final CatalogTherapyMethodRepository methodRepo;
    private final AuditService auditService;

    public AdminCatalogService(CatalogSpecializationRepository specRepo,
                               CatalogTherapyMethodRepository methodRepo,
                               AuditService auditService) {
        this.specRepo = specRepo;
        this.methodRepo = methodRepo;
        this.auditService = auditService;
    }

    @Transactional
    public void createSpecialization(Long adminUserId, String code, String nameEn, String nameRu, String nameHy) {
        String c = normalizeCode(code);

        if (specRepo.existsById(c)) {
            throw new IllegalArgumentException("Specialization code already exists: " + c);
        }

        specRepo.insert(c, nameEn.trim(), nameRu.trim(), nameHy.trim());

        auditService.log(adminUserId, "CATALOG_SPEC_CREATE", "catalog_specializations", null,
                "code=" + c, null, null);
    }

    @Transactional
    public void setSpecializationActive(Long adminUserId, String code, boolean active) {
        String c = normalizeCode(code);

        int updated = specRepo.setActive(c, active);
        if (updated == 0) {
            throw new IllegalArgumentException("Specialization not found: " + c);
        }

        auditService.log(adminUserId,
                active ? "CATALOG_SPEC_ENABLE" : "CATALOG_SPEC_DISABLE",
                "catalog_specializations",
                null,
                "code=" + c,
                null,
                null);
    }

    @Transactional
    public void createMethod(Long adminUserId, String code, String nameEn, String nameRu, String nameHy) {
        String c = normalizeCode(code);

        if (methodRepo.existsById(c)) {
            throw new IllegalArgumentException("Method code already exists: " + c);
        }

        methodRepo.insert(c, nameEn.trim(), nameRu.trim(), nameHy.trim());

        auditService.log(adminUserId, "CATALOG_METHOD_CREATE", "catalog_therapy_methods", null,
                "code=" + c, null, null);
    }

    @Transactional
    public void setMethodActive(Long adminUserId, String code, boolean active) {
        String c = normalizeCode(code);

        int updated = methodRepo.setActive(c, active);
        if (updated == 0) {
            throw new IllegalArgumentException("Method not found: " + c);
        }

        auditService.log(adminUserId,
                active ? "CATALOG_METHOD_ENABLE" : "CATALOG_METHOD_DISABLE",
                "catalog_therapy_methods",
                null,
                "code=" + c,
                null,
                null);
    }

    private String normalizeCode(String code) {
        if (code == null) throw new IllegalArgumentException("code must not be null");
        String c = code.trim().toLowerCase();
        if (c.isBlank()) throw new IllegalArgumentException("code must not be blank");
        return c;
    }
}

