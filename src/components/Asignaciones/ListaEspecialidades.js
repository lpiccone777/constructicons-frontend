import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ListaEspecialidades({onSelect}) {
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    api.especialidades.getEspecialidades()
      .then(data => setEspecialidades(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold">Especialidades Disponibles</h2>
      <ul>
        {especialidades.map(e => (
          <li key={e.id}>
            <button className="text-blue-600" onClick={() => onSelect(e)}>
              {e.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
