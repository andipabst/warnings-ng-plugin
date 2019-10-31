package io.jenkins.plugins.analysis.metrics;

import org.junit.jupiter.api.Test;

import io.jenkins.plugins.analysis.metrics.MetricsDetail;

import static org.assertj.core.api.Assertions.*;

class MetricsDetailTest {

    @Test
    void shouldReturnQuotedCSV() {
        MetricsDetail metricsDetail = new MetricsDetail(null, null);

        String result = metricsDetail.toCSV("hello", "world", "with,some,commas");

        assertThat(result).isEqualTo("\"hello\",\"world\",\"with,some,commas\"");
    }
}
