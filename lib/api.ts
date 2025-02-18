import axios from 'axios';
import { MovieResponse, MovieDetails } from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async (page: number): Promise<MovieResponse> => {
  const response = await axios.get(`${BASE_URL}/movie/popular?language=en-US&api_key=${API_KEY}&page=${page}`);
  return response.data;
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  return response.data;
};
export const searchMovies = async (query: string, page: Number): Promise<MovieResponse> => {
  const response = await axios.get(`${BASE_URL}/search/movie?query=${query}&page=${page}&language=en-US&api_key=${API_KEY}`);
  return response.data;
}