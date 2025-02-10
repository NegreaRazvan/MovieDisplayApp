
import Search from "./components/Search.jsx";
import {useEffect, useState} from "react";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./Appwrite.js";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    ///for the search bar
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    ///for the error messages
    const [errorMessage, setErrorMessage] = useState('');

    ///for the movies displayed
    const [movies, setMovies] = useState([]);

    ///for the loading animation
    const [isLoading, setIsLoading] = useState(false);

    ///for the trending movies displayed
    const [trendingMovies, setTrendingMovies] = useState([]);


    ///debouncing so that there aren't too many API requests
    ///we wait for the user to stop typing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try{
            const endpoint=query ?
                `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
                `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            ///Check if I got a response
            if(!response.ok)
                throw Error('Failed to fetch movies');

            ///Get the data
            const data = await response.json();

            ///Failed to get the data
            if(data.response ==='False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovies([]);
                return;
            }

            ///set the movies of the state
            setMovies(data.results);

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        }catch(e){
            console.error(`Error fetching movies: ${e}`);
            setErrorMessage('Error fetching movies');
        } finally {
            ///no longer loading: either it failed so there is nothing to load, or it fully loaded by the end
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }catch(e){
            ///potential problem
            ///If I was to setErrorMessage here, like you would maybe naturally do, it would actually break the whole application, just because the trend isn't working
            ///because we check if there is any error when we display the ul down bellow
            console.log(`Error fetching trending movies ${e}`);
        }
    }
    ///only do this when the user has finished typing something in the search bar
    ///potential problem
    ///If we had loadTrendingMovies inside here as well, then the trending display would always be refreshed when the user searched something,
    ///leading to many calls to the database, leading to a slower app
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    },[debouncedSearchTerm]);

    ///only do this at the start
    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main className="">
            <div className="bg-green-pattern w-screen h-screen bg-center bg-cover absolute z-0 object-fill">

            </div>
            <div className="px-5 py-12 xs:p-10 max-w-7xl mx-auto relative z-10">
                <header>
                    <img src="./movies.png" alt="Movie Banner"></img>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="mt-[40px]">
                        <h2>Trending Movies</h2>
                        <ul className="flex flex-row gap-2 mt-10 w-full overflow-y-auto hide-scrollbar">
                            {trendingMovies.map((movie,index) => (
                                <li className="min-w-[230px] flex flex-row items-center" key={movie.$id}>
                                    <p className="text-gray-100 fancy-text mt-[22px] ">{index + 1}</p>
                                    <img className="w-[127px] rounded-lg" src={movie.poster_url} alt={movie.title}></img>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="space-y-9">
                    <h2 className="mt-[40px]">Popular</h2>

                    {/*
                        if it's loading -> play the spinner animation
                        if there is an error -> display the error
                        if everything is ok -> display the movies
                    */}
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                            <p className="text-red-500">{errorMessage}</p>
                    ) : (
                            <ul className=" grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {movies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie}/>
                                ))}
                            </ul>
                    )}
                </section>
            </div>
        </main>
    )
}

export default App



