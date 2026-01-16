import { useState } from "react";
import Navbar from "../components/Navbar";
import NetworkBanner from "../components/NetworkBanner";
import TodayTopShow from "../components/TodayTopShow";
import ShowGrid from "../components/ShowGrid";
import Search from "./Search";
import Profile from "./Profile";

export default function Home() {
  const [page, setPage] = useState("home");

  return (
    <>
      <NetworkBanner />
      <Navbar current={page} onNavigate={setPage} />

      {page === "home" && (
        <>
          <TodayTopShow />
          <ShowGrid />
        </>
      )}

      {page === "search" && <Search />}
      {page === "profile" && <Profile />}
    </>
  );
}
