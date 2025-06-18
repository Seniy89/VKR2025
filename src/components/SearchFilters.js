import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

const FilterSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 
      'linear-gradient(45deg, rgba(255, 107, 0, 0.05) 25%, transparent 25%),' +
      'linear-gradient(-45deg, rgba(255, 107, 0, 0.05) 25%, transparent 25%),' +
      'linear-gradient(45deg, transparent 75%, rgba(255, 107, 0, 0.05) 75%),' +
      'linear-gradient(-45deg, transparent 75%, rgba(255, 107, 0, 0.05) 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    opacity: 0.1,
    pointerEvents: 'none',
  },
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SearchFilters = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    experience: [0, 10],
    rating: 0,
    priceRange: [0, 100000],
    availability: false,
    verified: false,
  });

  const categories = [
    'UI/UX Design',
    'Web Design',
    'Graphic Design',
    '3D Modeling',
    'Animation',
    'Illustration',
    'Branding',
    'Print Design',
  ];

  const handleSearchChange = (event) => {
    const newFilters = { ...filters, search: event.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperienceChange = (event, newValue) => {
    const newFilters = { ...filters, experience: newValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (event, newValue) => {
    const newFilters = { ...filters, rating: newValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (event, newValue) => {
    const newFilters = { ...filters, priceRange: newValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (name) => (event) => {
    const newFilters = { ...filters, [name]: event.target.checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <FilterSection elevation={0}>
      <FilterHeader>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Фильтры поиска
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
        </IconButton>
      </FilterHeader>

      <Collapse in={expanded}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск по названию или описанию..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Категории
        </Typography>
        <FormGroup sx={{ mb: 3 }}>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  sx={{
                    color: '#FF6B00',
                    '&.Mui-checked': {
                      color: '#FF6B00',
                    },
                  }}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Опыт работы (лет)
        </Typography>
        <Box sx={{ px: 2, mb: 3 }}>
          <Slider
            value={filters.experience}
            onChange={handleExperienceChange}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            sx={{
              color: '#FF6B00',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255, 107, 0, 0.16)',
                },
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Рейтинг
        </Typography>
        <Box sx={{ px: 2, mb: 3 }}>
          <Slider
            value={filters.rating}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            min={0}
            max={5}
            step={0.5}
            sx={{
              color: '#FF6B00',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255, 107, 0, 0.16)',
                },
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Бюджет (₽)
        </Typography>
        <Box sx={{ px: 2, mb: 3 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={1000}
            sx={{
              color: '#FF6B00',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255, 107, 0, 0.16)',
                },
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.availability}
                onChange={handleCheckboxChange('availability')}
                sx={{
                  color: '#FF6B00',
                  '&.Mui-checked': {
                    color: '#FF6B00',
                  },
                }}
              />
            }
            label="Доступен для работы"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.verified}
                onChange={handleCheckboxChange('verified')}
                sx={{
                  color: '#FF6B00',
                  '&.Mui-checked': {
                    color: '#FF6B00',
                  },
                }}
              />
            }
            label="Верифицированный профиль"
          />
        </FormGroup>
      </Collapse>
    </FilterSection>
  );
};

export default SearchFilters; 