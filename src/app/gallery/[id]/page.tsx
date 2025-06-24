'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const response = await fetch(`/api/gallery/${params.id}`);
        if (!response.ok) {
          throw new Error('Gallery item not found');
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error('Error fetching gallery item:', err);
        setError('ギャラリーアイテムの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGalleryItem();
    }
  }, [params.id]);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    const images = item?.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item?.thumbnail];
    if (images && images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = item?.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item?.thumbnail];
    if (images && images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return;
    
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, item]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">🎨</span>
          </div>
          <p className="text-white/60 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl text-red-400">⚠️</span>
          </div>
          <p className="text-red-300 text-lg mb-4">{error || 'ギャラリーアイテムが見つかりません'}</p>
          <button
            onClick={() => router.push('/main')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            メインページに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen">
        {/* 头部导航 */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.push('/main')}
              className="flex items-center space-x-2 px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>戻る</span>
            </button>
            <h1 className="text-xl font-bold text-white truncate max-w-md">{item.title}</h1>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </header>

        {/* 内容区域 */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* 图片网格显示 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {(item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item.thumbnail]).map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity duration-300 border border-white/20 hover:border-white/40"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={imageUrl}
                    alt={`${item.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* 图片放大模态框 */}
        {isModalOpen && item && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* 关闭按钮 */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 主图片 */}
              <img
                src={(item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item.thumbnail])[selectedImageIndex]}
                alt={`${item.title} - Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* 导航按钮 */}
              {(item.imageUrls && item.imageUrls.length > 1) || (!item.imageUrls && item.thumbnail) ? (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              ) : null}

              {/* 图片计数器 */}
              {(item.imageUrls && item.imageUrls.length > 1) && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 rounded-full text-white text-sm">
                  {selectedImageIndex + 1} / {item.imageUrls.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}