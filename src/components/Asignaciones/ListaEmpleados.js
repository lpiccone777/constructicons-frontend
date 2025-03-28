import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ListaEmpleados({ especialidadId, onSelectEmpleado }) {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    if (especialidadId) {
      api.empleados.getEmpleados({ especialidadId })
        .then(data => setEmpleados(data))
        .catch(err => console.error(err));
    }
  }, [especialidadId]);

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold">Empleados con Especialidad</h2>
      <ul>
        {empleados.map(emp => (
          <li key={emp.id}>
            <button className="text-green-600" onClick={() => onSelectEmpleado(emp)}>
              {emp.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
