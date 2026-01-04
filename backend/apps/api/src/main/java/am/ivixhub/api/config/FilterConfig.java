package am.ivixhub.api.config;

import am.ivixhub.api.ratelimit.RateLimitFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    /**
     * Явно регистрируем RateLimitFilter как servlet filter.
     * Важное:
     * - order = 1, чтобы отрабатывал очень рано
     * - urlPatterns = "/*" чтобы покрыть все endpoints
     */
    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilterRegistration(RateLimitFilter filter) {
        FilterRegistrationBean<RateLimitFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(filter);
        reg.addUrlPatterns("/*");
        reg.setOrder(1);
        reg.setName("rateLimitFilter");
        return reg;
    }
}
