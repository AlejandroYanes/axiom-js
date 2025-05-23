import { Transport } from './transport';
import { LogEvent, LogLevel, LogLevelValue } from '../logger';
import { isBrowser } from '../runtime';
export interface ConsoleTransportConfig {
  prettyPrint?: boolean;
  logLevel?: LogLevel;
}

const levelColors: { [key: string]: any } = {
  info: {
    terminal: '32',
    browser: 'lightgreen',
  },
  debug: {
    terminal: '36',
    browser: 'lightblue',
  },
  warn: {
    terminal: '33',
    browser: 'yellow',
  },
  error: {
    terminal: '31',
    browser: 'red',
  },
};

export class ConsoleTransport implements Transport {
  private config: ConsoleTransportConfig;

  constructor(config?: ConsoleTransportConfig) {
    this.config = { ...config };
  }

  log: Transport['log'] = (logs) => {
    logs.forEach((log) => {
      if (
        LogLevelValue[(log.level as LogLevel) ?? LogLevel.info] >= LogLevelValue[this.config.logLevel ?? LogLevel.info]
      ) {
        this.prettyPrint(log);
      }
    });
  };

  private isStandardLogEvent(log: any): log is LogEvent {
    return typeof log === 'object' && log !== null && 'level' in log && 'message' in log && 'fields' in log;
  }

  prettyPrint(ev: LogEvent) {
    const hasFields = ev.fields && Object.keys(ev.fields).length > 0;

    // check whether pretty print is disabled
    if (!this.config.prettyPrint) {
      if (!this.isStandardLogEvent(ev)) {
        console.log(ev);
        return;
      }
      let msg = `${ev.level} - ${ev.message}`;
      if (hasFields) {
        msg += ' ' + JSON.stringify(ev.fields);
      }
      console.log(msg);
      return;
    }

    if (!this.isStandardLogEvent(ev)) {
      if (isBrowser) {
        console.log('%c%s', `color: ${levelColors[LogLevel.info].browser};`, ev);
      } else {
        console.log(`\x1b[${levelColors[LogLevel.info].terminal}m%s\x1b[0m`, ev);
      }
      return;
    }
    // print indented message, instead of [object]
    // We use the %o modifier instead of JSON.stringify because stringify will print the
    // object as normal text, it loses all the functionality the browser gives for viewing
    // objects in the console, such as expanding and collapsing the object.
    let msgString = '';
    let args: any[] = [ev.level, ev.message];

    if (isBrowser) {
      msgString = '%c%s - %s';
      args = [`color: ${levelColors[ev.level].browser};`, ...args];
    } else {
      msgString = `\x1b[${levelColors[ev.level].terminal}m%s\x1b[0m - %s`;
    }
    // we check if the fields object is not empty, otherwise its printed as <empty string>
    // or just "".
    if (hasFields) {
      msgString += ' %o';
      args.push(ev.fields);
    }

    console.log.apply(console, [msgString, ...args]);
  }

  flush() {
    return;
  }
}
