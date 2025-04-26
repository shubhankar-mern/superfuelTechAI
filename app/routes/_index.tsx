/* eslint-disable jsx-a11y/label-has-associated-control */
"use client"

import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { getAllAds, createAd, updateAd, deleteAd } from '../services/ad.server';
import type { Ad } from '../types/ad';

export default function Index() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [daily_budget, setDailyBudget] = useState<number>(0);
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      const ads: Ad[] = await getAllAds();
      setAds(ads);
    }
    fetchAds();
  }, []);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAd) {
      const updatedAd = await updateAd(editingAd.id, { name, daily_budget });
      setAds(ads.map(ad => ad.id === editingAd.id ? updatedAd : ad));
    } else {
      const ad: Ad = await createAd({ name, daily_budget });
      setAds([...ads, ad]);
    }
    setOpenModal(false);
    setEditingAd(null);
    setName("");
    setDailyBudget(0);
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setName(ad.name);
    setDailyBudget(ad.daily_budget);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    await deleteAd(id);
    setAds(ads.filter(ad => ad.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Campaign
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Daily Budget</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td className="border p-2">
                <Link to={`/campaigns/${ad.id}`} className="text-blue-500 hover:underline">
                  {ad.name}
                </Link>
              </td>
              <td className="border p-2">${ad.daily_budget}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(ad)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingAd ? 'Edit Campaign' : 'Add Campaign'}
            </h2>
            <form onSubmit={handleAddCampaign}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Daily Budget</label>
                <input
                  type="number"
                  step="0.01"
                  value={daily_budget}
                  onChange={(e) => setDailyBudget(parseFloat(e.target.value))}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    setEditingAd(null);
                    setName("");
                    setDailyBudget(0);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingAd ? 'Update Campaign' : 'Add Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}