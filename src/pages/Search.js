import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Tabs, Tab } from '@mui/material';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';

const Search = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({});
  const [favorites, setFavorites] = useState([]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Здесь будет логика фильтрации результатов
    console.log('Filters changed:', newFilters);
  };

  const handleFavoriteToggle = (id) => {
    setFavorites(prev => 
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Поиск
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1.1rem',
            },
            '& .Mui-selected': {
              color: '#FF6B00 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF6B00',
            },
          }}
        >
          <Tab label="Исполнители" />
          <Tab label="Проекты" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <SearchFilters onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item xs={12} md={9}>
          <SearchResults
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search; 