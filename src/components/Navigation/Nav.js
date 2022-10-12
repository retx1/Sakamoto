import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { IconContext } from "react-icons";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function Nav() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      let lowerCase = e.target.value.toLowerCase();
      let titleLength = lowerCase.split(" ").join("").length;

      console.log(`${titleLength}`);

      if (titleLength > 0) navigate("/search/" + lowerCase);
      else navigate("/");
      e.target.value = "";
    }
  };

  return (
    <div>
      <NavBar>
        <Search>
          <Link to="/">
            <img src="./assets/logo.png" alt="Sakamoto" width="60" />
          </Link>
          <input
            id="input"
            type="text"
            required
            placeholder="Search Anime"
            autoFocus
            onKeyDown={keyPress}
          />
        </Search>
        <div className="nav-links">
          <Links to="/popular">Popular</Links>
          <Links to="/#">Forum</Links>
          <Links to="/help">Help</Links>
        </div>

        {width <= 600 && (
          <IconContext.Provider
            value={{
              size: "1.5rem",
              style: {
                verticalAlign: "middle",
                marginBottom: "0.2rem",
                marginRight: "0.3rem",
              },
            }}
          ></IconContext.Provider>
        )}
        {width > 600 && (
          <IconContext.Provider
            value={{
              size: "16px",
              style: {
                verticalAlign: "middle",
                marginBottom: "0.2rem",
                marginRight: "0.3rem",
              },
            }}
          ></IconContext.Provider>
        )}
      </NavBar>
    </div>
  );
}

const Links = styled(Link)`
  color: #ffffff;
  font-family: "Gilroy-Medium", sans-serif;
  text-decoration: none;
  padding: 0rem 1.3rem 0.5rem 1.3rem;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.8rem 5rem 0 5rem;
  div {
    display: flex;
  }
  div > input {
    margin-left: 1.8rem;
    width: 100%;
    flex: 0 0 100%;
  }
  @media screen and (max-width: 600px) {
    margin: 1rem 2rem;
    margin-top: 1rem;
    img {
      height: 1.7rem;
    }
    .nav-links {
      display: none;
    }
    div > input {
      flex: 0 0 80%;
    }
  }
  @media screen and (min-width: 750px) and (max-width: 817px) {
    div > input {
      flex: 0 0 80%;
    }
  }
  @media screen and (min-width: 694px) and (max-width: 749px) {
    div > input {
      flex: 0 0 70%;
    }
  }
  @media screen and (min-width: 601px) and (max-width: 693px) {
    div > input {
      flex: 0 0 60%;
      font-size: 10px;
    }
  }
`;

const Search = styled.div`
  input {
    border: none;
    height: 30px;
    border-radius: 10px;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    ::placeholder {
      color: #FFF;
    }
  }
`;

export default Nav;
