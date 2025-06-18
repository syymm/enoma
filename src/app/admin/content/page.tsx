'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Image from 'next/image';

interface Gallery {
  id: number;
  title: string;
  price: string;
  thumbnail: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Comic {
  id: string;
  title: string;
  price: string;
  thumbnail: string;
  description?: string;
  tags: string[];
  episode?: number;
  isPublic: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface ContentData {
  galleries: Gallery[];
  comics: Comic[];
  pagination: {
    page: number;
    limit: number;
    totalGalleries: number;
    totalComics: number;
    totalPagesGalleries: number;
    totalPagesComics: number;
  };
}

export default function AdminContent() {
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'gallery' | 'comic'>('all');
  const [editingItem, setEditingItem] = useState<{ type: string; id: string | number; data: Gallery | Comic } | null>(null);

  const fetchContentCallback = useCallback(fetchContent, [filter]);

  useEffect(() => {
    fetchContentCallback();
  }, [fetchContentCallback]);

  const fetchContent = async () => {
    try {
      const queryParam = filter !== 'all' ? `?type=${filter}` : '';
      const response = await fetch(`/api/admin/content${queryParam}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const contentData = await response.json();
        setData(contentData);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: string, id: string | number, item: Gallery | Comic) => {
    setEditingItem({ type, id, data: { ...item } });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/content/${editingItem.type}/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem.data),
        credentials: 'include',
      });

      if (response.ok) {
        setEditingItem(null);
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleDelete = async (type: string, id: string | number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/content/${type}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Content</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('gallery')}
              className={`px-4 py-2 rounded-md ${filter === 'gallery' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Galleries
            </button>
            <button
              onClick={() => setFilter('comic')}
              className={`px-4 py-2 rounded-md ${filter === 'comic' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Comics
            </button>
          </div>
        </div>

        {data && (
          <div className="space-y-8">
            {/* Galleries */}
            {(filter === 'all' || filter === 'gallery') && data.galleries.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Galleries ({data.galleries.length})</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.galleries.map((gallery) => (
                        <tr key={gallery.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Image
                              src={gallery.thumbnail}
                              alt={gallery.title}
                              width={64}
                              height={64}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                            <div className="text-sm text-gray-500">{gallery.tags.join(', ')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {gallery.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              gallery.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {gallery.isPublic ? 'Public' : 'Private'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit('gallery', gallery.id, gallery)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('gallery', gallery.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Comics */}
            {(filter === 'all' || filter === 'comic') && data.comics.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comics ({data.comics.length})</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Episode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.comics.map((comic) => (
                        <tr key={comic.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Image
                              src={comic.thumbnail}
                              alt={comic.title}
                              width={64}
                              height={64}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{comic.title}</div>
                            <div className="text-sm text-gray-500">{comic.tags.join(', ')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {comic.episode || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {comic.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              comic.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {comic.isPublic ? 'Public' : 'Private'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit('comic', comic.id, comic)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('comic', comic.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit {editingItem.type}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editingItem.data.title}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, title: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    value={editingItem.data.price}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, price: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {editingItem.type === 'comic' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Episode</label>
                    <input
                      type="number"
                      value={editingItem.data.episode || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, episode: parseInt(e.target.value) || null }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem.data.isPublic}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, isPublic: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Public</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}