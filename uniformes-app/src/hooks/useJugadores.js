import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost/PruebaTecnica/api.php';

export function useJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarJugadores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar datos');
      const data = await response.json();
      setJugadores(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar a la API');
    } finally {
      setLoading(false);
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
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoJugador)
      });
      if (res.ok) {
        await cargarJugadores(); // recargar lista
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
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
