import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import MainContent from "../components/MainContent";

const Home = () => {
  const [selectedView, setSelectedView] = useState("dashboard");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onSelect={setSelectedView} />
      <div className="flex flex-col flex-1">
        <NavBar />
        <MainContent view={selectedView} />
      </div>
    </div>
  );
};

export default Home;
