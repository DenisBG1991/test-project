/**
 * Статусы вопроса в контексте заседания (в повестке).
 */
export enum AgendaItemStatus {
    WaitingForConsideration = <any>'WaitingForConsideration', // ожидает рассмотрения
    OnConsideration = <any>'OnConsideration', // на рассмотрении
    OnModification = <any>'OnModification', // на доработке
    OnVoting = <any>'OnVoting', // на голосовании
    OnFormalization = <any>'OnFormalization', // на оформлении
    Resolved = <any>'Resolved', // закрыт
    Removed = <any>'Removed' // снят
}
