import React from "react";
import Image from "next/image";
import ReactDOM from "react-dom";

class RenderGoogleDoc extends React.Component {
  prepare(ref) {
    if (!ref || !ref.querySelectorAll) return;
    const images = Array.from(ref.querySelectorAll("img"));
    images.forEach((img) => {
      ReactDOM.render(
        <Image
          src={img.src}
          width={img.width}
          height={img.height}
          layout="intrinsic"
        />,
        img.parentNode
      );
    });
  }

  render() {
    const { html } = this.props;
    return (
      <div ref={this.prepare} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
}

export default RenderGoogleDoc;
