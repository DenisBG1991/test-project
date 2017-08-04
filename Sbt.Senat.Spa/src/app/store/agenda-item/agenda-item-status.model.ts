/**
 * Статусы вопроса в контексте заседания (в повестке).
 */
export enum AgendaItemStatus {
    WaitingForConsideration = <any>'WaitingForConsideration', // ожидает рассмотрения
    OnConsideration = <any>'OnConsideration', // на рассмотрении
    OnModification = <any>'OnModification', // на доработке
    OnVoting = <any>'OnVoting', // на голосовании
    Resolved = <any>'Resolved', // закрыт
    Removed = <any>'Removed' // снят
}
