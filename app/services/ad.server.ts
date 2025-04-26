import { Ad } from '../models/adSchema';
import type { Ad as AdType } from '../types/ad';

export async function getAllAds(): Promise<AdType[]> {
  const ads = await Ad.find().sort({ id: 1 });
  return ads.map((ad: AdType) => ({
    id: ad.id,
    name: ad.name,
    daily_budget: ad.daily_budget
  }));
}

export async function createAd({ name, daily_budget }: { name: string; daily_budget: number }): Promise<AdType> {
  const ad = await Ad.create({ name, daily_budget });
  return {
    id: ad.id,
    name: ad.name,
    daily_budget: ad.daily_budget
  };
}

export async function updateAd(id: number, data: Partial<AdType>): Promise<AdType> {
  const ad = await Ad.findOneAndUpdate({ id }, data, { new: true });
  if (!ad) throw new Error('Ad not found');
  return {
    id: ad.id,
    name: ad.name,
    daily_budget: ad.daily_budget
  };
}

export async function deleteAd(id: number): Promise<void> {
  await Ad.findOneAndDelete({ id });
}

export async function getAdById(id: number): Promise<AdType> {
  const ad = await Ad.findOne({ id });
  if (!ad) throw new Error('Ad not found');
  return {
    id: ad.id,
    name: ad.name,
    daily_budget: ad.daily_budget
  };
}