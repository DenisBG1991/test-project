import {ApiService} from '@app/services/api/api.service';
import {Injectable} from '@angular/core';
import {IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IVoting, IVotingRef} from '@app/store/voting/voting.model';
import {Observable} from 'rxjs/Observable';
import {Person, Vote, Voting} from '@app/services/api/mapping.types';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {IVote} from '@app/store/vote/vote.model';
import {CustomHttp} from '@app/services/api/http';

@Injectable()
export class VotingService extends ApiService {

    constructor(http: CustomHttp) {
        super(http);
    }

    /**
     * Возвращает все голосования вопроса повестки.
     * @param agendaItem
     */
    getVotings(agendaItem: IAgendaItemRef): Observable<Array<IVoting>> {
        return this.http.get(`api/web/votings?meetingId=${agendaItem.meeting.id}&issueId=${agendaItem.issue.id}`
                + `&size=100`, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                return dto.items.map(x => {
                    const voting = Voting.parse(x);

                    return voting;
                });
            });
    }

    /**
     * Возвращает все голосования вопроса повестки.
     */
    getVoting(voting: IVotingRef): Observable<IVoting> {
        return this.http.get(`api/web/votings/${voting.id}`, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                return Voting.parse(dto);
            });
    }

    /**
     * Создаёт голосование.
     * @param meeting
     * @param materialVersion
     */
    createVoting(meeting: IMeetingRef, materialVersion: IMaterialVersionRef): Observable<IVoting> {
        return this.http.post(`api/web/votings`,
            {
                meeting: {
                    id: meeting.id
                },
                decisionProject: {
                    id: materialVersion.id,
                    version: materialVersion.num
                }
            }, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const voting = Voting.parse(dto);

                return voting;
            });
    }

    /**
     * Возвращает голоса голосоания.
     * @param voting
     */
    getVotes(voting: IVotingRef): Observable<{ votes: Array<IVote>, persons: Array<IPerson> }> {
        return this.http.get(`api/web/votings/${voting.id}/votes`, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const votes: Array<{ self: IVote, persons: Array<IPerson> }> = dto.map(x => {
                    const vote = Vote.parse(x);
                    vote.voting = {
                        id: voting.id
                    };
                    const createdBy = Person.parse(x.createdBy);
                    const owner = Person.parse(x.owner);

                    return {
                        self: vote,
                        persons: [createdBy, owner]
                    };
                });

                return {
                    votes: votes.map(x => x.self),
                    persons: votes.map(x => x.persons).reduce((result, current) => {
                        return result.concat(current);
                    }, [])
                };
            });
    }

    /**
     * Создаёт голос.
     * @param vote
     */
    createVote(vote: IVote): Observable<{ vote: IVote, persons: Array<IPerson> }> {
        return this.http.post(`api/web/votings/${vote.voting.id}/votes`,
            {
                type: vote.type,
                comment: vote.specialOpinion || null,
                owner: vote.owner
            }, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const voteCreated = Vote.parse(dto);
                voteCreated.voting = {
                    id: vote.voting.id
                };
                const createdBy = Person.parse(dto.createdBy);
                const owner = Person.parse(dto.owner);

                return {
                    vote: voteCreated,
                    persons: [createdBy, owner]
                };
            });
    }

    /**
     * Завершение голосования.
     * @param voting
     */
    closeVoting(voting: IVotingRef): Observable<IVoting> {
        return this.http.post(`api/web/votings/${voting.id}/end`,
            null, this.defaultRequestOptions)
            .map(response => {
                const dto = response.json();

                const votingClosed = Voting.parse(dto);

                return votingClosed;
            });
    }
}
