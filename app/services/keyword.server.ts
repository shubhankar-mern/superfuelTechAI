import { Keyword } from '../models/keywordSchema';
import type { Keyword as KeywordType } from '../types/ad';

export async function createKeyword(data: Omit<KeywordType, 'id'>): Promise<KeywordType> {
  const keyword = await Keyword.create(data);
  return {
    id: keyword.id,
    campaignId: keyword.campaignId,
    text: keyword.text,
    bid: keyword.bid,
    match_type: keyword.match_type,
    state: keyword.state
  };
}

export async function getKeywordsByCampaignId(campaignId: number): Promise<KeywordType[]> {
  const keywords = await Keyword.find({ campaignId }).sort({ id: 1 });
  return keywords.map(k => ({
    id: k.id,
    campaignId: k.campaignId,
    text: k.text,
    bid: k.bid,
    match_type: k.match_type,
    state: k.state
  }));
}

export async function deleteKeyword(id: number): Promise<void> {
  await Keyword.findOneAndDelete({ id });
}