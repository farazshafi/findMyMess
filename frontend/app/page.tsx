import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { fetchMesses } from '../lib/api';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let messes: any[] = [];
  try {
    messes = await fetchMesses();
  } catch (error) {
    console.error('Failed to fetch Featured Messes:', error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20">
      <main className="flex flex-col gap-8 items-center text-center max-w-6xl w-full">

        <h1 className="text-5xl font-bold text-foreground">
          Find Your Perfect <span className="text-primary sm:bg-foreground sm:p-2 sm:text-4xl sm:rounded inline-block align-baseline">Mess</span>
        </h1>
        <p className="text-lg text-foreground-600 dark:text-foreground-300 max-w-xl">
          Discover the best messes in Kerala. Authentic food, affordable prices, and home-like feel.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/mess" className="w-full">
            <Button size="lg" className="w-full shadow-xl">
              Start Searching
            </Button>
          </Link>
          <Link href="/admin" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              List Your Mess
            </Button>
          </Link>
        </div>

        <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {messes.length > 0 ? (
            messes.map((mess) => (
              <Link href={`/mess/${mess._id}`} key={mess._id}>
                <Card className="h-full hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center text-foreground-400 overflow-hidden relative">
                      {mess.photos && mess.photos.length > 0 ? (
                        <img src={mess.photos[0]} alt={mess.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>No Photo</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground dark:text-light mb-2 text-left">{mess.name}</h3>
                    <p className="text-sm text-foreground-500 dark:text-foreground-400 mb-2 text-left">📍 {mess.area}</p>
                    <div className="text-left">
                      <span className="inline-block bg-secondary/10 text-light text-xs px-2 py-1 rounded-full font-semibold">
                        ₹{mess.priceRange}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No messes available at the moment. Check back later!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-5 row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-foreground-500">
        <p>© 2026 findMyMess. All rights reserved.</p>
      </footer>
    </div>
  );
}
