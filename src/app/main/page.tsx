'use client';

import Link from 'next/link';

const galleries = [
  { id: 1, title: '山水画集', thumbnail: '/file.svg' },
  { id: 2, title: '動物写真', thumbnail: '/globe.svg' },
  { id: 3, title: '都市風景', thumbnail: '/window.svg' },
];

const comics = [
  { id: 'a', title: '第1話', thumbnail: '/next.svg' },
  { id: 'b', title: '第2話', thumbnail: '/vercel.svg' },
];

export default function MainPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* —— ヘッダー —— */}
      <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
        <div className="text-2xl font-bold">絵の間</div>
        <nav className="flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            新規登録
          </Link>
        </nav>
      </header>

      {/* —— メインコンテンツ —— */}
      <main className="flex-1 p-6 space-y-8">
        {/* —— ギャラリーセクション —— */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">ギャラリー</h2>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
            {galleries.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-center text-sm">{item.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* —— 漫画セクション —— */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">漫画</h2>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
            {comics.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-center text-sm">{item.title}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
