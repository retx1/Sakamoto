import axios from "axios";
import React, { useEffect, useState } from "react";
import AnimeGrid from "../components/AnimeGrid/AnimeGrid";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";

function Top100Anime({changeMetaArr}) {
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnime();
  }, []);
  React.useEffect(()=>{
    changeMetaArr("title", "Top 100 Anime")
  })
  async function getAnime() {
    window.scrollTo(0, 0);
    let res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/top100?page=1&count=50`
    );
    setLoading(false);
    setAnimeDetails(res.data.data.Page.media);
  }
  return (
    <div>
      {loading && <SearchResultsSkeleton name="Top 100 Anime" />}
      {!loading && (
        <AnimeGrid animeDetails={animeDetails} title="Top 100 Anime" />
      )}
    </div>
  );
}

export default Top100Anime;
