import React from "react";
import { Routes, Route } from "react-router";

import { publicRoutes } from "./allRoutes";
import Layout from "../components/Layout";

interface RouteUnit {
  component: JSX.Element;
  path: string;
}

const Index = () => {
  return (
    <>
      <Routes>
        <Route>
          {publicRoutes.map((route: RouteUnit, index: number) => (
            <Route
              element={<Layout>{route.component}</Layout>}
              key={index}
              path={route.path}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default Index;
