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
  const isRouter = href !== undefined;
  return (
    <div className="icon-button-container">
      {description.length === 0 ? (
        children
      ) : (
        <button
          className="icon-button"
          onClick={
            isRouter
              ? () => {
                  window.open(href);
                }
              : onClick
          }
        >
          {children}
          <p className="icon-button-description">{description}</p>
        </button>
      )}
      {isRouter ? <div className="icon-signal-green"></div> : null}
    </div>
  );
};

export default IconButton;
