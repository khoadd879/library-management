/**
 * Global Book Cache - Share data between homepage and allBooks page
 * Cache persists across component mounts to avoid refetching
 */

export interface CachedBook {
    idBook: string;
    nameBook: string;
    image: string;
    authors?: { nameAuthor: string; idTypeBook?: { idTypeBook: string; nameTypeBook: string } }[];
    star?: number;
    reprintYear?: number;
    isLiked?: boolean;
    describe?: string;
    publisher?: string;
    valueOfbook?: number;
    Evaluations?: any[];
}

interface BookCacheData {
    books: CachedBook[] | null;
    timestamp: number;
}

// Global cache instance - survives across component mounts
const globalBookCache: BookCacheData = {
    books: null,
    timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached books if valid, otherwise return null
 */
export const getCachedBooks = (): CachedBook[] | null => {
    const now = Date.now();
    if (globalBookCache.books && (now - globalBookCache.timestamp) < CACHE_DURATION) {
        console.log('📚 [BookCache] Sử dụng dữ liệu từ global cache');
        return globalBookCache.books;
    }
    return null;
};

/**
 * Save books to global cache
 */
export const setCachedBooks = (books: CachedBook[]): void => {
    globalBookCache.books = books;
    globalBookCache.timestamp = Date.now();
    console.log('💾 [BookCache] Đã lưu dữ liệu vào global cache:', books.length, 'sách');
};

/**
 * Force clear the cache (use when refresh button clicked)
 */
export const clearBookCache = (): void => {
    globalBookCache.books = null;
    globalBookCache.timestamp = 0;
    console.log('🗑️ [BookCache] Đã xóa cache');
};

/**
 * Check if cache is valid
 */
export const isCacheValid = (): boolean => {
    const now = Date.now();
    return !!(globalBookCache.books && (now - globalBookCache.timestamp) < CACHE_DURATION);
};

/**
 * Get cache age in seconds
 */
export const getCacheAge = (): number => {
    if (!globalBookCache.timestamp) return -1;
    return Math.floor((Date.now() - globalBookCache.timestamp) / 1000);
};

/**
 * Update a specific book in cache (e.g., when liking)
 */
export const updateBookInCache = (bookId: string, updates: Partial<CachedBook>): void => {
    if (globalBookCache.books) {
        globalBookCache.books = globalBookCache.books.map(book =>
            book.idBook === bookId ? { ...book, ...updates } : book
        );
    }
};
