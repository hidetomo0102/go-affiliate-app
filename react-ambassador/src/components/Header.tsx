import React, { useState } from "react";

export const Header = () => {
  const [title, setTitle] = useState("Welcome");
  const [description, setDescription] = useState("Share links");

  return (
    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">{title}</h1>
          <p className="lead text-muted">{description}</p>
          {`buttons`}
        </div>
      </div>
    </section>
  );
};
