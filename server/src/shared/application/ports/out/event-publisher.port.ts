export abstract class EventPublisherPort {
  abstract publish(event: object): void
}
