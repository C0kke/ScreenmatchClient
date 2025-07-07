"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Link from "next/link";

export default function Home() {
  const BACK_URL = process.env.NEXT_PUBLIC_BACK_URL;
  const [search, setSearch] = useState("");
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;
  const totalPages = Math.ceil(filteredSeries.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const visibleSeries = filteredSeries.slice(startIndex, endIndex);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACK_URL}/series`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = response.data;
      setSeries(data);
      setFilteredSeries(data);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setCurrentPage(1);
    if (value === "") {
      setFilteredSeries(series);
      return;
    }
    setFilteredSeries(series.filter((serie) =>
      serie.titulo.toLowerCase().includes(event.target.value.toLowerCase())
    ));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>SCREENMATCH</h1>
        <div className={styles.getMore}>
          <Link href="/addTitles">
            <button>
              Obtener más títulos
            </button>
          </Link>
        </div>
      </header> 
      <main className={styles.main}>
        <p className={styles.description}>
          Bienvenido a ScreenMatch. Tu biblioteca personal de películas y series.
        </p>

        <div className={styles.searchInput}>
          <input className={styles.search} type="text" placeholder="Search..." value={search} onChange={handleSearchChange} />
          <button onClick={() => handleSearchChange({ target: { value: "" } })}> X </button>
        </div>

        <div className={styles.seriesButtons}>
          <button 
            className={styles.button}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <div className={styles.seriesContainer}>
            {visibleSeries.map((serie) => (
              <div key={serie.id} className={styles.seriesCard}>
                <img
                  src={serie.poster}
                  alt={`Portada de ${serie.titulo}` }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default_poster.jpg";
                  }}
                />
                <h3>{serie.titulo}</h3>
              </div>
            ))}
          </div>
         <button 
          className={styles.button}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
         >
          {">"}
          </button> 
        </div> 
        <p className={styles.pagination}>
          Página {currentPage} de {totalPages}
        </p>
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
