import { ObjectId } from "mongoose";
import { Keywords } from "./keyword";
export interface Ad {
    id: number;
    name: string;
    daily_budget: number;
    keywords?: Keyword[];
  }
  
  export interface Keyword {
    id: number;
    campaignId: number;
    text: string;
    bid: number;
    match_type: 'exact' | 'phrase' | 'broad';
    state: 'enabled' | 'disabled';
  }