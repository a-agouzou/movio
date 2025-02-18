import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "@/lib/api";
import { Movie } from "@/types/movie";
import Image from "next/image";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  const { data: movieDetails, isLoading } = useQuery({
    queryKey: ["movie", movie?.id],
    queryFn: () => (movie ? getMovieDetails(movie.id) : null),
    enabled: !!movie,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isLoading ? "Loading..." : movieDetails?.title}
          </DialogTitle>
          {movieDetails && (
            <DialogDescription>
              Released:
              {new Date(movieDetails.release_date).toLocaleDateString()}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center md:h-[400px] h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          </div>
        ) : movieDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-[400px]">
              <Image
                src={movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : "/no-image.png"}
                alt={`Movie poster for ${movieDetails.title}`}
                fill
                priority
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="space-y-4">
              <div aria-label="Movie overview">
                <p className="text-gray-600">{movieDetails.overview}</p>
              </div>

              <div className="space-y-2">
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="font-semibold w-24">Rating:</dt>
                    <dd>{movieDetails.vote_average.toFixed(1)}/10</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-semibold w-24">Runtime:</dt>
                    <dd>{movieDetails.runtime} minutes</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-semibold w-24">Genres:</dt>
                    <dd>
                      {movieDetails.genres
                        .map((genre) => genre.name)
                        .join(", ")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsModal;
