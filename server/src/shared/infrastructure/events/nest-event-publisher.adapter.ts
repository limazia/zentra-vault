import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventPublisherPort } from '../../application/ports/out/event-publisher.port'

@Injectable()
export class NestEventPublisherAdapter implements EventPublisherPort {
  private readonly eventEmitter: EventEmitter2

  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter
  }

  publish(event: object): void {
    this.eventEmitter.emit(event.constructor.name, event)
  }
}
