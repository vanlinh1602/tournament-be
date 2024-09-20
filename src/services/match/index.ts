/* eslint-disable class-methods-use-this */
import { Db, ObjectId } from 'mongodb';
import Service from 'services';

type MatchSetUpInfo = {
  banPickStatus: {
    player: string;
    type: 'ban' | 'pick';
    character?: string;
  }[];
  firstPick: number;
  goFirst: number;
};

type Match = {
  _id: string | ObjectId;
  players: [string, string];
  status: 'ban-pick' | 'playing' | 'finished';
  date?: number;
  winner?: string;
  games?: {
    player: string;
    characters: string[];
  }[];
  matchSetup?: MatchSetUpInfo;
};

export class MatchsService extends Service<Match> {
  constructor(db: Db) {
    super(db, 'matchs');
  }

  createMatch = async (match: Match) => {
    const id = new ObjectId().toString();
    const matchId = await this.collection.updateOne({ _id: id }, { $set: match }, { upsert: true });
    if (matchId.modifiedCount || matchId.upsertedCount) {
      return id;
    }
    throw new Error('Failed to create match');
  };

  getMatch = async (id: string) => {
    const match = await this.collection.findOne({ _id: id });
    return match;
  };

  updateMatch = async (id: string, match: Partial<Match>) => {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: match },
      { upsert: true, returnDocument: 'after' }
    );
    if (result) {
      return result;
    }
    throw new Error('Failed to update match');
  };
}
