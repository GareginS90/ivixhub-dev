package am.ivixhub.psychologists.repository;

import am.ivixhub.psychologists.domain.PsychologistDocument;
import am.ivixhub.psychologists.domain.PsychologistDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PsychologistDocumentRepository extends JpaRepository<PsychologistDocument, Long> {

    boolean existsByPsychologistIdAndDocType(Long psychologistId, PsychologistDocumentType docType);

    List<PsychologistDocument> findAllByPsychologistId(Long psychologistId);

    Optional<PsychologistDocument> findTopByPsychologistIdAndDocTypeOrderByUploadedAtDesc(
            Long psychologistId,
            PsychologistDocumentType docType
    );
}
