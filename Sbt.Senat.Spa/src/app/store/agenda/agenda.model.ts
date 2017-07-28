import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';

/**
 * Повестка заседания.
 * Повестка обладает собственным набором атрибутов, например, данными о согласовании этой повестки.
 * Сейчас не используется, нужна как архитектурный элемент.
 */
export interface IAgenda {
    meeting: IMeetingRef;
}
