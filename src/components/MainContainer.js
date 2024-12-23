import React from 'react'
import { useSelector } from 'react-redux'
import VideoTitle from './VideoTitle'
import VideoBackground from './VideoBackground'

const MainContainer = () => {
    // we will get the data from the redux store using selector
    const movies = useSelector(store => store.movies?.nowPlayingMovies)

    if(!movies) return;

    const mainMovies =movies[0]

    const {original_title, overview, id} = mainMovies;


  return (
    <div>
        <VideoTitle title={original_title} overview={overview} />
        <VideoBackground movieId={id}/>
    </div>
  )
}

export default MainContainer