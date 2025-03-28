import React, { useState } from 'react';
import ListaEspecialidades from './ListaEspecialidades';
import ListaEmpleados from './ListaEmpleados';
import SelectorAsignaciones from './SelectorAsignaciones';

export default function AsignacionesEtapasTareas({ tipo, entidadId }) {
  const [especialidad, setEspecialidad] = useState(null);
  const [empleado, setEmpleado] = useState(null);

  return (
    <div className="flex gap-4">
      <ListaEspecialidades onSelect={(e) => {
        setEspecialidad(e);
        setEmpleado(null);
      }} />
      
      {especialidad && (
        <ListaEmpleados especialidadId={especialidad.id} onSelectEmpleado={setEmpleado} />
      )}

      {(especialidad || empleado) && (
        <SelectorAsignaciones
          tipo={tipo}
          entidadId={entidadId}
          empleadoId={empleado?.id}
          especialidadId={empleado ? undefined : especialidad?.id}
        />
      )}
    </div>
  );
}
