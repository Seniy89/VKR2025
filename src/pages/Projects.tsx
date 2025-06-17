import React from 'react';
import { Container, Typography } from '@mui/material';

const Projects: React.FC = () => {
  // TODO: добавить загрузку проектов с бэкенда
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Список проектов</Typography>
      {/* Здесь будет список проектов */}
    </Container>
  );
};

export default Projects; 