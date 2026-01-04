package am.ivixhub.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
        scanBasePackages = "am.ivixhub",
        exclude = {UserDetailsServiceAutoConfiguration.class}
)
@EntityScan(basePackages = "am.ivixhub")
@EnableJpaRepositories(basePackages = "am.ivixhub")
@EnableScheduling
public class IviXHubApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(IviXHubApiApplication.class, args);
    }
}

