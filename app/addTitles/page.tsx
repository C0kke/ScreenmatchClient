"use client";
import { useEffect, useRef, useState } from 'react';
import styles from '../page.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function AddTitles() {
  const BACK_URL = process.env.NEXT_PUBLIC_BACK_URL;
  const [titles, setTitles] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearchChange = async () => {
    if (search === "") {
      setTitles([]);
      return;
    }
    try {
      const response = await axios.get(`${BACK_URL}/consola/search?nombre=${search}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = response.data;
      setTitles(data);
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  const addTitle = async (titulo) => {
    console.log("Adding title:", titulo);
    if (!titulo.imdbID) {
      alert("Ocurrió un error al intentar añadir el título. Por favor, inténtalo de nuevo.");
      return;
    }

    if (window.confirm(`¿Estás seguro de añadir ${titulo.titulo}?`)) {
      console.log("Adding title with ID:", titulo.imdbID, titulo.titulo);
    }
    try {
      const response = await axios.post(`${BACK_URL}/consola/importById?imdbID=${titulo.imdbID}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Title added:", response.data);
      alert("Título añadido con éxito!");
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert("El título ya existe en la base de datos.");
        return;
      }
      alert("Error al añadir el título.");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>SCREENMATCH</h1>
        <div className={styles.getMore}>
          <button onClick={() => window.location.replace("/")}>
            Volver a la página principal
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <p className={styles.description}>
          <strong>Busca y agrega los títulos que quieras</strong>
        </p>
        <div className={styles.searchInput}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => handleSearchChange(search)}>Search</button>
        </div>
        <div className={styles.seriesContainer}>
          {titles.map((title) => (
            <div key={title.id} className={styles.seriesCard} onClick={() => addTitle(title)}>
              <img src={title.poster} alt={title.titulo} />
              <h2>{title.titulo}</h2>
              <p>{title.año}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <p>
          Diseñado por <strong>Jorge Bustos</strong>
        </p>
        <a
          href="https://github.com/C0kke"
          target="_blank"
        >
          <FontAwesomeIcon icon={faGithub} />
          Visita mi Github
        </a>
      </footer>
    </div>
  );
} 