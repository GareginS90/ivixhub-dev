package am.ivixhub.api.psychologists.documents;

import am.ivixhub.api.storage.DocumentStorage;
import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistDocument;
import am.ivixhub.psychologists.domain.PsychologistDocumentType;
import am.ivixhub.psychologists.repository.PsychologistDocumentRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/psychologists/documents")
public class PsychologistDocumentUploadController {

    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final PsychologistDocumentRepository documentRepository;
    private final DocumentStorage storage;

    public PsychologistDocumentUploadController(UserRepository userRepository,
                                                PsychologistRepository psychologistRepository,
                                                PsychologistDocumentRepository documentRepository,
                                                DocumentStorage storage) {
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.documentRepository = documentRepository;
        this.storage = storage;
    }

    @PostMapping("/upload")
    public UploadedDocumentResponse upload(Authentication auth,
                                           @RequestParam("docType") PsychologistDocumentType docType,
                                           @RequestParam("file") MultipartFile file) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Empty file");
        }

        String subdir = "psychologist-docs/" + psychologist.getId();

        DocumentStorage.StoredDocument stored = storage.store(
                subdir,
                file.getOriginalFilename(),
                safeInputStream(file)
        );

        PsychologistDocument doc = new PsychologistDocument();
        doc.setPsychologistId(psychologist.getId());
        doc.setDocType(docType);
        doc.setFileName(stored.fileName());
        doc.setFileUrl(stored.fileUrl());

        PsychologistDocument saved = documentRepository.save(doc);

        return new UploadedDocumentResponse(
                saved.getId(),
                saved.getPsychologistId(),
                saved.getDocType(),
                saved.getFileName(),
                saved.getFileUrl(),
                saved.getUploadedAt()
        );
    }

    @GetMapping
    public List<UploadedDocumentResponse> myDocs(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Psychologist psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        return documentRepository.findAllByPsychologistId(psychologist.getId())
                .stream()
                .map(d -> new UploadedDocumentResponse(
                        d.getId(),
                        d.getPsychologistId(),
                        d.getDocType(),
                        d.getFileName(),
                        d.getFileUrl(),
                        d.getUploadedAt()
                ))
                .toList();
    }

    private java.io.InputStream safeInputStream(MultipartFile file) {
        try {
            return file.getInputStream();
        } catch (Exception e) {
            throw new IllegalArgumentException("Cannot read file");
        }
    }
}
