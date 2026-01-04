package am.ivixhub.psychologists.repository;

import am.ivixhub.psychologists.domain.PsychologistDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PsychologistDocumentRepository extends JpaRepository<PsychologistDocument, Long> {

    boolean existsByPsychologistIdAndDocType(Long psychologistId, String docType);

    List<PsychologistDocument> findAllByPsychologistId(Long psychologistId);
}

