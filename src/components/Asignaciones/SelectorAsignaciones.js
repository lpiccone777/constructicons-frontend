import React from 'react';
import api from '../../services/api';

export default function SelectorAsignaciones({ tipo, entidadId, empleadoId, especialidadId }) {

  const asignar = () => {
    const payload = tipo === 'etapa'
      ? { etapaId: entidadId, empleadoId, especialidadId }
      : { tareaId: entidadId, empleadoId, especialidadId };

    if (empleadoId && tipo === 'tarea') {
      api.asignacionEmpleadoTarea.createAsignacion(payload)
        .then(() => alert('Asignación de empleado a tarea exitosa!'))
        .catch(err => alert(`Error: ${err}`));
    } else if (!empleadoId && tipo === 'etapa') {
      api.asignacionEspecialidadEtapa.createAsignacion(payload)
        .then(() => alert('Asignación de especialidad a etapa exitosa!'))
        .catch(err => alert(`Error: ${err}`));
    } else if (!empleadoId && tipo === 'tarea') {
      api.asignacionEspecialidadTarea.createAsignacion(payload)
        .then(() => alert('Asignación de especialidad a tarea exitosa!'))
        .catch(err => alert(`Error: ${err}`));
    } else {
      alert('Tipo de asignación no válida');
    }
  };

  return (
    <button className="bg-indigo-500 text-white px-4 py-2 rounded" onClick={asignar}>
      Asignar {empleadoId ? 'Empleado' : 'Especialidad'}
    </button>
  );
}
