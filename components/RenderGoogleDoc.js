import React from "react";
import Image from "next/image";
import Airtable from "../components/Airtable";
import ReactDOM from "react-dom";
import ReactHtmlParser from "react-html-parser";

class RenderGoogleDoc extends React.Component {
  scriptsLoaded = {};

  render() {
    const { html } = this.props;
    const options = {
      transform: (node) => {
        if (node.name === "script") {
          if (typeof document === "undefined") return;
          if (this.scriptsLoaded[node.attribs.src]) {
            console.log("Script", node.attribs.src, "already loaded");
            return;
          }
          this.scriptsLoaded[node.attribs.src] = true;
          var script = document.createElement("script");
          script.src = node.attribs.src;
          script.onload = function () {
            console.log("script loaded:", node.attribs.src);
          };
          document.head.appendChild(script);
        }
        if (node.type === "tag" && node.name === "airtable") {
          return (
            <Airtable base={node.attribs.base} table={node.attribs.table} />
          );
        }
        if (node.type === "tag" && node.name === "img") {
          return (
            <Image
              src={node.attribs.src}
              width={node.attribs.width}
              height={node.attribs.height}
              layout="responsive"
            />
          );
        }
      },
    };
    return <div>{ReactHtmlParser(`<div>${html}</div>`, options)}</div>;
  }
}

export default RenderGoogleDoc;
