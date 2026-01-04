package am.ivixhub.api.catalog;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/catalog")
public class PublicCatalogController {

    private final CatalogSpecializationRepository specRepo;
    private final CatalogTherapyMethodRepository methodRepo;

    public PublicCatalogController(CatalogSpecializationRepository specRepo,
                                   CatalogTherapyMethodRepository methodRepo) {
        this.specRepo = specRepo;
        this.methodRepo = methodRepo;
    }

    public record CatalogItem(String code, String label) {}

    @GetMapping("/specializations")
    public List<CatalogItem> specializations(@RequestParam(value = "lang", required = false) String lang) {
        String l = (lang == null || lang.isBlank()) ? "hy" : lang.trim().toLowerCase();

        return specRepo.findAllByActiveTrueOrderByCodeAsc()
                .stream()
                .map(s -> new CatalogItem(s.getCode(), labelSpec(s, l)))
                .toList();
    }

    @GetMapping("/methods")
    public List<CatalogItem> methods(@RequestParam(value = "lang", required = false) String lang) {
        String l = (lang == null || lang.isBlank()) ? "hy" : lang.trim().toLowerCase();

        return methodRepo.findAllByActiveTrueOrderByCodeAsc()
                .stream()
                .map(m -> new CatalogItem(m.getCode(), labelMethod(m, l)))
                .toList();
    }

    private String labelSpec(CatalogSpecialization s, String lang) {
        return switch (lang) {
            case "ru" -> s.getNameRu();
            case "en" -> s.getNameEn();
            default -> s.getNameHy();
        };
    }

    private String labelMethod(CatalogTherapyMethod m, String lang) {
        return switch (lang) {
            case "ru" -> m.getNameRu();
            case "en" -> m.getNameEn();
            default -> m.getNameHy();
        };
    }
}

