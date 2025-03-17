import type { Formatter, FrameworkIdentifier, LogEvent } from '@axiomhq/logging';
import { Version } from './lib/runtime';

export const frameworkIdentifier = {
  name: 'next-axiom-version',
  version: Version ?? 'unknown',
} satisfies FrameworkIdentifier;

export const frameworkIdentifierFormatter: Formatter<LogEvent, LogEvent> = (logEvent) => {
  return {
    ...logEvent,
    '@app': {
      [frameworkIdentifier.name]: frameworkIdentifier.version,
    },
  };
};
