"use client";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { Movie } from "@/types/movie";
import { getPopularMovies, searchMovies } from "@/lib/api";
import { useDebounce } from "@/lib/useDebounce";

const queryClient = new QueryClient();

function MovieExplorer() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500) as string;
  const observer = useRef<IntersectionObserver | null>(null);

  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["movies", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const result = debouncedSearch.trim()
        ? await searchMovies(debouncedSearch, pageParam)
        : await getPopularMovies(pageParam);
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000 * 24,
  });


  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      if (node) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
        observer.current.observe(node);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    queryClient.invalidateQueries({ queryKey: ["movies"] });
  };

  const clearSearch = () => {
    setSearchValue("");
    queryClient.invalidateQueries({ queryKey: ["movies"] });
  };

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search for a movie..."
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 text-center">
          <p>Error: {(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {data?.pages[0].results.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No movies found for "{searchValue}"
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {data?.pages.map((page, pageIndex) =>
                page.results.map((movie, movieIndex) => {
                  const isLastItem =
                    pageIndex === data.pages.length - 1 &&
                    movieIndex === page.results.length - 1;
                  return (
                    <MovieCard
                      key={`${movie.id}-${pageIndex}-${movieIndex}`}
                      movie={movie}
                      onClick={(movie) => setSelectedMovie(movie)}
                      observerRef={isLastItem ? lastItemRef : undefined}
                    />
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {isFetchingNextPage && (
        <div className="h-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieExplorer />
    </QueryClientProvider>
  );
}
