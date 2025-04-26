/* eslint-disable jsx-a11y/label-has-associated-control */
import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { useState } from 'react';
import { getAdById } from '../services/ad.server';
import { getKeywordsByCampaignId, createKeyword, deleteKeyword } from '../services/keyword.server';
import type { Ad, Keyword } from '../types/ad';

export const loader: LoaderFunction = async ({ params }) => {
  const campaignId = Number(params.id);
  const [campaign, keywords] = await Promise.all([
    getAdById(campaignId),
    getKeywordsByCampaignId(campaignId)
  ]);
  return json({ campaign, keywords });
};

export default function CampaignDetails() {
  const { campaign, keywords } = useLoaderData<{ campaign: Ad; keywords: Keyword[] }>();
  const [openModal, setOpenModal] = useState(false);
  const [keywordForm, setKeywordForm] = useState({
    text: '',
    bid: 0,
    match_type: 'exact' as const,
    state: 'enabled' as const
  });

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    await createKeyword({
      ...keywordForm,
      campaignId: campaign.id
    });
    setOpenModal(false);
    // Reload the page to refresh data
    window.location.reload();
  };

  const handleDeleteKeyword = async (keywordId: number) => {
    await deleteKeyword(keywordId);
    // Reload the page to refresh data
    window.location.reload();
  };

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 block">
        ← Back to all campaigns
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">Campaign: {campaign.name}</h1>
      <p className="mb-4">Daily Budget: ${campaign.daily_budget}</p>

      <div className="mb-4">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Keyword
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Text</th>
            <th className="border p-2">Bid</th>
            <th className="border p-2">Match Type</th>
            <th className="border p-2">State</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((keyword) => (
            <tr key={keyword.id}>
              <td className="border p-2">{keyword.text}</td>
              <td className="border p-2">${keyword.bid}</td>
              <td className="border p-2">{keyword.match_type}</td>
              <td className="border p-2">{keyword.state}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteKeyword(keyword.id)}
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
            <h2 className="text-xl font-bold mb-4">Add Keyword</h2>
            <form onSubmit={handleAddKeyword}>
              <div className="mb-4">
                <label className="block mb-2">Text</label>
                <input
                  type="text"
                  value={keywordForm.text}
                  onChange={(e) => setKeywordForm({ ...keywordForm, text: e.target.value })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Bid</label>
                <input
                  type="number"
                  step="0.01"
                  value={keywordForm.bid}
                  onChange={(e) => setKeywordForm({ ...keywordForm, bid: parseFloat(e.target.value) })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Match Type</label>
                <select
                  value={keywordForm.match_type}
                  onChange={(e) => setKeywordForm({ ...keywordForm, match_type: e.target.value as 'exact' | 'phrase' | 'broad' })}
                  className="border p-2 w-full"
                >
                  <option value="exact">Exact</option>
                  <option value="phrase">Phrase</option>
                  <option value="broad">Broad</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">State</label>
                <select
                  value={keywordForm.state}
                  onChange={(e) => setKeywordForm({ ...keywordForm, state: e.target.value })}
                  className="border p-2 w-full"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}