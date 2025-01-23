import { Logger, AxiomFetchTransport, ConsoleTransport } from '@axiomhq/logging';

export const logger = new Logger({
  transports: [
    new AxiomFetchTransport({
      dataset: process.env.AXIOM_DATASET!,
      token: process.env.AXIOM_TOKEN!,
    }),
    new ConsoleTransport(),
  ],
});
