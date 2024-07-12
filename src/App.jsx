import { useEffect, useState } from "react";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "3c94c870";

function App() {
  const [query, setQuery] = useState("fast");
  const [watched, setWatched] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function selectHandler(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function goBack() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoding(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`
          );

          if (!res.ok) throw new Error("Something wents wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          if (data.Response === "True") setMovies(data.Search);
        } catch (err) {
          setError(err.message);
          console.log(err.message);
        } finally {
          setIsLoding(false);
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovie();
    },
    [query]
  );

  return (
    <>
      <Nav>
        <Search query={query} setQuery={setQuery} />
        <Numresult movies={movies} />
      </Nav>
      <Main>
        <Box>
          {isLoding && <Loader />}
          {!isLoding && !error && (
            <SearchedMovieList movies={movies} selectHandler={selectHandler} />
          )}
          {error && <ErrorMes message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails goBack={goBack} selectedId={selectedId} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                selectHandler={selectHandler}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loding...</p>;
}

function ErrorMes({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Nav({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Numresult({ movies }) {
  return (
    <p className="num-results">
      {movies.length > 1 ? <strong>Found {movies.length} results</strong> : ""}
    </p>
  );
}
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Button({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

function SearchedMovieList({ movies, selectHandler }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} selectHandler={selectHandler} />
      ))}
    </ul>
  );
}
function Movie({ movie, selectHandler }) {
  return (
    <li onClick={() => selectHandler(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📆</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, goBack }) {
  return (
    <div className="details">
      <button className="btn-back" onClick={goBack}>
        &larr;
      </button>
      <h1>{selectedId}</h1>
    </div>
  );
}

export default App;
