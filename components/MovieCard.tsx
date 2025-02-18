import { Movie } from "@/types/movie";
import Image from "next/image";
import React from "react";
interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  observerRef?: (node: HTMLDivElement | null) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, observerRef }) => {
  
  const raitingFormatter : (raiting : Number | null | undefined) => string = (raiting) => {
    if(raiting === null || raiting === undefined || Number.isNaN(raiting)) return "N/A";
    return raiting.toFixed(1);
  }

  const dateFormatter = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getFullYear()) ? 'N/A' : date.getFullYear().toString();
  };
  return (
    <div
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      onClick={() => onClick(movie)}
      ref={observerRef}
    >
      <div className="relative h-[300px]">
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-image.jpg"
          }
          alt={movie.title}
          width={300}
          priority
          height={400}
          className="w-full h-full object-cover"

        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
        <p className="text-sm text-gray-500">
          {dateFormatter(movie.release_date)}
        </p>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{raitingFormatter(movie.vote_average)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

