import { Global, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EventPublisherPort } from '../../application/ports/out/event-publisher.port'
import { NestEventPublisherAdapter } from './nest-event-publisher.adapter'

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    { provide: EventPublisherPort, useClass: NestEventPublisherAdapter },
  ],
  exports: [EventPublisherPort],
})
export class SharedEventModule {}
