package io.jenkins.plugins.analysis.metrics;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import edu.hm.hafner.util.SerializableTest;

import static org.assertj.core.api.AssertionsForClassTypes.*;

/**
 * Tests the class {@link MetricsActor}.
 *
 * @author Andreas Pabst
 */
class MetricsActorTest extends SerializableTest<MetricsActor> {
    @Override
    protected MetricsActor createSerializable() {
        return createScanner("**/*");
    }

    private MetricsActor createScanner(final String includePattern) {
        return new MetricsActor(includePattern);
    }

    @Test
    void shouldParseInnerClasses() {
        Path path = getResourceAsFile("Test.java");
        MetricsMeasurements measurements = createScanner("Test.java")
                .invoke(path.getParent().toFile(), null);

        assertThat(measurements.size()).isEqualTo(9);
        double cfo = measurements.get(0).getMetrics().get("CLASS_FAN_OUT");
        assertThat(cfo).isGreaterThan(1);

        List<Double> cfos = measurements.stream()
                .map(MetricsMeasurement::getMetrics)
                .map(m -> m.get("CLASS_FAN_OUT"))
                .collect(Collectors.toList());

        System.out.println(cfos);
    }
}