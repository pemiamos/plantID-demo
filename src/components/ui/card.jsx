import React from "react";
export function Card({ children }) {
  return <div className="card">{children}</div>;
}
export function CardContent({ children }) {
  return <div className="card-content">{children}</div>;
}
