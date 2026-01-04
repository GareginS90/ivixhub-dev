
package am.ivixhub.api.admin.catalog;

import am.ivixhub.api.catalog.CatalogSpecialization;
import am.ivixhub.api.catalog.CatalogSpecializationRepository;
import am.ivixhub.api.catalog.CatalogTherapyMethod;
import am.ivixhub.api.catalog.CatalogTherapyMethodRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/catalog")
public class AdminCatalogController {

    private final CatalogSpecializationRepository specRepo;
    private final CatalogTherapyMethodRepository methodRepo;
    private final AdminCatalogService service;

    public AdminCatalogController(CatalogSpecializationRepository specRepo,
                                  CatalogTherapyMethodRepository methodRepo,
                                  AdminCatalogService service) {
        this.specRepo = specRepo;
        this.methodRepo = methodRepo;
        this.service = service;
    }

    public record CreateItemRequest(
            @NotBlank @Size(max = 64) String code,
            @NotBlank @Size(max = 200) String nameEn,
            @NotBlank @Size(max = 200) String nameRu,
            @NotBlank @Size(max = 200) String nameHy
    ) {}

    // ===== Specializations =====

    @GetMapping("/specializations")
    public List<CatalogSpecialization> listSpecs() {
        return specRepo.findAll().stream()
                .sorted((a, b) -> a.getCode().compareToIgnoreCase(b.getCode()))
                .toList();
    }

    @PostMapping("/specializations")
    public void createSpec(Authentication auth, @Valid @RequestBody CreateItemRequest req) {
        Long adminUserId = (Long) auth.getPrincipal();
        service.createSpecialization(adminUserId, req.code(), req.nameEn(), req.nameRu(), req.nameHy());
    }

    @PostMapping("/specializations/{code}/enable")
    public void enableSpec(Authentication auth, @PathVariable("code") String code) {
        Long adminUserId = (Long) auth.getPrincipal();
        service.setSpecializationActive(adminUserId, code, true);
    }

    @PostMapping("/specializations/{code}/disable")
    public void disableSpec(Authentication auth, @PathVariable("code") String code) {
        Long adminUserId = (Long) auth.getPrincipal();
        service.setSpecializationActive(adminUserId, code, false);
    }

    // ===== Methods =====

    @GetMapping("/methods")
    public List<CatalogTherapyMethod> listMethods() {
        return methodRepo.findAll().stream()
                .sorted((a, b) -> a.getCode().compareToIgnoreCase(b.getCode()))
                .toList();
    }

    @PostMapping("/methods")
    public void createMethod(Authentication auth, @Valid @RequestBody CreateItemRequest req) {
        Long adminUserId = (Long) auth.getPrincipal();
        service.createMethod(adminUserId, req.code(), req.nameEn(), req.nameRu(), req.nameHy());
    }

    @PostMapping("/methods/{code}/enable")
    public void enableMethod(Authentication auth, @PathVariable("code") String code) {
        Long adminUserId = (Long) auth.getPrincipal();
        service.setMethodActive(adminUserId, code, true);
    }

    @PostMapping("/methods/{code}/disable")
    public void disableMethod(Authentication auth, @PathVariable("code") String code) {
        Long adminUserId = (Long) auth.getPrincipal();
        service.setMethodActive(adminUserId, code, false);
    }
}
