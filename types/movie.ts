export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    runtime?: number;
    genres?: { id: number; name: string }[];
    budget?: number;
  }
  
  export interface MovieDetails extends Movie {
    runtime: number;
    genres: { id: number; name: string }[];
    budget: number;
    revenue: number;
  }
  
  export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }