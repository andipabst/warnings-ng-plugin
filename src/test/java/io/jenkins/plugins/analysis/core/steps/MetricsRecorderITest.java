package io.jenkins.plugins.analysis.core.steps;

import org.junit.Test;

import com.gargoylesoftware.htmlunit.html.HtmlPage;

import org.jenkinsci.plugins.workflow.job.WorkflowJob;
import hudson.model.Run;

import io.jenkins.plugins.analysis.core.testutil.IntegrationTestWithJenkinsPerTest;

import static org.assertj.core.api.Assertions.*;

public class MetricsRecorderITest extends IntegrationTestWithJenkinsPerTest {

    @Test
    public void shouldRecordMetrics() throws Exception {
        WorkflowJob pipeline = createPipeline();

        createFileInWorkspace(pipeline, "Test.java", "package hello;\n"
                + "public class Test {\n"
                + "  public Test() {}\n"
                + "  public void foo() {\n"
                + "    try {\n"
                + "      System.out.println(\"test\");\n"
                + "    } catch (Exception e) {\n"
                + "      // same here\n"
                + "    }\n"
                + "  }\n"
                + "}\n");

        createFileInWorkspace(pipeline, "HelloWorld.java", "package hello;\n"
                + "public class HelloWorld {\n"
                + "  public HelloWorld() {}\n"
                + "  public void foo() {\n"
                + "    try {\n"
                + "      System.out.println(\"test\");\n"
                + "    } catch (Exception e) {\n"
                + "      // same here\n"
                + "    }\n"
                + "  }\n"
                + "}\n");

        pipeline.setDefinition(asStage("echo '[javac] Test.java:1: warning: Test Warning for Jenkins'",
                "echo '[javac] Test.java:2: warning: Another warning in a imaginary line'",
                "echo '[javadoc] Test.java:1: warning - @parma is an unknown tag.'",
                "recordIssues tools: [java(), javaDoc()]",
                "step([$class: 'MetricsRecorder'])"));

        Run<?, ?> run = buildSuccessfully(pipeline);

        //MetricsDetail metricsDetail = new MetricsDetail(run);

        //MetricsDetailAssert.assertThat(metricsDetail).hasActions("Java Warnings,JavaDoc Warnings");

        HtmlPage metricsActionPage = getWebPage(JavaScriptSupport.JS_DISABLED, run, "metrics-action");

        assertThat(run.getBuildStatusSummary().message).isNotEmpty();
    }
}
