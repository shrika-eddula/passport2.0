import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { OttoDashboardComponent } from "./dashboard";
// import { OldDashboard } from "./scratch";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>OTTO</title>
      </Head>
      <OttoDashboardComponent />
      {/* <OldDashboard /> */}
    </React.Fragment>
  );
}
