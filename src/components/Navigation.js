import {
  Home as HomeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { userRole } = useRole();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <WorkIcon /> Freelance Platform
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<HomeIcon />}
            >
              Главная
            </Button>

            {user ? (
              <>
                <Button
                  component={Link}
                  to="/projects"
                  color="inherit"
                  startIcon={<WorkIcon />}
                >
                  Проекты
                </Button>

                <Button
                  component={Link}
                  to="/chat"
                  color="inherit"
                  startIcon={
                    <Badge badgeContent={unreadCount} color="error">
                      <ChatIcon />
                    </Badge>
                  }
                >
                  Сообщения
                </Button>

                {userRole === 'executor' && (
                  <Button
                    component={Link}
                    to="/portfolio"
                    color="inherit"
                    startIcon={<WorkIcon />}
                  >
                    Портфолио
                  </Button>
                )}

                <Button
                  component={Link}
                  to="/profile"
                  color="inherit"
                  startIcon={<PersonIcon />}
                >
                  Профиль
                </Button>

                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Выйти
                </Button>

                {user && (
                  <>
                    <Menu.Item key="my-projects">
                      <Link to="/my-projects">Мои проекты</Link>
                    </Menu.Item>
                    <Menu.Item key="my-responses">
                      <Link to="/my-responses">Мои отклики</Link>
                    </Menu.Item>
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                >
                  Войти
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  color="inherit"
                  startIcon={<RegisterIcon />}
                >
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 