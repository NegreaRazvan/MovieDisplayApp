import React from 'react'

const MovieCard = ({movie : {title, vote_average, poster_path, release_date, original_language}}) => {

    return (
        <div className="bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/posterNotAvailable.png'} alt={title}/>
            <div className="mt-4">
                <h3 className="ml-0.5 text-white">{title}</h3>
                <div className="mt-2 flex flex-row items-center flex-wrap gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <img className="size-4 mb-0.5" src="./Star.png"/>
                        <p className=" font-bold text-base text-white"> {vote_average ? vote_average.toFixed(1): 'N/A'}</p>
                        <span className="text-sm text-gray-100">•</span>
                        <p className="capitalize text-gray-100 font-medium text-base">{original_language}</p>
                        <span className="text-sm text-gray-100">•</span>
                        <p className="capitalize text-gray-100 font-medium text-base"> {release_date ? release_date.split('-')[0]: 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MovieCard
