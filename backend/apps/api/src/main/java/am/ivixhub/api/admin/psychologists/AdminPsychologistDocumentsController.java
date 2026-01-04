package am.ivixhub.api.admin.psychologists;

import am.ivixhub.psychologists.domain.PsychologistDocument;
import am.ivixhub.psychologists.repository.PsychologistDocumentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/psychologists")
public class AdminPsychologistDocumentsController {

    private final PsychologistDocumentRepository documentRepository;

    public AdminPsychologistDocumentsController(PsychologistDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @GetMapping("/{psychologistId}/documents")
    public List<PsychologistDocument> docs(@PathVariable("psychologistId") Long psychologistId) {
        return documentRepository.findAllByPsychologistId(psychologistId);
    }
}
