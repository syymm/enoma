'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface GalleryItem {
  id: number;
  title: string;
  thumbnail: string;
  imageUrls: string[];
  color: string;
  price: string;
  likesCount: number;
  description?: string;
  tags?: string[];
  createdAt: string;
}

interface ComicItem {
  id: string;
  title: string;
  thumbnail: string;
  imageUrls: string[];
  color: string;
  price: string;
  likesCount: number;
  episode?: number;
  description?: string;
  tags?: string[];
  createdAt: string;
}

export default function AdminContentPage() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [comics, setComics] = useState<ComicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'comic'>('gallery');
  const [expandedGalleries, setExpandedGalleries] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [galleriesResponse, comicsResponse] = await Promise.all([
        fetch('/api/gallery', { credentials: 'include' }),
        fetch('/api/comic', { credentials: 'include' })
      ]);

      if (galleriesResponse.ok) {
        const galleriesData = await galleriesResponse.json();
        setGalleries(galleriesData.galleries || []);
      }

      if (comicsResponse.ok) {
        const comicsData = await comicsResponse.json();
        setComics(comicsData.comics || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage('コンテンツの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteGallery = async (id: number) => {
    if (!confirm('このギャラリーアイテムを削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setGalleries(galleries.filter(item => item.id !== id));
        setMessage('ギャラリーアイテムを削除しました');
      } else {
        setMessage('削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      setMessage('削除中にエラーが発生しました');
    }
  };

  const deleteGalleryImage = async (galleryId: number, imageIndex: number) => {
    if (!confirm('この画像を削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${galleryId}/images/${imageIndex}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Update the gallery in the local state
        setGalleries(galleries.map(gallery => 
          gallery.id === galleryId 
            ? { ...gallery, imageUrls: data.gallery.imageUrls, thumbnail: data.gallery.thumbnail }
            : gallery
        ));
        setMessage('画像を削除しました');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || '削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage('削除中にエラーが発生しました');
    }
  };

  const setGalleryThumbnail = async (galleryId: number, imageIndex: number) => {
    if (!confirm('この画像を封面として設定しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${galleryId}/thumbnail`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageIndex }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the gallery in the local state
        setGalleries(galleries.map(gallery => 
          gallery.id === galleryId 
            ? { ...gallery, thumbnail: data.gallery.thumbnail }
            : gallery
        ));
        setMessage('封面を設定しました');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || '封面の設定に失敗しました');
      }
    } catch (error) {
      console.error('Error setting thumbnail:', error);
      setMessage('封面設定中にエラーが発生しました');
    }
  };

  const deleteComic = async (id: string) => {
    if (!confirm('このコミックアイテムを削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/comic/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setComics(comics.filter(item => item.id !== id));
        setMessage('コミックアイテムを削除しました');
      } else {
        setMessage('削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting comic:', error);
      setMessage('削除中にエラーが発生しました');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const toggleGalleryExpansion = (galleryId: number) => {
    const newExpanded = new Set(expandedGalleries);
    if (newExpanded.has(galleryId)) {
      newExpanded.delete(galleryId);
    } else {
      newExpanded.add(galleryId);
    }
    setExpandedGalleries(newExpanded);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Content</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('失敗') || message.includes('エラー') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* タブ */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'gallery'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ギャラリー ({galleries.length})
              </button>
              <button
                onClick={() => setActiveTab('comic')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'comic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                コミック ({comics.length})
              </button>
            </nav>
          </div>
        </div>

        {/* ギャラリー一覧 */}
        {activeTab === 'gallery' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {galleries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">ギャラリーアイテムがありません</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {galleries.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          価格: {item.price} | いいね: {item.likesCount} | 
                          画像数: {item.imageUrls?.length || 1} | 
                          作成日: {formatDate(item.createdAt)}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {item.description}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.imageUrls && item.imageUrls.length > 1 && (
                          <button
                            onClick={() => toggleGalleryExpansion(item.id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            {expandedGalleries.has(item.id) ? '画像を隠す' : '画像を表示'}
                          </button>
                        )}
                        <a
                          href={`/gallery/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          表示
                        </a>
                        <button
                          onClick={() => deleteGallery(item.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    
                    {/* 展开的图片网格 */}
                    {expandedGalleries.has(item.id) && item.imageUrls && item.imageUrls.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">画像一覧</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                          {item.imageUrls.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`${item.title} - Image ${index + 1}`}
                                className={`w-full h-20 object-cover rounded-lg border-2 ${
                                  item.thumbnail === imageUrl 
                                    ? 'border-blue-500 border-solid' 
                                    : 'border-gray-200'
                                }`}
                              />
                              
                              {/* 操作按钮容器 */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => setGalleryThumbnail(item.id, index)}
                                    className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                                    title="封面に設定"
                                  >
                                    📷
                                  </button>
                                  <button
                                    onClick={() => deleteGalleryImage(item.id, index)}
                                    className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                                    title="画像を削除"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>

                              {/* 图片序号 */}
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                {index + 1}
                              </div>

                              {/* 封面标识 */}
                              {item.thumbnail === imageUrl && (
                                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                  封面
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* コミック一覧 */}
        {activeTab === 'comic' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {comics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">コミックアイテムがありません</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {comics.map((item) => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {item.title}
                        {item.episode && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            第{item.episode}話
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        価格: {item.price} | いいね: {item.likesCount} | 
                        ページ数: {item.imageUrls?.length || 1} | 
                        作成日: {formatDate(item.createdAt)}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {item.description}
                        </p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/comic/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        表示
                      </a>
                      <button
                        onClick={() => deleteComic(item.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}