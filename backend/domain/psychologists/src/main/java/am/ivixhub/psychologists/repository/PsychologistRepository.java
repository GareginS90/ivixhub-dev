package am.ivixhub.psychologists.repository;

import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.users.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PsychologistRepository extends JpaRepository<Psychologist, Long> {

    Optional<Psychologist> findByUser(User user);

    @Query("""
        select distinct p
        from Psychologist p
        left join p.languages l
        left join p.methods m
        left join p.specializations s
        where p.active = true
          and p.status = :status
          and (:language is null or l = :language)
          and (:methodCode is null or m = :methodCode)
          and (:specializationCode is null or s = :specializationCode)
        order by p.id desc
    """)
    List<Psychologist> searchVerified(PsychologistStatus status,
                                      PsychologistLanguage language,
                                      String methodCode,
                                      String specializationCode,
                                      Pageable pageable);

    default List<Psychologist> searchVerified(PsychologistStatus status,
                                              PsychologistLanguage language,
                                              String methodCode,
                                              String specializationCode) {
        return searchVerified(
                status,
                language,
                methodCode,
                specializationCode,
                Pageable.unpaged()
        );
    }

    List<Psychologist> findAllByStatus(PsychologistStatus status);
}
