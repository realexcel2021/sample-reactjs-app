// tracing.js
'use strict'
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const exporterOptions = {
  url: "http://otel-opentelemetry-collector.monitoring.svc.cluster.local:4317/v1/traces",
   }

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
   traceExporter,
   instrumentations: [getNodeAutoInstrumentations()],
   resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'qwizfun_frontend'
      })
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
try {
   sdk.start()

   console.log("started tracing.......")

// gracefully shut down the SDK on process exit
   process.on('SIGTERM', () => {
      sdk.shutdown()
   .then(() => console.log('Tracing terminated'))
   .catch((error) => console.log('Error terminating tracing', error))
   .finally(() => process.exit(0));
   });
}
catch {
   console.log("Unable to load tracing.js")
}