
package io.jenkins.plugins.analysis.core.steps;

import java.io.IOException;

import edu.umd.cs.findbugs.annotations.NonNull;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;
import org.jenkinsci.Symbol;
import hudson.Extension;
import hudson.FilePath;
import hudson.Launcher;
import hudson.init.InitMilestone;
import hudson.init.Initializer;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.model.BuildListener;
import hudson.model.Run;
import hudson.model.TaskListener;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Publisher;
import hudson.tasks.Recorder;
import jenkins.tasks.SimpleBuildStep;

import io.jenkins.plugins.analysis.core.model.ResultAction;
import io.jenkins.plugins.analysis.core.util.LogHandler;
import io.jenkins.plugins.analysis.core.util.ModelValidation;
import io.jenkins.plugins.analysis.core.util.RunResultHandler;
import io.jenkins.plugins.analysis.core.util.StageResultHandler;
import io.jenkins.plugins.analysis.metrics.MetricsAction;
import io.jenkins.plugins.analysis.metrics.MetricsActor;
import io.jenkins.plugins.analysis.metrics.MetricsMeasurements;

/**
 * Report metrics.
 *
 * @author Andreas Pabst
 */
@SuppressWarnings({"PMD.ExcessivePublicCount", "PMD.ExcessiveClassLength", "PMD.ExcessiveImports", "PMD.TooManyFields", "PMD.DataClass", "ClassDataAbstractionCoupling", "ClassFanOutComplexity"})
public class MetricsRecorder extends Recorder implements SimpleBuildStep {

    private String filePattern;

    /**
     * Creates a new instance of {@link MetricsRecorder}.
     */
    @DataBoundConstructor
    public MetricsRecorder() {
        super();

        // empty constructor required for Stapler
    }

    @Override
    public BuildStepMonitor getRequiredMonitorService() {
        return BuildStepMonitor.NONE;
    }

    @Override
    public Descriptor getDescriptor() {
        return (Descriptor) super.getDescriptor();
    }

    @DataBoundSetter
    public void setFilePattern(final String filePattern) {
        this.filePattern = filePattern;
    }

    public String getFilePattern() {
        return filePattern;
    }

    @Override
    public boolean perform(final AbstractBuild<?, ?> build, final Launcher launcher, final BuildListener listener)
            throws InterruptedException, IOException {
        FilePath workspace = build.getWorkspace();
        if (workspace == null) {
            throw new IOException("No workspace found for " + build);
        }

        perform(build, workspace, listener, new RunResultHandler(build));

        return true;
    }

    void perform(final Run<?, ?> run, final FilePath workspace, final TaskListener listener,
            final StageResultHandler statusHandler) throws InterruptedException, IOException {

        LogHandler logHandler = new LogHandler(listener, "Metrics");
        logHandler.log("Start collecting metrics");

        MetricsMeasurements metricsMeasurements = workspace.act(new MetricsActor(filePattern));
        run.addAction(new MetricsAction(metricsMeasurements));

        logHandler.log("Finished collecting metrics");
    }

    @Override
    public void perform(final Run<?, ?> run, final FilePath workspace,
            final Launcher launcher,
            final TaskListener taskListener) throws InterruptedException, IOException {

        perform(run, workspace, taskListener, new RunResultHandler(run));
    }

    /**
     * Descriptor for this step: defines the context and the UI elements.
     */
    @Extension
    @Symbol("reportMetrics")
    @SuppressWarnings("unused") // most methods are used by the corresponding jelly view
    public static class Descriptor extends BuildStepDescriptor<Publisher> {
        /** Retain backward compatibility. */
        @Initializer(before = InitMilestone.PLUGINS_STARTED)
        public static void addAliases() {
            Run.XSTREAM2.addCompatibilityAlias("io.jenkins.plugins.analysis.core.views.ResultAction",
                    ResultAction.class);
        }

        private final ModelValidation model = new ModelValidation();

        @NonNull
        @Override
        public String getDisplayName() {
            return "Metrics Recorder";
        }

        @Override
        public boolean isApplicable(final Class<? extends AbstractProject> jobType) {
            return true;
        }
    }
}
