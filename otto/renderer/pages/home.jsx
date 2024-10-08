import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { OttoDashboardComponent } from "./dashboard";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>OTTO</title>
      </Head>
      <OttoDashboardComponent />
    </React.Fragment>
  );
}
