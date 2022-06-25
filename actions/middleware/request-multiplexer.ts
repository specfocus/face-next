import type { Action, AlertAction } from '@specfocus/main-focus/actions';
import { ALERT } from '@specfocus/main-focus/actions';
import Multiplexer from '@specfocus/main-focus/async/multiplexer';
import { Actor } from '@specfocus/main-focus/actions';

type Abort = AlertAction;
type Heartbeat = AlertAction;
type Timeout = AlertAction;

const abort: Abort = {
  path: [],
  type: ALERT,
  what: 'quit',
  when: Date.now().valueOf(),
  why: 'quit'
};

const heartbeat: Heartbeat = {
  path: [],
  type: ALERT,
  what: 'idle',
  when: Date.now().valueOf(),
  why: 'idle'
};

const timeout: Timeout = {
  path: [],
  type: ALERT,
  what: 'quit',
  when: Date.now().valueOf(),
  why: 'fail'
};

/**
 * Shares actions with consumers and merge reactions
 * | request-sink -> midleware-mutiplexer -> request-source |
 */
class RequestBroker extends Multiplexer<Action, Abort, Heartbeat, Timeout> implements Actor {
  private readonly _consumers: Actor[];

  constructor(actors: Actor[], controller: AbortController) {
    super(
      actors,
      {
        abort: [controller.signal, abort],
        heartbeat: [10, heartbeat],
        timeout: [60, timeout]
      }
    );
    this._consumers = actors;
  }
  
  onAction = async (action: Action): Promise<void> => {
    for (const consumer of this._consumers) {
      await Promise.resolve(consumer.onAction(action));
    }
  }

  path: string[];

  public readonly abort = async (reason?: any): Promise<void> => {
    for (const consumer of this._consumers) {
      await Promise.resolve(consumer.abort());
    }
  };

  public readonly consume = async (...actions: Action[]): Promise<void> => {
    for (const action of actions) {
      await this.onAction(action);
    }
  };
}

export default RequestBroker;
