package am.ivixhub.psychologists.repository;

import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistLanguage;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.domain.UserGender;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PsychologistRepository extends JpaRepository<Psychologist, Long> {

    Optional<Psychologist> findByUser(User user);

    @Query("""
        select distinct p
        from Psychologist p
        join p.user u
        left join p.languages l
        left join p.methods m
        left join p.specializations s
        where p.active = true
          and p.status = :status
          and (:language is null or l = :language)
          and (:gender is null or u.gender = :gender)
          and (:methodCode is null or m = :methodCode)
          and (:specializationCode is null or s = :specializationCode)
          and (:birthDateFrom is null or u.birthDate >= :birthDateFrom)
          and (:birthDateTo is null or u.birthDate <= :birthDateTo)
        order by p.id desc
        """)
    List<Psychologist> searchVerified(
            @Param("status") PsychologistStatus status,
            @Param("language") PsychologistLanguage language,
            @Param("gender") UserGender gender,
            @Param("methodCode") String methodCode,
            @Param("specializationCode") String specializationCode,
            @Param("birthDateFrom") LocalDate birthDateFrom,
            @Param("birthDateTo") LocalDate birthDateTo,
            Pageable pageable
    );

    default List<Psychologist> searchVerified(
            PsychologistStatus status,
            PsychologistLanguage language,
            UserGender gender,
            String methodCode,
            String specializationCode,
            LocalDate birthDateFrom,
            LocalDate birthDateTo
    ) {
        return searchVerified(
                status,
                language,
                gender,
                methodCode,
                specializationCode,
                birthDateFrom,
                birthDateTo,
                Pageable.unpaged()
        );
    }

    List<Psychologist> findAllByStatus(PsychologistStatus status);
}
