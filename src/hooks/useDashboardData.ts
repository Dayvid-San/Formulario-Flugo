import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "../services/firebase";
import { Collaborator, SortKey } from '../types/collaborator';

export const useDashboardData = () => {
  // Estados de Dados
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [dbDepartments, setDbDepartments] = useState<{ value: string, label: string }[]>([]);
  
  // Estados de Interface (Filtros/Seleção)
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortKey>('titulo');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);

  // 1. Escutar Colaboradores no Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "colaboradores"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collaborator[];
      setCollaborators(list);
    });
    return () => unsubscribe();
  }, []);

  // 2. Escutar Departamentos no Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "departamentos"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        value: doc.data().nome,
        label: doc.data().nome
      }));
      setDbDepartments(list);
    });
    return () => unsubscribe();
  }, []);

  // 3. Lógica de Filtro e Busca
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(collab => {
      const matchesName = collab.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === 'Todos' || collab.cargo === departmentFilter;
      return matchesName && matchesDept;
    });
  }, [collaborators, searchTerm, departmentFilter]);

  // 4. Lógica de Ordenação
  const sortedCollaborators = useMemo(() => {
    return [...filteredCollaborators].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (sortBy === 'salario') {
        return order === 'asc' 
          ? Number(valueA || 0) - Number(valueB || 0) 
          : Number(valueB || 0) - Number(valueA || 0);
      }

      const strA = String(valueA || '').toLowerCase();
      const strB = String(valueB || '').toLowerCase();
      return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredCollaborators, sortBy, order]);

  // 5. Cálculos de Estatísticas
  const stats = useMemo(() => {
    const total = collaborators.length;
    const avgSalary = total > 0 
      ? collaborators.reduce((acc, curr) => acc + (Number(curr.salario) || 0), 0) / total 
      : 0;

    let largestDept = "Nenhum";
    if (total > 0) {
      const counts = collaborators.reduce((acc: any, curr) => {
        acc[curr.cargo] = (acc[curr.cargo] || 0) + 1;
        return acc;
      }, {});
      largestDept = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    return { total, avgSalary, largestDept };
  }, [collaborators]);

  // 6. Ações (Handlers)
  const updateField = async (id: string, field: string, newValue: any) => {
    try {
      await updateDoc(doc(db, "colaboradores", id), {
        [field]: newValue,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const deleteCollaborator = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este colaborador?")) {
      await deleteDoc(doc(db, "colaboradores", id));
    }
  };

  const deleteSelected = async () => {
    if (window.confirm(`Excluir ${selected.length} colaborador(es)?`)) {
      const batch = writeBatch(db);
      selected.forEach(id => batch.delete(doc(db, "colaboradores", id)));
      await batch.commit();
      setSelected([]);
    }
  };

  const toggleOrder = () => setOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return {
    // Dados
    sortedCollaborators,
    dbDepartments,
    stats,
    // Estados de Filtro
    searchTerm, setSearchTerm,
    departmentFilter, setDepartmentFilter,
    sortBy, setSortBy,
    order, toggleOrder,
    selected, setSelected,
    // Ações
    updateField,
    deleteCollaborator,
    deleteSelected
  };
};