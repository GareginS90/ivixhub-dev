package am.ivixhub.api.video.providers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VideoProviderFactory {

    private final String selectedProvider;
    private final List<VideoProvider> providers;

    public VideoProviderFactory(@Value("${ivixhub.video.provider:MOCK_VIDEO}") String selectedProvider,
                                List<VideoProvider> providers) {
        this.selectedProvider = selectedProvider;
        this.providers = providers;
    }

    public VideoProvider current() {
        String want = selectedProvider.trim().toUpperCase();
        return providers.stream()
                .filter(p -> p.providerName().trim().toUpperCase().equals(want))
                .findFirst()
                .orElseGet(() -> providers.stream()
                        .filter(p -> p.providerName().equalsIgnoreCase("MOCK_VIDEO"))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("No MOCK_VIDEO provider found")));
    }
}
