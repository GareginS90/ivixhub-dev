package am.ivixhub.psychologists.repository;

import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.users.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PsychologistRepository extends JpaRepository<Psychologist, Long> {

    Optional<Psychologist> findByUser(User user);

    boolean existsByUser(User user);

    List<Psychologist> findAllByStatus(PsychologistStatus status);

    /**
     * Search VERIFIED psychologists.
     * methods and specializations are stored as lowercase catalog codes.
     */
    @Query("""
        select distinct p from Psychologist p
        left join p.languages l
        left join p.methods m
        left join p.specializations s
        where p.status = :status
          and p.active = true
          and (:language is null or l = :language)
          and (:methodCode is null or m = :methodCode)
          and (:specCode is null or s = :specCode)
    """)
    List<Psychologist> searchVerified(@Param("status") PsychologistStatus status,
                                      @Param("language") PsychologistLanguage language,
                                      @Param("methodCode") String methodCode,
                                      @Param("specCode") String specializationCode);
}

