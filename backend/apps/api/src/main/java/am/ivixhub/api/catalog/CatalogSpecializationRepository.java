package am.ivixhub.api.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CatalogSpecializationRepository extends JpaRepository<CatalogSpecialization, String> {

    List<CatalogSpecialization> findAllByActiveTrueOrderByCodeAsc();

    @Query("""
        select c.code from CatalogSpecialization c
        where c.active = true and c.code in :codes
    """)
    List<String> findActiveCodes(@Param("codes") List<String> codes);

    @Modifying
    @Transactional
    @Query(value = "update catalog_specializations set active = :active where code = :code", nativeQuery = true)
    int setActive(@Param("code") String code, @Param("active") boolean active);

    @Modifying
    @Transactional
    @Query(value = """
        insert into catalog_specializations(code, name_en, name_ru, name_hy, active)
        values (:code, :nameEn, :nameRu, :nameHy, true)
        """, nativeQuery = true)
    int insert(@Param("code") String code,
               @Param("nameEn") String nameEn,
               @Param("nameRu") String nameRu,
               @Param("nameHy") String nameHy);
}

