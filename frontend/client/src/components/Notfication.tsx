import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  Typography,
  Box,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AuctionIcon from "@mui/icons-material/AttachMoney";
import CheckIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import TimerIcon from "@mui/icons-material/AccessTime";
import ShoppingIcon from "@mui/icons-material/ShoppingCart";
import { useSocket } from "../context/SocketProvider";
import { useRouter } from 'next/navigation';
import { Notification, NotifType } from '../constants/types';

const NotificationIcons: Record<NotifType, typeof NotificationsIcon> = {
  [NotifType.WIN]: CheckIcon,
  [NotifType.NEW_BID]: AuctionIcon,
  [NotifType.OUTBID]: BlockIcon,
  [NotifType.SOMEONEBIDYOURITEM]: ShoppingIcon,
  [NotifType.AUCTIONENDED]: TimerIcon,
  [NotifType.NEWITEMLISTED]: ShoppingIcon,
  [NotifType.BIDDINGCLOSESOON]: TimerIcon,
  [NotifType.OUTBIDONYOURITEM]: BlockIcon,
  [NotifType.DEFAULT]: NotificationsIcon,
  [NotifType.AUCTION_END]: TimerIcon,
};

const NotificationColors: Record<NotifType, string> = {
  [NotifType.WIN]: "text-green-600",
  [NotifType.NEW_BID]: "text-blue-600",
  [NotifType.OUTBID]: "text-red-600",
  [NotifType.SOMEONEBIDYOURITEM]: "text-purple-600",
  [NotifType.AUCTIONENDED]: "text-gray-600",
  [NotifType.NEWITEMLISTED]: "text-blue-600",
  [NotifType.BIDDINGCLOSESOON]: "text-orange-600",
  [NotifType.OUTBIDONYOURITEM]: "text-red-600",
  [NotifType.DEFAULT]: "text-gray-600",
  [NotifType.AUCTION_END]: "text-orange-600"
};

const NotificationComponent = () => {
  const router = useRouter();
  const { 
    notifications: { unread, read }, 
    markNotificationAsRead, 
    clearNotifications,
    isConnected 
  } = useSocket();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    console.log('Connection status:', isConnected);
    console.log('Current notifications:', { unread, read });
  }, [isConnected, unread, read]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
    }

    handleClose();

    if (notification.auctionId) {
      switch(notification.type) {
        case NotifType.NEW_BID:
        case NotifType.OUTBID:
        case NotifType.SOMEONEBIDYOURITEM:
        case NotifType.OUTBIDONYOURITEM:
          router.push(`/auction/${notification.auctionId}`);
          break;
        case NotifType.AUCTIONENDED:
        case NotifType.AUCTION_END:
          router.push(`/auction/${notification.auctionId}/ended`);
          break;
        default:
          router.push(`/auctions`);
      }
    }
  };

  const formatTime = (date: any) => {
    if (!date) return "Invalid date";
  
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return "Invalid date";
  
    const now = new Date();
    const diff = now.getTime() - parsedDate.getTime();
    const minutes = Math.floor(diff / 60000);
  
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return parsedDate.toLocaleDateString();
  };
  

  const renderIcon = (type: NotifType) => {
    const Icon = NotificationIcons[type] || NotificationIcons[NotifType.DEFAULT];
    const colorClass = NotificationColors[type] || NotificationColors[NotifType.DEFAULT];
    return <Icon className={`mr-2 ${colorClass}`} />;
  };

  const allNotifications = [...unread, ...read];

  return (
    <div className="hidden sm:flex items-center">
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={unread.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 350, maxHeight: 500, overflow: 'auto' }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h6">
              Notifications
            </Typography>
            {allNotifications.length > 0 && (
              <Button 
                size="small" 
                onClick={() => {
                  clearNotifications();
                  handleClose();
                }}
              >
                Clear All
              </Button>
            )}
          </Box>

          <List>
            {allNotifications.length > 0 ? (
              allNotifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: notification.isRead ? 'background.paper' : 'action.hover',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    {renderIcon(notification.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.createdAt)}
                      </Typography>
                    </Box>
                    {!notification.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          ml: 1,
                          mt: 1,
                        }}
                      />
                    )}
                  </Box>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
                  No notifications
                </Typography>
              </ListItem>
            )}
          </List>
        </Box>
      </Popover>
    </div>
  );
};

export default NotificationComponent;