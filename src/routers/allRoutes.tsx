import React from "react";

import PageMineGame from "../pages/PageMineGame";

const routePath = {
  mineGame: "/",
};

const publicRoutes = [
  { component: <PageMineGame />, path: routePath.mineGame },
];

export { routePath, publicRoutes };
