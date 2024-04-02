
"use strict";

const {
    BasicTracerProvider,
    SimpleSpanProcessor,
} = require("@opentelemetry/tracing");
// Import the JaegerExporter
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const opentelemetry = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

// Create a new instance of JaegerExporter with the options
const exporter = new JaegerExporter({
    serviceName: "Sample-app",
    host: "http://otel-opentelemetry-collector.monitoring.svc.cluster.local:4317", // optional, can be set by OTEL_EXPORTER_JAEGER_AGENT_HOST
    // port: 16686 // optional
});

const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]:
            "Sample-app",
    }),
});
// Add the JaegerExporter to the span processor
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();
const sdk = new opentelemetry.NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk
    .start()
    .then(() => {
        console.log("Tracing initialized");
    })
    .catch((error) => console.log("Error initializing tracing", error));

process.on("SIGTERM", () => {
    sdk
        .shutdown()
        .then(() => console.log("Tracing terminated"))
        .catch((error) => console.log("Error terminating tracing", error))
        .finally(() => process.exit(0));
})
