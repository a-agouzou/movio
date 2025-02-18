import { Movie } from "@/types/movie";
import Image from "next/image";
interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      onClick={() => onClick(movie)}
    >
      <div className="relative h-[300px]">
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              // : "https://placehold.co/300x400?text=No+Image"
              : "/no-image.jpg"
          }
          alt={movie.title}
          width={300}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(movie.release_date).getFullYear()}
        </p>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
