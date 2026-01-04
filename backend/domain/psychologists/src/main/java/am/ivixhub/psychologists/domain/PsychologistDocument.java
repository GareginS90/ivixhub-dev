package am.ivixhub.psychologists.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "psychologist_documents",
        indexes = {
                @Index(name = "idx_pd_psychologist_id", columnList = "psychologist_id")
        })
public class PsychologistDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="psychologist_id", nullable = false)
    private Long psychologistId;

    @Enumerated(EnumType.STRING)
    @Column(name="doc_type", nullable = false, length = 50)
    private PsychologistDocumentType docType;

    @Column(name="file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name="file_url", nullable = false, length = 1024)
    private String fileUrl;

    @Column(name="uploaded_at", nullable = false)
    private OffsetDateTime uploadedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public Long getPsychologistId() { return psychologistId; }
    public void setPsychologistId(Long psychologistId) { this.psychologistId = psychologistId; }
    public PsychologistDocumentType getDocType() { return docType; }
    public void setDocType(PsychologistDocumentType docType) { this.docType = docType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public OffsetDateTime getUploadedAt() { return uploadedAt; }
}
