import { NO_ROOT_ARRAY, Tokenizer } from '@specfocus/pack-focus.json/tasks/tokenizer';
import { Actor, isAction } from '@specfocus/main-focus/actions';
/**
 * Used in middleware
 */
class RequestSink implements UnderlyingSink<Uint8Array> {
  private readonly tokenizer: Tokenizer;
  type?: undefined;

  constructor(public readonly actor: Actor) {
    this.tokenizer = new Tokenizer(new Set([NO_ROOT_ARRAY]));
  }

  abort = (reason?: any): void | PromiseLike<void> => this.actor.abort(reason);

  // close = (): void | PromiseLike<void> => { };
  // start = (controller: WritableStreamDefaultController): any => { };
  write = (chunk: Uint8Array, controller: WritableStreamDefaultController): void | PromiseLike<void> => {
    const tokens = this.tokenizer.tokenize(chunk);
    for (const token of tokens) {
      if (token.type === 'error') {
        controller.error(token);
        break;
      }
      if (!isAction(token.value)) {
        continue;
      }
      this.actor.onAction(token.value);
    }
  };
}

export default RequestSink;
