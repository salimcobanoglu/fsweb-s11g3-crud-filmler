import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";

import MovieHeader from "./components/MovieHeader";
import EditMovieForm from "./components/EditMovieForm";
import FavoriteMovieList from "./components/FavoriteMovieList";

import axios from "axios";
import AddMovieForm from "./components/AddMovieForm";

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const history = useHistory();
  useEffect(() => {
    axios
      .get("http://localhost:9000/api/movies")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteMovie = (id) => {
    axios
      .delete("http://localhost:9000/api/movies/" + id)
      .then((res) => {
        console.log("film silindi", res.data);
        history.push("/movies");
      })
      .catch((err) => console.log(err));
  };

  const addToFavorites = (movie) => {
    const isAlreadyInFavorites = favoriteMovies.find(
      (favorite) => favorite.id === movie.id
    );
    if (!isAlreadyInFavorites) {
      const updatedFavorites = [...favoriteMovies, movie];
      setFavoriteMovies(updatedFavorites);

      localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
    }
  };
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
      setFavoriteMovies(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favoriteMovies={favoriteMovies} />

          <Switch>
            <Route exact path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>
            <Route exact path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>
            <Route exact path="/movies/:id">
              <Movie
                deleteMovie={deleteMovie}
                addToFavorites={addToFavorites}
              />
            </Route>

            <Route exact path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
