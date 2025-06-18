import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  Link,
  styled
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(45, 45, 45, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 107, 0, 0.2)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(255, 107, 0, 0.2)'
  }
}));

const PortfolioCard = ({ portfolio, onEdit, onDelete, isOwner }) => {
  const {
    title,
    description,
    image,
    technologies,
    demoUrl,
    githubUrl,
    rating
  } = portfolio;

  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={image || 'https://via.placeholder.com/400x200?text=No+Image'}
        alt={title}
        sx={{
          objectFit: 'cover',
          borderBottom: '1px solid rgba(255, 107, 0, 0.2)'
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
            {title}
          </Typography>
          {isOwner && (
            <Box>
              <IconButton
                size="small"
                onClick={() => onEdit(portfolio)}
                sx={{ color: '#FF6B00' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(portfolio._id)}
                sx={{ color: '#FF6B00' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            color: 'rgba(255, 255, 255, 0.7)',
            flexGrow: 1
          }}
        >
          {description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          {technologies.map((tech, index) => (
            <Chip
              key={index}
              label={tech}
              size="small"
              sx={{
                mr: 0.5,
                mb: 0.5,
                background: 'rgba(255, 107, 0, 0.1)',
                color: '#FF6B00',
                border: '1px solid rgba(255, 107, 0, 0.3)'
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={rating}
            readOnly
            precision={0.5}
            sx={{ color: '#FF6B00' }}
          />
          <Typography
            variant="body2"
            sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {rating.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {demoUrl && (
            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#FF6B00',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <LaunchIcon sx={{ mr: 0.5 }} />
              Демо
            </Link>
          )}
          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#FF6B00',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <GitHubIcon sx={{ mr: 0.5 }} />
              GitHub
            </Link>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default PortfolioCard; 