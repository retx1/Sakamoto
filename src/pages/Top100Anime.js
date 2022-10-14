import axios from "axios";
import React, { useEffect, useState } from "react";
import AnimeGrid from "../components/AnimeGrid/AnimeGrid";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";
import { Helmet } from "react-helmet";

function Top100Anime({changeMetaArr}) {
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const title = "Top 100 Anime";
  const content= "Sakamoto - Watch Popular Anime Online";
  const image = "https://media.discordapp.net/attachments/1009328245533065288/1009328327909199904/8.png";

  useEffect(() => {
    getAnime();
  }, []);
  // React.useEffect(()=>{
  //   changeMetaArr("title", "Top 100 Anime")
  // })
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
      <Helmet>        
        <title>{title}</title>
        <meta
          property="og:description"
          content= {content}
        />
        <meta property="og:image" content={image} />
      </Helmet>
      {loading && <SearchResultsSkeleton name="Top 100 Anime" />}
      {!loading && (
        <AnimeGrid animeDetails={animeDetails} title="Top 100 Anime" />
      )}
    </div>
  );
}

export default Top100Anime;
