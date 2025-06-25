import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemIcon, ListItemText, Avatar, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Menu as MenuIcon, ChevronLeft, Dashboard, Event, LocationOn, 
  AttachMoney, Person, Logout, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';

// Drawer width
const drawerWidth = 260;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // State
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [financialMenuOpen, setFinancialMenuOpen] = useState(false);
  
  // Handlers
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleNavigate = (path) => {
    navigate(path);
  };
  
  const toggleFinancialMenu = () => {
    setFinancialMenuOpen(!financialMenuOpen);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Tour Planning Assistant
          </Typography>
          
          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            aria-controls="profile-menu"
            aria-haspopup="true"
          >
            <Avatar alt={user?.name} src={user?.profileImage}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Side Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </Box>
          
          <List>
            {/* Dashboard */}
            <ListItem button onClick={() => handleNavigate('/')}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            
            {/* Tours */}
            <ListItem button onClick={() => handleNavigate('/tours')}>
              <ListItemIcon>
                <Event />
              </ListItemIcon>
              <ListItemText primary="Tours" />
            </ListItem>
            
            {/* Events */}
            <ListItem button onClick={() => handleNavigate('/events')}>
              <ListItemIcon>
                <Event />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItem>
            
            {/* Venues */}
            <ListItem button onClick={() => handleNavigate('/venues')}>
              <ListItemIcon>
                <LocationOn />
              </ListItemIcon>
              <ListItemText primary="Venues" />
            </ListItem>
            
            {/* Financials */}
            <ListItem button onClick={toggleFinancialMenu}>
              <ListItemIcon>
                <AttachMoney />
              </ListItemIcon>
              <ListItemText primary="Financials" />
              {financialMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            
            {financialMenuOpen && (
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/finances')}>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/finances/expenses')}>
                  <ListItemText primary="Expenses" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/finances/revenue')}>
                  <ListItemText primary="Revenue" />
                </ListItem>
              </List>
            )}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Profile */}
          <List>
            <ListItem button onClick={() => handleNavigate('/profile')}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;