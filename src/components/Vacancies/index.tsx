import React, { useState, useEffect } from 'react';
import { Box, Stack, useTheme, CircularProgress, Alert } from '@mui/material';
import { useVacancy } from '../../state/vacancies';
import { useAuthContext } from '../../state/auth';
import { Vacancy } from './types';

import VacanciesHeader from './components/VacanciesHeader';
import VacancyCard from './components/VacancyCard';
import StatusConfirm from './dialogs/StatusConfirm';
import VacancyForm from './dialogs/VacancyForm';

const Vacancies: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const { user } = useAuthContext();
  const {
    vacancyList,
    loading,
    creating,
    updating,
    deleting,
    error,
    success,
    successMessage,
    getVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    clearSuccess,
    clearError,
  } = useVacancy();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [vacancyToToggle, setVacancyToToggle] = useState<Vacancy | null>(null);

  // Fetch vacancies on mount
  useEffect(() => {
    if (user?.salonId) {
      getVacancies(user.salonId);
    }
  }, [user?.salonId]); // Remove getVacancies from dependencies

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedIds(newExpanded);
  };

  const handleSave = (data: Partial<Vacancy>) => {
    // Validate salon ID exists
    if (!user?.salonId) {
      console.error('Salon ID is missing from auth context');
      return;
    }

    if (editingVacancy) {
      updateVacancy(editingVacancy.id, {
        ...data,
        salonId: user.salonId,
      });
    } else {
      createVacancy({
        ...data,
        salonId: user.salonId,
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteVacancy(id);
  };

  const confirmToggleStatus = () => {
    if (vacancyToToggle) {
      updateVacancy(vacancyToToggle.id, {
        status: vacancyToToggle.status === 'Open' ? 'Closed' : 'Open',
      });
      setStatusConfirmOpen(false);
      setVacancyToToggle(null);
    }
  };

  const filteredVacancies = vacancyList.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      className="animate-fadeIn"
      sx={{
        pb: 8,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'An error occurred while managing vacancies'}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <VacanciesHeader 
        count={vacancyList.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNew={() => { setEditingVacancy(null); setIsFormOpen(true); }}
        isDark={isDark}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {filteredVacancies.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ color: 'text.secondary', mb: 2 }}>
                No vacancies found
              </Box>
            </Box>
          ) : (
            filteredVacancies.map((vacancy, index) => (
              <VacancyCard 
                key={vacancy.id}
                vacancy={vacancy}
                index={index}
                isExpanded={expandedIds.has(vacancy.id)}
                onToggleExpand={toggleExpand}
                onToggleStatus={(v) => { setVacancyToToggle(v); setStatusConfirmOpen(true); }}
                onEdit={(v) => { setEditingVacancy(v); setIsFormOpen(true); }}
                onDelete={handleDelete}
                isDark={isDark}
                isDeleting={deleting}
              />
            ))
          )}
        </Stack>
      )}

      <VacancyForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingVacancy={editingVacancy}
        isDark={isDark}
        isLoading={creating || updating}
      />

      <StatusConfirm 
        open={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={confirmToggleStatus}
        vacancy={vacancyToToggle}
        isDark={isDark}
        isLoading={updating}
      />
    </Box>
  );
};

export default Vacancies;
