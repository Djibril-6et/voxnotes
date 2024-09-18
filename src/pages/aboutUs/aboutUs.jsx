import React from "react";
import "./about.css"; // Assurez-vous d'ajouter les styles dans ce fichier

function About() {
  return (
    <div className="about-container">
      <section className="about-idea-container">
        <section className="about-idea-section">
          <h2 className="about-title">Notre Idée</h2>
          <p className="about-text">
            Chez <strong>VoxNotes</strong>, nous croyons en la puissance de la
            technologie pour simplifier la vie quotidienne. L&apos;idée de
            <strong>VoxNotes</strong> est née de notre envie de transformer le
            discours en texte, facilitant ainsi la capture d&apos;idées, la
            prise de notes, et le partage d&apos;informations. Que vous soyez un
            étudiant, un professionnel en réunion, ou un créateur de contenu,
            notre solution vous permet de convertir vos discours en texte clair
            et précis instantanément.
          </p>
        </section>

        <section className="about-history-section">
          <h2 className="about-title">Notre Histoire</h2>
          <p className="about-text">
            Nous sommes quatre étudiants récemment diplômés d&apos;écoles
            d&apos;informatique, passionnés par l&apos;innovation et la
            technologie. Après nos études, nous avons décidé de nous lancer dans
            le développement de
            <strong>VoxNotes</strong>, une idée qui nous tenait à cœur. Ce
            projet est né de notre volonté de rendre la prise de notes vocale
            accessible à tous, tout en perfectionnant nos compétences en
            développement. Nous avons travaillé dur pour concrétiser cette
            vision et nous sommes fiers de ce que nous avons accompli.
            <strong>VoxNotes</strong> continue d&apos;évoluer et nousavons hâte
            de voir où cette aventure nous mènera !
          </p>
        </section>
      </section>
    </div>
  );
}

export default About;
