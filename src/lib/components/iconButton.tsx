"use client";

import "@/style/icon.css";
import { MouseEventHandler, ReactElement } from "react";

interface Props {
  children: ReactElement;
  description: string;
  onClick?: MouseEventHandler;
  href?: string;
}

const IconButton: React.FC<Props> = ({
  children,
  description,
  onClick,
  href,
}) => {
  return (
    <div className="icon-button-container">
      <button
        className="icon-button"
        onClick={
          href
            ? () => {
                window.open(href);
              }
            : onClick
        }
      >
        {children}
        {description && (
          <p className="icon-button-description">{description}</p>
        )}
      </button>
      {href ? <div className="icon-signal-green"></div> : null}
    </div>
  );
};

export default IconButton;
