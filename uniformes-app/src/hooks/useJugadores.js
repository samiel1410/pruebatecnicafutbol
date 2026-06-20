import { useState, useEffect, useCallback } from 'react';
import baseJugadores from '../data/jugadores.json';

export function useJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarJugadores = useCallback(() => {
    setLoading(true);
    try {
      const guardados = localStorage.getItem('jugadoresData');
      if (guardados) {
        setJugadores(JSON.parse(guardados));
      } else {
        setJugadores(baseJugadores);
        localStorage.setItem('jugadoresData', JSON.stringify(baseJugadores));
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos locales');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, []);

  useEffect(() => {
    cargarJugadores();
  }, [cargarJugadores]);

  // Derivar categorías y sedes de la data cargada
  const categorias = [...new Set(jugadores.map(j => j.categoria))].sort();
  const sedes = [...new Set(jugadores.map(j => j.sede))].sort();

  const buscarJugador = useCallback((numero, categoria, sede) => {
    const n = String(numero).trim();
    const c = String(categoria).trim().toLowerCase();
    const s = String(sede).trim().toLowerCase();
    const encontrado = jugadores.find(j =>
      String(j.numero).trim() === n &&
      String(j.categoria).trim().toLowerCase() === c &&
      String(j.sede).trim().toLowerCase() === s
    );
    return encontrado
      ? { disponible: false, ocupante: `${encontrado.codigo} - ${encontrado.nombre}` }
      : { disponible: true, ocupante: null };
  }, [jugadores]);

  const guardarJugador = async (nuevoJugador) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const nuevo = {
            codigo: String(Date.now()).substring(7), // Genera un ID corto
            ...nuevoJugador
          };
          const nuevosDatos = [...jugadores, nuevo];
          setJugadores(nuevosDatos);
          localStorage.setItem('jugadoresData', JSON.stringify(nuevosDatos));
          resolve(true);
        } catch (err) {
          console.error(err);
          resolve(false);
        }
      }, 400);
    });
  };

  return {
    jugadores,
    categorias,
    sedes,
    loading,
    error,
    buscarJugador,
    guardarJugador,
    recargar: cargarJugadores
  };
}
