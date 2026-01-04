package am.ivixhub.api.catalog;

import jakarta.persistence.*;

@Entity
@Table(name = "catalog_therapy_methods")
public class CatalogTherapyMethod {

    @Id
    @Column(length = 64)
    private String code;

    @Column(name = "name_en", nullable = false, length = 200)
    private String nameEn;

    @Column(name = "name_ru", nullable = false, length = 200)
    private String nameRu;

    @Column(name = "name_hy", nullable = false, length = 200)
    private String nameHy;

    @Column(nullable = false)
    private boolean active = true;

    public String getCode() { return code; }
    public String getNameEn() { return nameEn; }
    public String getNameRu() { return nameRu; }
    public String getNameHy() { return nameHy; }
    public boolean isActive() { return active; }
}
