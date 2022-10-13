import axios from "axios";
import React, { useEffect, useState } from "react";
import AnimeGrid from "../components/AnimeGrid/AnimeGrid";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";
import { Helmet } from "react-helmet";

function TrendingAnime({changeMetaArr}) {
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const title = "Trending Anime";
  const content= "Trending Anime";
  const image = "https://media.discordapp.net/attachments/1009328245533065288/1009328327909199904/8.png";

  useEffect(() => {
    getAnime();
  }, []);
  React.useEffect(()=>{
    changeMetaArr("title", "Trending Anime")
  })
  async function getAnime() {
    window.scrollTo(0, 0);
    let res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/trending?page=1&count=50`
    );
    setLoading(false);
    setAnimeDetails(res.data.data.Page.media);
  }
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta
          property="og:description"
          content= {content}
        />
        <meta property="og:image" content={image} />
      </Helmet>
      {loading && <SearchResultsSkeleton name="Trending Anime" />}
      {!loading && (
        <AnimeGrid animeDetails={animeDetails} title="Trending Anime" />
      )}
    </div>
  );
}

export default TrendingAnime;
